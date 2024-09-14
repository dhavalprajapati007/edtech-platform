import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import LatexMarkup from './LatexMarkup';
import styles from "../styles/Choices.module.css";
import Image from 'next/image';

const DiscussionChoices = ({ question, mode }) => {
    return (
        <Grid container>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                {
                    question?.choices?.length && question?.mode === "mcq" ?
                        <FormControl className={styles.formControl}>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={question.choices?.find((choice) => choice?.answer === true)?._id}
                                className={styles.radioGroupContainer}
                            >
                                {
                                    question.choices?.map((choice,idx) =>(
                                        <FormControlLabel
                                            disabled={true}
                                            key={idx}
                                            value={choice._id}
                                            control={
                                                <Radio
                                                    className={choice?.answer === true ? styles.rightOptionRadioBtn : ""}
                                                />
                                            }
                                            label={
                                                choice.text.en !== '' ?
                                                    <LatexMarkup
                                                        className={styles.textSize}
                                                        latex={choice?.text?.en ?? choice?.text?.en} 
                                                    />
                                                :
                                                    choice?.image !== '' &&
                                                    <Image
                                                        alt="option-choice-image"
                                                        src={choice?.image}
                                                        height={80}
                                                        width={80}
                                                        className={styles.imageAutoStyle}
                                                    />
                                            }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                    : 
                    question?.choices?.length && question?.mode === "msq" ?
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormGroup>
                                {
                                    question.choices?.map((choice,idx) => (
                                        <FormControlLabel
                                            disabled={true}
                                            key={idx}
                                            control={
                                                <Checkbox
                                                    checked={choice.answer}
                                                    className={choice?.answer ? styles.rightAnswerCheckbox : ""}
                                                />
                                            }
                                            label={
                                                choice.text.en !== '' ?
                                                    <LatexMarkup
                                                        className="mb-0"
                                                        latex={choice?.text?.en ?? choice?.text?.en} 
                                                    />
                                                :
                                                    choice?.image !== '' &&
                                                    <Image
                                                        alt="option-choice-image"
                                                        src={choice?.image}
                                                        height={80}
                                                        width={80}
                                                        className={styles.imageAutoStyle}
                                                    />
                                            }
                                        />
                                    ))
                                }
                            </FormGroup>
                        </FormControl>
                    :null
                }
            </Grid>
        </Grid>
    )
}

export default DiscussionChoices;