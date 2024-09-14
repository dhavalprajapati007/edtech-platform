import { Grid } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import styles from "../styles/Solution.module.css";
import LatexMarkup from './LatexMarkup';

const Solution = ({ question, transform }) => {
    return (
        <Grid container>
            <Grid item xl={11} lg={11} sm={11} md={11} xs={11} className={styles.solution}>
                <Grid container className={styles.solutionText}>
                    {
                        question.mode === "mcq" || question.mode === "msq" ?
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <p className={styles.correctAnswer}>Correct Answer: {question && transform(question.choices)}</p>
                            </Grid>
                        : question.mode === "answer" ?
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <p className={styles.correctAnswer}>Correct Answer: {question && question.answer.en}</p>
                            </Grid>
                        : null
                    }
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <LatexMarkup
                            className={styles.textSize}
                            latex={question.solution?.text?.en ? question.solution?.text?.en : "No Answer Available"}
                            suppressHydrationWarning
                        />
                    </Grid>
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        {
                            question.solution?.images?.length ?
                                question.solution?.images?.map((image,i) => (
                                    <div key={i}>
                                        <Image
                                            src={image}
                                            alt="solution-image"
                                            width={250}
                                            height={250}
                                            className={styles.imageAutoStyle}
                                        />
                                    </div>
                                ))
                            : null
                        }
                    </Grid>
                    {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.topicContainer}>
                        <span>Topic:</span>
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Solution;