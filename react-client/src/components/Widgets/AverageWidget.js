import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export function AverageWidget({title, average}) {

    const val = [
        { name: 'Average Responses', value: average.Average },
        { name: '', value: 10-average.Average },
    ];

    const COLORS = ['#0088FE', '#ffffff'];

    return (
        <div className="widget">
            <h1>{title}</h1>
            <h1>{average.Average}</h1>
            <PieChart width={400} height={400}>
                <Pie
                    data={val}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {val.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );

}