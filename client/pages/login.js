import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { AuthContext } from "../helpers/AuthContext";
import { useAuthDispatch, useAuthState } from "../context/auth";

function login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);
    const dispatch = useAuthDispatch();
    const router = useRouter();
    const { user, authenticated, loading, isSidebarOpen } = useAuthState();

    const login = async (e) => {
        e.preventDefault();
        const data = { username: username, password: password };

        await Axios.post("http://localhost:3001/user/login", data, {
            withCredentials: true,
        }).then((res) => {
            if (res.data.error) {
                alert(res.data.error);
            } else {
                // let barangayId = res.data.barangayId;
                // if (res.data.barangayId == null) {
                //     barangayId = 0;
                // }
                // console.log(res);
                // localStorage.setItem("accessToken", res.data.token);
                // setAuthState({
                //     username: res.data.username,
                //     id: res.data.id,
                //     barangayId: barangayId,
                //     barangayName: res.data.barangayName,
                //     status: true,
                // });
                dispatch("LOGIN", res.data);
                // console.log(res.data);
                router.push("/");
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={login} className="w-full max-w-sm">
                <p className="mb-6 text-4xl">Login</p>
                <p>Username</p>

                <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 mb-4 border"
                />
                <p>Password</p>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 border"
                />
                <button
                    type="submit"
                    className="px-6 py-1 mt-4 text-white bg-blue-500 active:ring"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default login;
