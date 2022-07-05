import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { Icon } from "@iconify/react";
import ClickAwayListener from "react-click-away-listener";
import arraySort from "array-sort";
import { useSWRConfig } from "swr";

function BarangayTable({
    filteredBarangays,
    fetchBarangays,
    fetchUserBarangays,
}) {
    const [barangayName, setBarangayName] = useState("");
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [dropdownMenuValue, setDropdownMenuValue] = useState("User id");
    const [barangayUsers, setBarangayUsers] = useState([]);
    const dropdownRef = useRef();
    const [columnName, setColumnName] = useState("id");
    const [boolean, setBoolean] = useState(false);
    const { mutate } = useSWRConfig();

    const sort = (columnName) => {
        setColumnName(columnName);
        setBoolean(!boolean);
    };

    // useEffect(() => {
    //     fetchBarangayUsers();
    // }, []);

    // const fetchBarangayUsers = () => {
    //     Axios.get("http://localhost:3001/barangay/user").then((res) => {
    //         setBarangayUsers(res.data);
    //     });
    // };

    const addBarangay = async (e) => {
        e.preventDefault();
        if (barangayName != "") {
            const data = {
                barangayName: barangayName,
            };
            await Axios.post("http://localhost:3001/barangay", data).then(
                (res) => {
                    console.log(res);
                    alert("Successfully added barangay");
                }
            );
            setBarangayName("");
            mutate("http://localhost:3001/barangay");
            mutate("http://localhost:3001/user/barangay");
        } else {
            alert("Please fill in all the forms");
        }
    };

    return (
        <div className="flex">
            <form
                spellCheck="false"
                onSubmit={addBarangay}
                className="w-full max-w-xs mr-6"
            >
                <p className="text-lg font-medium">Add barangay</p>
                <div className="mt-6 mb-4">
                    <p className="mb-1 text-sm text-gray-600">Barangay name</p>
                    <input
                        value={barangayName}
                        onChange={(e) => setBarangayName(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="text"
                        placeholder="Barangay name"
                    />
                </div>

                <div className="flex items-center justify-end mb-4">
                    <button
                        type="submit"
                        className="px-6 py-1 text-white bg-blue-500 active:ring"
                    >
                        Add barangay
                    </button>
                </div>
            </form>
            <table className="w-full text-sm text-left table-auto h-fit">
                <thead className="text-xs text-gray-700 uppercase border h-11 bg-gray-50">
                    <tr>
                        <th className="px-6">
                            <div
                                onClick={() => sort("id")}
                                className="flex items-center cursor-pointer group w-fit"
                            >
                                <p className="w-fit">ID</p>
                                <Icon
                                    className={`w-5 h-5 invisible group-hover:visible `}
                                    icon={`${
                                        boolean == true
                                            ? "eva:arrow-ios-downward-fill"
                                            : "eva:arrow-ios-upward-fill"
                                    }`}
                                />
                            </div>
                        </th>
                        <th className="px-6">
                            <div
                                onClick={() => sort("barangayName")}
                                className="flex items-center cursor-pointer group w-fit"
                            >
                                <p className="w-fit">Barangay Name</p>
                                <Icon
                                    className={`w-5 h-5 invisible group-hover:visible `}
                                    icon={`${
                                        boolean == true
                                            ? "eva:arrow-ios-downward-fill"
                                            : "eva:arrow-ios-upward-fill"
                                    }`}
                                />
                            </div>
                        </th>
                        <th className="px-6">
                            <div
                                onClick={() => sort("userId")}
                                className="flex items-center cursor-pointer group w-fit"
                            >
                                <p className="w-fit">User ID</p>
                                <Icon
                                    className={`w-5 h-5 invisible group-hover:visible `}
                                    icon={`${
                                        boolean == true
                                            ? "eva:arrow-ios-downward-fill"
                                            : "eva:arrow-ios-upward-fill"
                                    }`}
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {arraySort(filteredBarangays, columnName, {
                        reverse: boolean,
                    }).map((barangay, index) => {
                        return (
                            <tr
                                key={index}
                                className="border-x-[1px] border-b h-11"
                            >
                                <td className="px-6">{barangay.id}</td>
                                <td className="px-6">
                                    {barangay.barangayName}
                                </td>
                                <td className="px-6">
                                    {barangay.userId != null
                                        ? [barangay.userId]
                                        : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default BarangayTable;
