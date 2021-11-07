import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
    const { data } = useUsersQuery({ fetchPolicy: "network-only" });
    return (
        <div>
            <ul>
                {data?.users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                ))}
            </ul>
        </div>
    );
};
