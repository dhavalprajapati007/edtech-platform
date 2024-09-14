import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect } from 'react'
import NavigationMenu from '../components/NavigationMenu';
import { Grid } from '@mui/material';
import styles from "../styles/PrivacyPolicy.module.css";
import GetTheApp from '../components/GetTheApp';
import Footer from '../components/Footer';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';

const AboutUs = () => {

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    return (
        <div>
            <Head>
                <title>Set2Score-About Set2Score</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                <Grid container className={styles.mainContainer}>
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <NavigationMenu />
                    </Grid>
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.titleMainGrid}>
                        <h1 className={styles.pageTitle}>About Set2Score</h1>
                    </Grid>
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <p>
                                    Set2Score is designed to carter the underbelly of so many varied dreams but the sole purpose is to provide everyone out there a dedicated, exhaustive mentor to guide one through the perilous, cutthroat journey of today’s competitive examinations. Set2Score is the one stop destination for exam preparation content.
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container className={styles.footerAndGetTheAppContainer}>
                    {/* GET_THE_APP_SECTION: START */}
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <GetTheApp/>
                    </Grid>
                    {/* GET_THE_APP_SECTION: END */}

                    {/* FOOTER_SECTION: START */}
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.footerSection}>
                        <section id="contact">
                            <Footer />
                        </section>
                    </Grid>
                    {/* FOOTER_SECTION: END */}
                </Grid>
            </section>
        </div>
    )
};

export default AboutUs;