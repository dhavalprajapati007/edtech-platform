import { Button, Grid } from '@mui/material';
import React from 'react';
import styles from "../styles/QuizOfTheWeek.module.css";
import TimerIcon from "../public/assets/images/TimerIcon.png";
import Image from 'next/image';

function QuizOfTheWeek() {
    return (
        <Grid container>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                <h3 className={styles.quizHeader}>Quiz of the week</h3>
            </Grid>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                <Grid container className={styles.quizCardSection}>
                    <Grid item xl={3} lg={4} sm={5} md={5} xs={12} className={styles.cardMain}>
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.upperSection}>
                                <span className={styles.quizWeekTitle}>Week-02 | This Week</span>
                                <span className={styles.questionAndMarkDetail}>No. of Questions: 10 | Mark: 15</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizTitleBg}>
                                <span className={styles.quizTitle}>Name of the Quiz</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.durationContainer}>
                                <Image src={TimerIcon} alt="timerIcon"/>
                                <span className={styles.durationText}>Duration: 15 mins</span>
                            </Grid>
                            <div className={styles.hrLine}></div>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizActionBtnSection}>
                                <Button className={styles.quizActionBtn}>Start</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xl={3} lg={4} sm={5} md={5} xs={12} className={styles.cardMain}>
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.upperSection}>
                                <span className={styles.quizWeekTitle}>Week-01 | Previous Week</span>
                                <span className={styles.questionAndMarkDetail}>No. of Questions: 10 | Mark: 15</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizTitleBg}>
                                <span className={styles.quizTitle}>Name of the Quiz</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.durationContainer}>
                                <Image src={TimerIcon} alt="timerIcon"/>
                                <span className={styles.durationText}>Duration: 15 mins</span>
                            </Grid>
                            <div className={styles.hrLine}></div>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizActionBtnSection}>
                                <Button className={styles.quizActionBtn}>View</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xl={3} lg={4} sm={5} md={5} xs={12} className={styles.cardMain}>
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.upperSection}>
                                <span className={styles.quizWeekTitle}>Week-01 | Previous Week</span>
                                <span className={styles.questionAndMarkDetail}>No. of Questions: 10 | Mark: 15</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizTitleBg}>
                                <span className={styles.quizTitle}>Name of the Quiz</span>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.durationContainer}>
                                <Image src={TimerIcon} alt="timerIcon"/>
                                <span className={styles.durationText}>Duration: 15 mins</span>
                            </Grid>
                            <div className={styles.hrLine}></div>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.quizActionBtnSection}>
                                <Button className={styles.quizActionBtn}>View</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.btnSection}>
                <Button className={styles.seeMoreBtn}>See more</Button>
            </Grid>
        </Grid>
    )
}

export default QuizOfTheWeek;