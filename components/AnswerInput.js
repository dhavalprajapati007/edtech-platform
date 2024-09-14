import { Button, FormControl, Grid, OutlinedInput } from '@mui/material';
import React from 'react';
import styles from "../styles/AnswerInput.module.css";

const AnswerInput = ({ question, userActionData, handleAnswerValue, checkAnswer, mode }) => {
    return (
        <Grid container>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                {
                    question?.mode === "answer" && question.answer?.en?.trim()?.length ?
                        <Grid container>
                            <Grid item xl={8} lg={8} sm={10} md={8} xs={12}>
                                <FormControl className={styles.inputField}>
                                    <OutlinedInput
                                        disabled={mode === "response" || mode === "discussion"}
                                        placeholder="Enter Your Answer..."
                                        name="answer"
                                        value={mode === "discussion" ? question?.answer?.en : userActionData?.find(item => item.id === question._id || item.questionId === question._id)?.answer}
                                        type={mode === "discussion" ? 'text' : 'number'}
                                        autoComplete="on"
                                        onChange={(event) => handleAnswerValue(event.target.value,question._id)}
                                        className={
                                            mode === 'full' && userActionData?.find(item => item.id === question._id || item.questionId === question._id)?.answer?.length ?
                                                userActionData.find(item => item.id === question._id || item.questionId === question._id)?.result === true ?
                                                    styles.rightAnswerInput 
                                                :
                                                userActionData.find(item => item.id === question._id || item.questionId === question._id)?.result === false &&
                                                    styles.wrongAnswerInput
                                            : ""
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            {
                                mode === "full" ?
                                    <Grid item xl={3} lg={3} sm={3} md={3} xs={3}>
                                        <Button
                                            className={styles.answerCheckBtn}
                                            onClick={() => checkAnswer(question.answer.en,question._id)}
                                        >
                                            Check
                                        </Button>
                                    </Grid>
                                : null
                            }
                        </Grid>
                    : null
                }
            </Grid>
        </Grid>
    )
}

export default AnswerInput;