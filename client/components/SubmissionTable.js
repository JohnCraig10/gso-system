import Axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import fileDownload from "js-file-download";
import arraySort from "array-sort";
import { Icon } from "@iconify/react";

function SubmissionTable({ filteredSubmissions }) {
    const documentNameRef = useRef([]);
    const [columnName, setColumnName] = useState("createdAt");
    const [boolean, setBoolean] = useState(true);

    const download = (e, docName) => {
        e.preventDefault();

        Axios({
            url: "http://localhost:3001/submission/download",
            method: "POST",
            responseType: "blob",
            data: {
                fileName: docName,
            },
        }).then((res) => {
            fileDownload(res.data, docName);
        });
    };

    const sort = (columnName) => {
        setColumnName(columnName);
        setBoolean(!boolean);
    };

    return (
        <table className="w-full text-sm text-left table-auto ">
            <thead className="text-xs text-gray-700 uppercase border h-11 bg-gray-50">
                <tr className="select-none">
                    <th className="px-6 ">
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
                            <p className="cursor-pointer w-fit">
                                Barangay Name
                            </p>
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
                            onClick={() => sort("documentName")}
                            className="flex items-center cursor-pointer group w-fit"
                        >
                            <p className="cursor-pointer w-fit">
                                Document Name
                            </p>
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
                            onClick={() => sort("populationCount")}
                            className="flex items-center cursor-pointer group w-fit"
                        >
                            <p className="cursor-pointer w-fit">
                                Population Count
                            </p>
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
                            onClick={() => sort("createdAt")}
                            className="flex items-center cursor-pointer group w-fit"
                        >
                            <p className="cursor-pointer w-fit">
                                Date Submitted
                            </p>
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
                    <th className="px-6"></th>
                </tr>
            </thead>
            <tbody>
                {arraySort(filteredSubmissions, columnName, {
                    reverse: boolean,
                }).map((submission, index) => {
                    let timestamp = submission.createdAt;
                    let date = new Date(timestamp);
                    let minutes = 0;

                    if (date.getMinutes() < 10) {
                        minutes = "0" + date.getMinutes();
                    } else {
                        minutes = date.getMinutes();
                    }

                    return (
                        <Fragment key={index}>
                            {submission.rank == 1 && (
                                <tr className="border-b  border-x-[1px] h-11">
                                    <td className="px-6">{submission.id}</td>
                                    <td className="px-6">
                                        {submission.barangayName}
                                    </td>
                                    <td className="px-6">
                                        {submission.documentName}
                                    </td>
                                    <td className="px-6">
                                        {submission.populationCount}
                                    </td>
                                    <td className="px-6">
                                        {date.toLocaleString("default", {
                                            month: "short",
                                        })}
                                        &nbsp;
                                        {date.getDate()}, {date.getFullYear()}
                                        &nbsp; - &nbsp;
                                        {date.getHours() <= 12
                                            ? [date.getHours()] +
                                              ":" +
                                              minutes +
                                              "AM"
                                            : [date.getHours() - 12] +
                                              ":" +
                                              minutes +
                                              "PM"}
                                    </td>
                                    <td className="px-6 font-medium text-right text-blue-600 ">
                                        <span
                                            onClick={(e) =>
                                                download(
                                                    e,
                                                    submission.documentName
                                                )
                                            }
                                            className="cursor-pointer hover:underline"
                                        >
                                            Download
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    );
                })}

                {/* {filteredSubmissions
                    .sort((a, b) =>
                        a.columnName < b.columnName ? firstNumber : secondNumber
                    )
                    .map((submission, index) => {
                        let timestamp = submission.createdAt;
                        let date = new Date(timestamp);
                        let minutes = 0;

                        if (date.getMinutes() < 10) {
                            minutes = "0" + date.getMinutes();
                        } else {
                            minutes = date.getMinutes();
                        }

                        return (
                            <tr
                                key={index}
                                className="border-b  border-x-[1px] h-11"
                            >
                                <td className="px-6">{submission.id}</td>
                                <td className="px-6">
                                    {submission.barangayName}
                                </td>
                                <td
                                    ref={(el) =>
                                        (documentNameRef.current[index] = el)
                                    }
                                    className="px-6"
                                >
                                    {submission.documentName}
                                </td>
                                <td className="px-6">
                                    {submission.populationCount}
                                </td>
                                <td className="px-6">
                                    {date.toLocaleString("default", {
                                        month: "short",
                                    })}
                                    &nbsp;
                                    {date.getDate()}, {date.getFullYear()}
                                    &nbsp; - &nbsp;
                                    {date.getHours() <= 12
                                        ? [date.getHours()] +
                                          ":" +
                                          minutes +
                                          "AM"
                                        : [date.getHours() - 12] +
                                          ":" +
                                          minutes +
                                          "PM"}
                                </td>
                                <td className="px-6 font-medium text-right text-blue-600 ">
                                    <span
                                        onClick={(e) =>
                                            download(e, submission.documentName)
                                        }
                                        className="cursor-pointer hover:underline"
                                    >
                                        Download
                                    </span>
                                </td>
                            </tr>
                        );
                    })} */}
            </tbody>
        </table>
    );
}

export default SubmissionTable;
