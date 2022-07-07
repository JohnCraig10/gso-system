import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { storage } from "../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { async } from "@firebase/util";

function announcements() {
    const [text, setText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();
    const [imageUpload, setImageUpload] = useState(null);
    const [imageThumbnail, setImageThumbnail] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: announcements,
        error: errorAnnouncements,
        isValidating: isValidatingAnnouncements,
    } = useSWR("http://localhost:3001/announcement");

    const imagesRef = ref(storage, "img/announcement/");

    // const uploadImage = () => {
    //     if (imageUpload == null) {
    //         alert("No image selected");
    //     } else {
    //         const imageRef = ref(
    //             storage,
    //             `img/announcement/${imageUpload.name + v4()}`
    //         );

    //         // console.log("TEST", imageRef);

    //         uploadBytes(imageRef, imageUpload).then((res) => {
    //             alert("Image Uploaded");
    //             getDownloadURL(imageRef).then((url) => {
    //                 console.log(url);
    //             });
    //         });
    //     }
    // };

    // useEffect(() => {
    //     listAll(imagesRef).then((res) => {
    //         res.items.forEach((item) => {
    //             getDownloadURL(item).then((url) => {
    //                 console.log(url);
    //             });
    //         });
    //     });
    // }, []);

    const handleChange = (e) => {};

    const createAnnouncement = async (e) => {
        e.preventDefault();

        if (text != "") {
            setIsLoading(true);
            if (imageUpload != null) {
                const imageRef = ref(
                    storage,
                    `img/announcement/${imageUpload.name + v4()}`
                );

                // console.log("TEST", imageRef);

                await uploadBytes(imageRef, imageUpload).then(() => {
                    getDownloadURL(imageRef).then(async (url) => {
                        // setImageUrl(url);
                        // console.log(url);
                        const data = {
                            text: text,
                            imageUrl: url,
                        };
                        await Axios.post(
                            "http://localhost:3001/announcement/create",
                            data
                        ).then((res) => {
                            alert("Successfully posted announcement");
                            setText("");
                            setImageUpload("");
                            setIsLoading(false);
                            mutate("http://localhost:3001/announcement");
                        });
                    });
                });
            } else {
                const data = {
                    text: text,
                    imageUrl: null,
                };
                await Axios.post(
                    "http://localhost:3001/announcement/create",
                    data
                ).then((res) => {
                    alert("Successfully added announcement");
                    setText("");
                    setImageUpload("");
                    setIsLoading(false);
                    mutate("http://localhost:3001/announcement");
                });
            }
        } else {
            alert("Please fill in the text form");
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="p-8">
                <h2 className="mb-8 text-xl font-medium">Announcements</h2>
                <div className="">
                    <form onSubmit={createAnnouncement} className="max-w-md">
                        <div className="mt-6 mb-4">
                            <p className="mb-1 text-sm text-gray-600">Text</p>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full px-3 py-2 border min-h-[100px]"
                                type="text"
                                placeholder="Text"
                            />
                        </div>

                        <div className="mb-8">
                            <p className="mb-1 text-sm text-gray-600">Image</p>
                            <input
                                type="file"
                                className="w-full border"
                                onChange={(e) => {
                                    setImageUpload(e.target.files[0]);
                                    setImageThumbnail({
                                        file: URL.createObjectURL(
                                            e.target.files[0]
                                        ),
                                    });
                                }}
                            />
                            {imageThumbnail && (
                                <img
                                    src={imageThumbnail?.file}
                                    className="object-contain w-20 h-20 my-4 bg-black border"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`px-6 py-1 text-white bg-blue-500 active:ring ${
                                isLoading && "cursor-not-allowed active:ring-0"
                            }`}
                            disabled={isLoading}
                        >
                            {!isLoading ? "Post announcement" : "Processing..."}
                        </button>
                    </form>

                    <hr className="my-6" />
                    {/* <div className="flex items-center justify-between p-2 mb-4 border">
                        <p>Barangay</p>
                        <p>Text</p>
                        <p>Date</p>
                    </div> */}

                    <div className="flex flex-col">
                        {announcements?.map((announcement, index) => {
                            let timestamp = announcement.createdAt;
                            let date = new Date(timestamp);
                            let minutes = 0;

                            if (date.getMinutes() < 10) {
                                minutes = "0" + date.getMinutes();
                            } else {
                                minutes = date.getMinutes();
                            }

                            return (
                                <div
                                    key={index}
                                    onClick={() =>
                                        router.push(
                                            `/announcement/${announcement.id}`
                                        )
                                    }
                                    className="flex items-center justify-between px-4 py-3 mb-2 border cursor-pointer hover:shadow-md"
                                >
                                    <div>
                                        <p className="mr-8 font-medium">
                                            {announcement.barangayName
                                                ? announcement.barangayName
                                                : "GSO"}
                                        </p>
                                        <p className="max-w-2xl mr-8 line-clamp-1">
                                            {announcement.announcementText}
                                        </p>
                                    </div>
                                    <p className="text-gray-600">
                                        {date.toLocaleString("default", {
                                            month: "short",
                                        })}
                                        &nbsp;
                                        {date.getDate()}, {date.getFullYear()}
                                        &nbsp; - &nbsp;
                                        {date.getHours() <= 12
                                            ? [
                                                  date.getHours() == 0
                                                      ? "12"
                                                      : date.getHours(),
                                              ] +
                                              ":" +
                                              minutes +
                                              "AM"
                                            : [date.getHours() - 12] +
                                              ":" +
                                              minutes +
                                              "PM"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default announcements;
