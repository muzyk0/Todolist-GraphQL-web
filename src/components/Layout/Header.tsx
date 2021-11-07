import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../../accessToken";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";

interface Props {}

const pageList = [
    {
        path: "/",
        title: "Home",
    },
    {
        path: "/register",
        title: "Register",
    },
    {
        path: "/login",
        title: "Login",
    },
];

export const Header: React.FC<Props> = () => {
    const { data, loading } = useMeQuery();
    const [logout, { client }] = useLogoutMutation();

    let body: JSX.Element | null = null;

    if (loading) {
        body = null;
    } else if (data && data.me) {
        body = (
            <div>
                {data.me.name}
                <span>
                    <button
                        onClick={async () => {
                            await logout();
                            setAccessToken("");
                            client.resetStore();
                        }}
                    >
                        logout
                    </button>
                </span>
            </div>
        );
    } else {
        body = <div>not logged in</div>;
    }

    return (
        <header>
            {pageList.map((page, index) => (
                <div key={`${page.path}-${index}`}>
                    <Link to={page.path}>{page.title}</Link>
                </div>
            ))}
            <div>{body}</div>
        </header>
    );
};
