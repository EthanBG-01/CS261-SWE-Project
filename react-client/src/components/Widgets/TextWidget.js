import React from "react";

export function TextWidget({title, responses}) {

    return (
        <div className="widget">
            <h1>{title}</h1>
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