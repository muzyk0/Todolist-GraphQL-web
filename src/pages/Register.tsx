import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegisterMutation } from "../generated/graphql";
import { useNavigate } from "react-router";

interface FormData {
    name: string;
    email: string;
    password: string;
}

const schema = yup
    .object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
    })
    .required();

export const Register: React.FC = () => {
    /** React hook form */
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    const [registerMutation] = useRegisterMutation();

    const onSubmit = handleSubmit(async (data) => {
        const response = await registerMutation({
            variables: data,
        });

        if (response.errors) {
            alert(response.errors[0].message);
        } else {
            navigate("/");
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Your name</label>
                <input {...register("name")} />
                {errors.name && "Name is required"}
            </div>
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
