import { useRouter } from "next/router";
import React, { useContext, useState, useTransition } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Avatar from "react-avatar";
import { Icon } from "@iconify/react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import Axios from "axios";

function Sidebar() {
    const { user, authenticated, loading, isSidebarOpen } = useAuthState();
    const router = useRouter();
    const dispatch = useAuthDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [isPending, startTransition] = useTransition();

    if (!authenticated && !loading) {
        return null;
    }

    const logout = async () => {
        await Axios.get("http://localhost:3001/user/logout");
        dispatch("LOGOUT");
        router.push("/login");
    };

    return (
        <>
            {authenticated && !loading && isSidebarOpen && (
                <div className="flex flex-col sticky top-0 h-screen bg-gray-800 text-white min-w-[240px] min-[256px] pb-3 overflow-auto overflow-x-hidden">
                    <div className="flex items-center pl-4 pr-6 mb-4 border-b border-gray-700 select-none min-h-[56px]">
                        <div
                            onClick={() => dispatch("CLOSE_SIDEBAR")}
                            className="p-2 mr-[9px] rounded-full cursor-pointer active:bg-gray-700"
                        >
                            <Icon
                                icon="mdi-light:menu"
                                className="w-6 h-6 text-white"
                            />
                        </div>
                        <div
                            onClick={() => router.push("/")}
                            className="flex items-center cursor-pointer"
                        >
                            <div className="p-[6px] mr-1 bg-white rounded-full w-fit">
                                <Icon
                                    icon="bxs:leaf"
                                    className="w-3 h-3 text-gray-800"
                                />
                            </div>
                            <p className="text-base font-medium">GSO System</p>
                        </div>
                    </div>

                    {/* <hr className="mb-4 border-gray-700" /> */}

                    <div
                        onClick={() => router.push("/")}
                        className="flex items-center py-3 pl-6 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="ic:baseline-home"
                        />
                        <p>Home</p>
                    </div>
                    {!user?.isAdmin && !loading && (
                        <div
                            onClick={() => router.push("/submission")}
                            className="flex items-center py-3 pl-6 hover:cursor-pointer hover:bg-gray-700"
                        >
                            <Icon
                                className="w-6 h-6 mr-4"
                                icon="fluent:document-arrow-up-20-filled"
                            />
                            <p>Submit</p>
                        </div>
                    )}

                    <div
                        onClick={() => router.push("/route")}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="ic:baseline-route"
                        />
                        <p>Route</p>
                    </div>
                    <div
                        onClick={() => router.push("/announcement")}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon className="w-6 h-6 mr-4" icon="mdi:bullhorn" />
                        <p>Announcement</p>
                    </div>
                    <div
                        onClick={() => router.push("/concerns")}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="ri:feedback-fill"
                        />
                        <p>Concerns and issues</p>
                    </div>
                    <div
                        onClick={() => router.push("/statistics")}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="bxs:pie-chart-alt-2"
                        />
                        <p>Statistics</p>
                    </div>

                    {!loading ? (
                        <>
                            {user?.isAdmin && (
                                <div
                                    onClick={() =>
                                        router.push("/databaseManagement")
                                    }
                                    className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                                >
                                    <Icon
                                        className="w-6 h-6 mr-4"
                                        icon="mdi:database-cog"
                                    />
                                    <p>Database Management</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center py-3 pl-6 border-gray-300 cursor-default select-none animate-pulse">
                            <div className="w-6 h-5 mr-4 bg-white" />
                            <p>Loading...</p>
                        </div>
                    )}

                    <hr className="my-4 border-gray-700" />
                    <div
                        onClick={() => router.push("/aboutUs")}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="ic:baseline-info"
                        />
                        <p>About us</p>
                    </div>
                    <div
                        onClick={logout}
                        className="flex items-center py-3 pl-6 border-gray-300 hover:cursor-pointer hover:bg-gray-700"
                    >
                        <Icon
                            className="w-6 h-6 mr-4"
                            icon="ic:twotone-logout"
                        />
                        <p>Logout</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
