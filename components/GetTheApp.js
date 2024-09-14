import { Button, Grid, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import styles from "../styles/GetTheApp.module.css";
import GooglePlayButton from '../components/GooglePlayButton';
import iphone13FrontImage from "../public/assets/images/iphone13.png";
import signUpPage from "../public/assets/images/Set2ScoreSignup.png";
import paperImage from "../public/assets/images/Set2ScorePaper.png";
import ellipse from "../public/assets/images/ellipse.png";
import Image from 'next/image';
import GetLink from './GetLink';

const GetTheApp = () => {
    

    return (
        <Grid container className={styles.getTheAppContainer}>
            <Grid item xl={2} lg={2} md={2} sm={4} xs={0} className={styles.ellipseVectorSection}>
                <div className={styles.ellipseVector}></div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} className={styles.getTheAppTextSection}>
                <Grid container>
                    <Grid item xl={2} lg={2} md={0} sm={1} xs={0}></Grid>
                    <Grid item xl={8} lg={8} md={12} sm={10} xs={12}>
                        <h1 className={styles.getTheAppHeader}>Get the app</h1>
                        <p>Revolutionize your learning experience with our app - download it now!</p>
                        {/* <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <GetLink/>
                            </Grid>
                        </Grid> */}
                    </Grid>  
                    <Grid item xl={2} lg={2} md={0} sm={1} xs={0}></Grid>
                </Grid>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <Grid container>
                    <Grid item xl={8} lg={8} md={10} sm={12} xs={12} className={styles.mobileSection}>
                        <Grid container className={styles.mobileBG}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.signupScreenSection}>
                                <Grid container>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.googlePlayButton}>
                                        <GooglePlayButton
                                            background={"#FFFFFF"}
                                            color={"#3D4C59"}
                                            boxShadow={'0px 25px 47px #D2D5EB'}
                                        />
                                    </Grid>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Image
                                            src={signUpPage}
                                            width={235}
                                            height={530}
                                            alt="signUpPage"
                                            className={styles.signUpPage}
                                        />
                                    </Grid>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Image
                                            src={iphone13FrontImage}
                                            width={254}
                                            height={547}
                                            alt="iphone13FrontImage"
                                            className={styles.signUpMobileScreen}
                                            />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.paperMobileScreenSection}>
                                <Image
                                    src={paperImage}
                                    width={235}
                                    height={530}
                                    alt="paperImage"
                                    className={styles.paper}
                                />
                                <Image
                                    src={iphone13FrontImage}
                                    width={254}
                                    height={547}
                                    alt="iphone13FrontImage"
                                    className={styles.paperMobileScreen}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default GetTheApp