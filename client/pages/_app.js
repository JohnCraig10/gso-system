import "../styles/globals.css";
// import { AuthContext, AuthProvider } from "../helpers/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthProvider, useAuthDispatch, useAuthState } from "../context/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Axios from "axios";
import { SWRConfig } from "swr";

Axios.defaults.withCredentials = true;

const fetcher = async (...args) =>
    await Axios.get(...args).then((res) => res.data);

function MyApp({ Component, pageProps, userData }) {
    const { loading } = useAuthState();
    const router = useRouter();
    const { pathname } = useRouter();
    const authRoutes = ["/login"];
    const authRoute = authRoutes.includes(pathname);

    // const [authState, setAuthState] = useState({
    //     username: "",
    //     id: 0,
    //     barangayId: null,
    //     barangayName: "",
    //     status: false,
    // });

    // useEffect(() => {
    //     axios
    //         .get("http://localhost:3001/user/auth", {
    //             headers: {
    //                 accessToken: localStorage.getItem("accessToken"),
    //             },
    //         })
    //         .then((res) => {
    //             if (res.data.error) {
    //                 console.log(res.data.error);
    //                 setAuthState({ ...authState, status: false });
    //             } else {
    //                 let barangayId = res.data.barangayId;
    //                 if (res.data.barangayId == null) {
    //                     barangayId = 0;
    //                 }
    //                 setAuthState({
    //                     username: res.data.username,
    //                     id: res.data.id,
    //                     barangayId: barangayId,
    //                     barangayName: res.data.barangayName,
    //                     status: true,
    //                 });
    //             }
    //         });
    // }, []);

    return (
        <SWRConfig value={{ fetcher }}>
            <AuthProvider>
                <div className="flex">
                    {/* {router.pathname != "/" &&
                    router.pathname != "/login" &&
                    authState.username != "" && <Sidebar />} */}
                    {!authRoute && <Sidebar />}
                    <div className="flex flex-col flex-grow">
                        {/* {router.pathname != "/" &&
                        router.pathname != "/login" &&
                        authState.username != "" && <Navbar />} */}
                        {!authRoute && <Navbar />}
                        <Component {...pageProps} />
                    </div>
                </div>
            </AuthProvider>
        </SWRConfig>
    );
}

export default MyApp;
