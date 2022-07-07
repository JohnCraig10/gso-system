import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import { Icon } from "@iconify/react";
import Image from "next/image";

function Announcement() {
    const router = useRouter();
    const announcementId = router.query.announcementId;
    const [announcementImage, setAnnouncementImage] = useState();

    const {
        data: announcement,
        error: errorAnnouncement,
        isValidating: isValidatingAnnouncement,
    } = useSWR(`http://localhost:3001/announcement/${announcementId}`);

    let timestamp = announcement?.createdAt;
    let date = new Date(timestamp);
    let minutes = 0;

    if (date.getMinutes() < 10) {
        minutes = "0" + date.getMinutes();
    } else {
        minutes = date.getMinutes();
    }

    let dateMarkup = (
        <>
            {date.toLocaleString("default", {
                month: "short",
            })}
            &nbsp;
            {date.getDate()}, {date.getFullYear()}
            &nbsp; - &nbsp;
            {date.getHours() <= 12
                ? [date.getHours() == 0 ? "12" : date.getHours()] +
                  ":" +
                  minutes +
                  "AM"
                : [date.getHours() - 12] + ":" + minutes + "PM"}
        </>
    );

    return (
        <div className="flex flex-col w-full">
            <div className="p-8">
                <div className="flex items-center mb-4">
                    <Icon
                        onClick={() => router.back()}
                        icon="bx:arrow-back"
                        className="p-1 mr-2 border rounded-full cursor-pointer w-9 h-9"
                    />
                    <h2 className="text-xl font-medium ">
                        {announcement?.barangayName
                            ? announcement?.barangayName
                            : "GSO"}
                    </h2>
                </div>

                <p className="mb-4 text-gray-600">{dateMarkup}</p>
                <p>{announcement?.announcementText}</p>
                {announcement?.announcementImageUrl && (
                    <div className="relative w-full max-w-sm my-4 bg-black border h-96">
                        <Image
                            src={announcement.announcementImageUrl}
                            alt="announcement image"
                            layout="fill"
                            className={`object-contain`}
                        />
                    </div>
                )}

                <hr className="mt-8" />
            </div>
        </div>
    );
}

export default Announcement;
