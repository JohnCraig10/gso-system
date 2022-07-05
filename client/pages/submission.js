import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FileUpload from "../components/FileUpload";
import Axios from "axios";
import FileDownload from "js-file-download";
import { AuthContext } from "../helpers/AuthContext";
import qs from "qs";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuthState } from "../context/auth";

function submission() {
    const [submissions, setSubmissions] = useState([]);
    const { user, authenticated, loading } = useAuthState();
    const [file, setFile] = useState();
    const [populationCount, setPopulationCount] = useState(0);
    const [filename, setFilename] = useState("Select File");
    const [uploadedFile, setUploadedFile] = useState({});
    const [barangay, setBarangay] = useState({});

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = () => {
        Axios.get("http://localhost:3001/submission/submissions").then(
            (res) => {
                setSubmissions(res.data);
            }
        );
    };

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        console.log(file);
        if (populationCount != 0 && file?.name != "") {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await axios.post(
                    "http://localhost:3001/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const { fileName, filePath } = res.data;
                setUploadedFile({ fileName, filePath });
                const data = {
                    documentName: fileName,
                    populationCount: populationCount,
                    userId: user.id,
                };
                await axios
                    .post("http://localhost:3001/submission/submit", data)
                    .then((res) => {
                        // console.log(res);
                        alert("Successfully submitted document");
                        fetchSubmissions();
                        axios.put("http://localhost:3001/barangay/update", {
                            populationCount: populationCount,
                            userId: user.id,
                        });
                    });
            } catch (err) {
                alert("No file chosen");
            }
        } else {
            alert("Please fill in all forms");
        }
    };

    const download = (e, docName) => {
        e.preventDefault();
        // const fileName = e.target.innerText;
        Axios({
            url: "http://localhost:3001/submission/download",
            method: "POST",
            responseType: "blob",
            data: {
                fileName: docName,
            },
        }).then((res) => {
            // console.log(res.data);
            FileDownload(res.data, docName);
        });
    };

    return (
        <div className="flex flex-col w-full">
            <div className="p-8">
                <p className="mb-8 text-xl font-medium">
                    Solid waste management plan
                </p>
                <div>
                    <form onSubmit={uploadFile}>
                        <p>Number of population:</p>
                        <input
                            value={populationCount}
                            onChange={(e) => setPopulationCount(e.target.value)}
                            type="number"
                            className="p-2 mt-1 mb-8 border"
                            placeholder="Number of population"
                        />
                        <div>
                            <p>Select file:</p>
                            <input
                                className="w-full max-w-sm mt-1 border"
                                type="file"
                                id="customFile"
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="mt-10">
                            <input
                                className="px-6 py-1 text-white bg-blue-500 cursor-pointer active:ring"
                                type="submit"
                            />
                        </div>
                    </form>
                </div>

                <hr className="my-12" />
                <div>
                    <div className="flex items-center">
                        <p>Submission:</p>

                        {/* <button
                            onClick={loadSubmissions}
                            type="submit"
                            className="px-2 py-1 mt-1 ml-8 border"
                        >
                            Show submissions
                        </button> */}
                    </div>

                    <br />
                    {}
                    {!loading ? (
                        [
                            submissions.length !== 0 ? (
                                submissions.map((submission, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={(e) =>
                                                download(
                                                    e,
                                                    submission.documentName
                                                )
                                            }
                                            className="text-blue-600 cursor-pointer hover:underline w-fit"
                                        >
                                            {submission.documentName}
                                        </li>
                                    );
                                })
                            ) : (
                                <p>Not submitted</p>
                            ),
                        ]
                    ) : (
                        <p>Loading...</p>
                    )}
                    {/* {submissions.length !== 0 ? (
                        submissions.map((submission, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={download}
                                    className="text-blue-600 cursor-pointer hover:underline w-fit"
                                >
                                    {submission.documentName}
                                </li>
                            );
                        })
                    ) : (
                        <p>Not submitted</p>
                    )} */}
                </div>
            </div>

            {/* <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)]">
                    <p className="mb-4">
                        You are not authorized to access this page.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-1 text-white bg-blue-500"
                    >
                        Go home
                    </button>
                </div> */}
        </div>
    );
}

export default submission;
