import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useAuthState } from "../context/auth";

function FileUpload() {
    const [file, setFile] = useState();
    const [populationCount, setPopulationCount] = useState(0);
    const [filename, setFilename] = useState("Select File");
    const [uploadedFile, setUploadedFile] = useState({});
    const [barangay, setBarangay] = useState({});
    const { user, authenticated, loading } = useAuthState();

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

    return (
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
                        className="px-4 py-1 text-white bg-gray-500 cursor-pointer"
                        type="submit"
                        value="Submit"
                    />
                </div>
            </form>
        </div>
    );
}

export default FileUpload;
