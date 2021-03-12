import { Slider, Typography, Radio, RadioGroup, FormControlLabel, FormControl, TextField } from '@material-ui/core';
// import PropTypes from 'prop-types'
import Button from './Button'

const Template = ( {ques, num, ...props} ) => {
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



    

    // function valueLabelFormat(value) {
    //     return marks.findIndex((mark) => mark.value === value) + 1;
    // }
    //let the default question be the base template

    // datatype to not be hardcoded,
    // 

    return (
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
    )
}

// Question.propTypes = {
//     ques: PropTypes.object,
//     index: PropTypes.number,
// }

export default Template
