import {Bar, BarChart, CartesianGrid, Label, Tooltip, XAxis, YAxis} from "recharts";
import React, {useEffect} from "react";

export function BarChartWidget({title, dataPairs}) {
    const arr = [];

    for (const categories in dataPairs) {
        arr.push({Categories: categories, Totals: dataPairs[categories]});
    }

    return (
        <div className="widget">
            <h1>{title}</h1>

            <BarChart
                width={500}
                height={400}
                data={arr}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
                <XAxis dataKey="Categories">
                    <Label value={"Categories"} offset={-10} position="insideBottom" />
                </XAxis>
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis allowDecimals={false} label={{ value: "Totals", angle: -90, position: 'insideLeft'}}/>
                <Bar dataKey="Totals" fill="#2F5A72"/>
            </BarChart>
        </div>

    );

}