import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect } from 'react'
import NavigationMenu from '../components/NavigationMenu';
import { Grid } from '@mui/material';
import styles from "../styles/PrivacyPolicy.module.css";
import GetTheApp from '../components/GetTheApp';
import Footer from '../components/Footer';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import Link from 'next/link';

const TermsAndConditions = () => {

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
                <title>Set2Score-Terms&Conditions</title>
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
                        <h1 className={styles.pageTitle}>Terms & Conditions</h1>
                    </Grid>

                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <ol>
                            <li className={styles.olElement}>Acceptance of Terms</li>
                            <p>
                                By accessing the website at <Link href={'https://www.set2score.com/'}>https://www.set2score.com/</Link>
                                , you acknowledge and agree to be bound by the following terms of service. It is important to comply with all applicable laws and regulations, and understand that you are solely responsible for adhering to any local laws that may apply. If you do not agree with any of these terms, you are not permitted to use or access this site. The materials found on this website are protected by copyright and trademark laws.
                            </p>
                            <p>
                                These Terms and Conditions serve as an electronic record in accordance with the provisions of the Information Technology Act, 2000, and the Information Technology (Intermediaries guidelines) Rules, 2011, as amended periodically. Before using the application, website, or services, please carefully read the Terms and the Privacy Policy regarding registration with us and the use of the application, website. Your use, access, browsing, registration (with or without payment or subscription) through any means signifies your acceptance of the Terms and your agreement to be legally bound by them.
                            </p>
                            <li className={styles.olElement}>Registration and User Accounts</li>
                            <ul style={{'list-style-type':'lower-alpha' }}>
                                <li>
                                    <p>
                                        To access certain features of the website, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account information and agree to accept responsibility for all activities that occur under your account.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        You must provide accurate and complete information when registering for an account and keep your account information updated.
                                    </p>
                                </li>
                            </ul>
                            <li className={styles.olElement}>User Conduct</li>
                            <ul style={{'list-style-type':'lower-alpha' }}>
                                <li>
                                    <p>
                                        You agree to use the website for lawful purposes and in compliance with these terms and any applicable laws and regulations.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        You agree not to engage in any conduct that may disrupt or interfere with the proper functioning of the website or infringe upon the rights of others.
                                    </p>
                                </li>
                            </ul>
                            <li className={styles.olElement}>Hyperlinks</li>
                            <p>
                                The website may contain links to third-party websites or resources. Set2score has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Set2score of the site. Use of any such linked website is at the user’s own risk.
                            </p>
                            <li className={styles.olElement}>Disclaimer of Warranties</li>
                            <p>
                                The website and its content are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied.
                            </p>
                            <p>
                                The website does not warrant that the content will be accurate, reliable, error-free, or uninterrupted, nor does it make any guarantees regarding the results obtained from the use of the website.
                            </p>
                            <li className={styles.olElement}>Limitation of Liability</li>
                            <p>
                                The website and its owners, employees, or affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of or in connection with the use of the website or the inability to use it.
                            </p>
                            <li className={styles.olElement}>Modifications</li>
                            <p>
                                Set2Score may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                            </p>
                            <li className={styles.olElement}>Governing Law</li>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of Karnataka and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </ol>
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
}

export default TermsAndConditions;