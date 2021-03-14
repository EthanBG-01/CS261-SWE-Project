import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

import "../../styles/Dashboard.css";

export function AverageWidget({title, average}) {

    const val = [
        { name: 'Average Responses', value: average.Average+5 },
        { name: '', value: 10-average.Average+5 },
    ];

    const COLORS = ['#295e86', '#ffffff'];

    return (
        <div className="widget">
            <div className="innerWidget">
                <h1>{title}</h1>
                <div className="averageVal">
                    <h1>{average.Average}</h1>
                    <PieChart width={300} height={200} className="pieChart">
                        <Pie
                            data={val}
                            startAngle={180}
                            endAngle={0}
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
                    <p>-5</p>
                    <p>5</p>
                </div>

            </div>
        </div>
    );

}