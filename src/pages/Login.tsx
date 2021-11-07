import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { setAccessToken } from "../accessToken";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";

interface FormData {
    email: string;
    password: string;
}

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
    })
    .required();

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    const [loginMutation] = useLoginMutation({
        update: (cache, { data }) => {
            if (!data) {
                return null;
            }
            cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                    me: data.login.user,
                },
            });
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        const response = await loginMutation({
            variables: data,
        });

        if (response.errors) {
            alert(response.errors[0].message);
        } else {
            if (response.data) {
                setAccessToken(response.data.login.accessToken);
            }
            navigate("/");
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Email</label>
                <input {...register("email")} />
                {errors.email && "Incorrect email"}
            </div>

            <div>
                <label>Password</label>
                <input {...register("password")} type="password" />
                {errors.password && "Password should be longer 6 character"}
            </div>

            <button type="submit">register</button>
        </form>
    );
};
