import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

import "../../styles/Dashboard.css";

export function AverageWidget({title, average, leftLabel, rightLabel}) {

    const val = [
        { name: 'Average Responses', value: average.Average },
        { name: '', value: 10-average.Average },
    ];

    const COLORS = ['#295e86', '#ffffff'];

    return (
        <div className="widget">
            <div className="innerWidget">
                <h1>{title}</h1>
                <div className="averageVal">
                    <PieChart width={300} height={120} className="pieChart">
                        <Pie
                            data={val}
                            startAngle={180}
                            endAngle={0}
                            cx={150}
                            cy={120}
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {val.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <p className="labelLeft">1</p>
                        <p className="labelRight">10</p>
                    </div>
                </div>

            </div>
        </div>
    );

}