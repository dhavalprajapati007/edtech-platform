import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import LatexMarkup from './LatexMarkup';
import styles from "../styles/Choices.module.css";
import Image from 'next/image';

const Choices = ({ userActionData, question, index, handleMSQAnswerSelect, handleMCQAnswerSelect, mode }) => {
    return (
        <Grid container>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                {
                    question?.choices?.length && question?.mode === "mcq" ?
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={userActionData?.find(item => item.id === question._id || item.questionId === question._id)?.answer || ""}
                                onChange={(evt) => handleMCQAnswerSelect(evt,question._id,index)}
                            >
                                {
                                    question.choices?.map((choice,idx) =>(
                                        <FormControlLabel
                                            disabled={mode === "response"}
                                            key={idx}
                                            value={choice._id}
                                            control={
                                                <Radio
                                                    className={`${userActionData?.find(item => item.id === question._id || item.questionId === question._id)?.answer === choice?._id && (mode=== "full" || mode === "response") ? 
                                                        userActionData.find(item => item.id === question._id || item.questionId === question._id)?.result === true ?
                                                            styles.rightAnswerRadioBtn 
                                                        :
                                                            styles.wrongAnswerRadioBtn 
                                                        : ""
                                                    }
                                                    ${userActionData.find(item => item.id === question._id || item.questionId === question._id)?.result !== "" &&
                                                        choice?.answer === true && (mode === "full" || mode === "response")  &&
                                                        styles.rightOptionRadioBtn
                                                    }
                                                    ${userActionData.find(item => item.id === question._id || item.questionId === question._id)?.answer === choice?._id && mode === "test" &&
                                                        styles.testModeRadioBtn
                                                    }`}
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
                                            disabled={mode === "response"}
                                            key={idx}
                                            control={
                                                <Checkbox
                                                    checked={userActionData.find(item => item?.id === question._id || item?.questionId === question._id)?.answer !== "" && userActionData.find(item => item.id === question._id || item?.questionId === question._id).answer?.some(ansId => ansId  === choice._id)}
                                                    onChange={() => handleMSQAnswerSelect(choice,question._id)}
                                                    className={`${userActionData.find(item => item.id === question._id || item?.questionId === question._id)?.answer !== "" && userActionData.find(item => item.id === question._id || item?.questionId === question._id).answer?.some(ansId => ansId === choice._id) && mode === "full" ?
                                                        choice?.answer ?
                                                            styles.rightAnswerCheckbox
                                                        :
                                                            styles.wrongAnswerCheckbox
                                                        : ""
                                                    }
                                                    ${userActionData.find(item => item.id === question._id || item?.questionId === question._id)?.answer !== "" && userActionData.find(item => item.id === question._id || item.questionId === question._id).answer?.some(ansId => ansId === choice._id) && mode === "test" &&
                                                        styles.testModeSelectedCheckbox
                                                    }`}
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

export default Choices;