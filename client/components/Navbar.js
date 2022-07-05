import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Avatar from "react-avatar";
import { useAuthDispatch, useAuthState } from "../context/auth";

function Navbar({ userData }) {
    const { user, authenticated, loading, isSidebarOpen } = useAuthState();
    const router = useRouter();
    const dispatch = useAuthDispatch();

    return (
        <>
            {authenticated && !loading && (
                <div
                    className={`sticky top-0 flex items-center pl-4 pr-6 border-b h-14 bg-gray-50 select-none ${
                        isSidebarOpen ? "justify-end" : "justify-between"
                    }`}
                >
                    {!isSidebarOpen && (
                        <div
                            onClick={() => dispatch("OPEN_SIDEBAR")}
                            className="p-2 mr-[9px] rounded-full cursor-pointer active:bg-gray-200"
                        >
                            <Icon icon="mdi-light:menu" className="w-6 h-6" />
                        </div>
                    )}

                    <div className="flex items-center py-1 pl-1 pr-4 border rounded-full cursor-pointer select-none">
                        <Avatar
                            name={user?.username}
                            size={32}
                            textSizeRatio={2}
                            className="mr-2 rounded-full "
                        />
                        <p className="">{user?.username}</p>
                        <p>&nbsp;|&nbsp;{user?.barangayName}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
