import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { setAccessToken } from "./accessToken";
import { Layout } from "./components/Layout/Layout";
import { RoutesContainer } from "./Routes";

export const App: React.FC = () => {
    const [loading, setLoadint] = useState(true);

    useLayoutEffect(() => {
        fetch("http://localhost:5000/refresh_token", {
            method: "POST",
            credentials: "include",
        }).then(async (req) => {
            const { accessToken } = await req.json();
            setAccessToken(accessToken);
            setLoadint(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Layout>
                <RoutesContainer />
            </Layout>
        </BrowserRouter>
    );
};
