import { Slider, Typography, Radio, RadioGroup, FormControlLabel, FormControl, TextField } from '@material-ui/core';
// import PropTypes from 'prop-types'
import Button from './Button'

import "../styles/questions.css";

const Question = ( {ques, num, def, onChanges, updateGlobal, deleteRadio, 
                    addRadio, updateSelect, updateText, updateQuestion, 
                    deleteQuestion, ...props} ) => {
    const marks = [
        {
          value: -5,
          label: ques.responseType[0],
        },
        {
          value: 5,
          label: ques.responseType[1],
        },
      ];

    
    function valuetext(value) {
        return `${value}`;
    }

    const handleChangeFLabel= (e) => {
        // const values = ques;
        // values.responseType[0] = e.target.value
        // onChanges(values);
        const value = e.target.value;
        const index = Number(num) - 1;
        updateGlobal(value, index, 0);
    }

    const handleChangeSLabel= (e) => {
        const value = e.target.value;
        const index = Number(num) - 1;
        updateGlobal(value, index, 1);
    }

    const handleChangeRadio= (index, e) => {
        const value = e.target.value;
        const indexGlobal = Number(num)-1;
        updateGlobal(value, indexGlobal, index);
    }

    const handleChangeText= (e) => {
        const value = e.target.value;
        const index = Number(num) - 1;
        updateText(value, index);
    }

    // function handleDeleteRadio(index){
    //     const indexGlobal = Number(num) - 1;
    //     deleteRadio(indexGlobal, index);
    // }

    const handleDeleteRadio= (index) => {
        const indexGlobal = Number(num) - 1;
        deleteRadio(indexGlobal, index);
    }

    const handleAddRadio= () => {
        const indexGlobal = Number(num) - 1;
        addRadio(indexGlobal);
    }

    const handleChangeSelect= (e) => {
        let value = e.target.value;
        if (value === 'text') {
            value = 'text-no-sentiment'
        }
        const index = Number(num) - 1;
        console.log("Updating Global!");
        updateSelect(value, index);
    }

    const handleQuestionChange= (e) => {
        const value = e.target.value;
        const index = Number(num) - 1;
        updateQuestion(value, index);
    }

    const handleDeleteQuestion= () => {
        const index = Number(num) -1;
        deleteQuestion(index);
    }


    

    // function valueLabelFormat(value) {
    //     return marks.findIndex((mark) => mark.value === value) + 1;
    // }
    //let the default question be the base template

    // datatype to not be hardcoded,
    // 

    return (
        <>
            {def === true ? (
                <>
                {ques.outputType === 'average' ? (
                    <div className='event'>
                        <div className='numbox'>
                            {num}
                        </div>
                        <div className='textbox'>
                            {ques.question}
                        </div>
                        <div className='typebox'>
                            Slider
                        </div>
                        <div className='resbox'>
                            <Typography id="discrete-slider-restrict" gutterBottom>
                            </Typography>
                            <Slider
                                min={-5}
                                step={1}
                                max={5}
                                // valueLabelFormat={valueLabelFormat}
                                getAriaValueText={valuetext}
                                aria-labelledby="discrete-slider-restrict"
                                valueLabelDisplay="auto"
                                marks={marks}
                            />
                        </div>
                    </div> 
                ) : ques.outputType === 'discrete' ? (
                    <div className='event'>
                        <div className='numbox'>
                            {num}
                        </div>
                        <div className='textbox'>
                            {ques.question}
                        </div>
                        <div className='typebox'>
                            Multiple Choice
                        </div>
                        <div className='resbox'>
                            <FormControl component="fieldset">
                                <RadioGroup>
                                    {ques.responseType.map((data,index) => (
                                        <FormControlLabel value={data} control={<Radio />} label={data} />
                                    ))}
                                    {/* <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" /> */}
                                    {/* <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                ) : ques.outputType === 'text-no-sentiment' ? (
                    <div className='event'>
                        <div className='numbox'>
                            {num}
                        </div>
                        <div className='textbox'>
                            {ques.question}
                        </div>
                        <div className='typebox'>
                            Text Input
                        </div>
                        <div className='resbox'>
                            <TextField label="Answer" variant="filled" />
                        </div>
                    </div>
                ) : ques.outputType === 'text-sentiment' ? (
                    <div className='event'>
                        <div className='numbox'>
                            {num}
                        </div>
                        <div className='textbox'>
                            {ques.question}
                        </div>
                        <div className='typebox'>
                            Text Input
                        </div>
                        <div className='resbox'>
                            <TextField label="Answer" variant="filled" />
                        </div>
                    </div>
                ) : (
                    null
                )}
                </>
            ) : (
                <>
                    {ques.outputType === 'average' ? (
                        <div className='event'>
                            <div className='numbox'>
                                {num}
                            </div>
                            <div className='textbox'>
                            <TextField placeholder={ques.question} variant="filled" onChange={e=> handleQuestionChange(e)}/>
                            </div>
                            <div className='typebox'>
                                <select value={ques.outputType} onChange={e=> handleChangeSelect(e)}>
                                    <option value="average">Slider</option>
                                    <option value="discrete">Multiple Choice</option>
                                    <option value="text">Text Input</option>
                                </select>
                            </div>
                            <div className='resbox'>
                            {/* think of way to update and display the mui slider using states */}
                                <TextField placeholder={ques.responseType[0]} variant="filled" onChange={e=> handleChangeFLabel(e)}/>
                                {/* <TextField label="Label for 1" variant="filled" /> */}
                                <TextField placeholder={ques.responseType[1]} variant="filled" onChange={e=> handleChangeSLabel(e)}/>
                            </div>
                            <div className='removebox'>
                                <Button color="red" text="x" onClick={()=> handleDeleteQuestion()}/>
                            </div>
                        </div> 
                    ) : ques.outputType === 'discrete' ? (
                        <div className='event'>
                            <div className='numbox'>
                                {num}
                            </div>
                            <div className='textbox'>
                            <TextField placeholder={ques.question} variant="filled" onChange={e=> handleQuestionChange(e)}/>
                            </div>
                            <div className='typebox'>
                                <select value={ques.outputType} onChange={e=> handleChangeSelect(e)}>
                                    <option value="average">Slider</option>
                                    <option value="discrete">Multiple Choice</option>
                                    <option value="text">Text Input</option>
                                </select>
                            </div>
                            <div className='resbox'>
                                {/* <FormControl component="fieldset">
                                    <RadioGroup>
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl> */}
                                {ques.responseType.map((data,index) => (
                                    <div key={index}>
                                        <TextField placeholder={data} variant="filled" onChange={e=> handleChangeRadio(index, e)} />
                                        <Button color="blue" text="remove" onClick={()=> handleDeleteRadio(index)} />
                                        {/* <button onClick={()=> handleDeleteRadio(index)}>Remove</button> */}
                                    </div>
                                ))}
                                <Button color="purple" text="add" onClick={()=> handleAddRadio()} />
                                    
                            </div>
                            <div className='removebox'>
                                <Button color="red" text="x" onClick={()=> handleDeleteQuestion()}/>
                            </div>
                        </div>
                    ) : ques.outputType === 'text-no-sentiment' ? (
                        <div className='event'>
                            <div className='numbox'>
                                {num}
                            </div>
                            <div className='textbox'>
                                <TextField placeholder={ques.question} variant="filled" onChange={e=> handleQuestionChange(e)}/>
                            </div>
                            <div className='typebox'>
                                <select value={ques.outputType} onChange={e=> handleChangeSelect(e)}>
                                    <option value="average">Slider</option>
                                    <option value="discrete">Multiple Choice</option>
                                    <option value="text">Text Input</option>
                                </select>
                            </div>
                            <div className='resbox'>
                                <TextField label="Answer" variant="filled" onChange={e=> handleChangeText(e)}/>
                            </div>
                            <div className='removebox'>
                                <Button color="red" text="x" onClick={()=> handleDeleteQuestion()}/>
                            </div>
                        </div>
                    ) : ques.outputType === 'text-sentiment' ? (
                        <div className='event'>
                            <div className='numbox'>
                                {num}
                            </div>
                            <div className='textbox'>
                                {ques.question}
                            </div>
                            <div className='typebox'>
                                Text Input
                            </div>
                            <div className='resbox'>
                                <TextField label="Answer" variant="filled" />
                            </div>
                            <div className='removebox'>
                                <Button color="red" text="x" onClick={()=> handleDeleteQuestion()}/>
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                </>
            )}
        </>
    )
}

// Question.propTypes = {
//     ques: PropTypes.object,
//     index: PropTypes.number,
// }

export default Question
