import React from "react";
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';

export function SentimentWidget({title, emotions, responses}) {
    const data = [];

    for (const emotion in emotions) {
        data.push({Categories: emotion, Totals: emotions[emotion]});
    }


    return (
        <div className="widget">
            <h1>{title}</h1>

            <div>
                <BarChart
                    width={350}
                    height={240}
                    data={data}
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

            {responses.questionText.map((item, i) => {
                return (
                    <div className={"nameObject"}>
                        <p className={"nameOfUser"}>{item[0]}</p>
                        <p className={"responseOfUser"}>{item[1]}</p>
                    </div>
                )
            })}

        </div>
    );

}