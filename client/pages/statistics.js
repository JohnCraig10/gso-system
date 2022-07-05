import Axios from "axios";
import React, { Fragment, useEffect, useState } from "react";

function statistics() {
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/barangay").then((res) => {
            setBarangays(res.data);
        });
    }, []);

    // let highestToLowest = numbers.sort((a, b) => b-a);
    return (
        <div className="flex flex-col w-full">
            <div className="p-8">
                <p className="mb-8 text-xl font-medium">Statistics</p>

                <p className="mb-6 font-medium">
                    Top 9 Barangay Garbage Waste Generated
                </p>
                <div className="grid grid-cols-3 gap-4">
                    {barangays
                        .sort((a, b) =>
                            a.populationCount < b.populationCount ? 1 : -1
                        )
                        .map((barangay, index) => {
                            const wasteGenerated =
                                (barangay.populationCount * 0.68).toFixed(2) +
                                "kg";
                            return (
                                <Fragment key={index}>
                                    <div className="p-4 border">
                                        <p className="font-medium">
                                            {barangay.barangayName}
                                        </p>
                                        <p className="text-2xl">
                                            {wasteGenerated}
                                        </p>
                                    </div>
                                </Fragment>
                            );
                        })}
                </div>
                {/* {barangays.map((barangay, index) => {
                    const wasteGenerated =
                        (barangay.populationCount * 0.68).toFixed(2) + "kg";
                    return (
                        <div key={index} className="flex items-center">
                            <p>{index + 1}</p>
                            <p className="w-28">{barangay.barangayName}</p>
                            <p>{wasteGenerated}</p>
                        </div>
                    );
                })} */}
            </div>
        </div>
    );
}

export default statistics;
