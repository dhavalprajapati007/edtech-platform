import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect } from 'react'
import NavigationMenu from '../components/NavigationMenu';
import { Grid } from '@mui/material';
import styles from "../styles/PrivacyPolicy.module.css";
import GetTheApp from '../components/GetTheApp';
import Footer from '../components/Footer';
import Link from 'next/link';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';

const Privacy = () => {

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
                <title>Set2Score-PrivacyPolicy</title>
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
                        <h1 className={styles.pageTitle}>Privacy Policy</h1>
                    </Grid>
                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <p>
                                    Set2Score built the educational app as a preparation app for competitive exam in India. This service is provided by Set2Score at no cost and is intended for use as is.
                                </p>
                                <p>
                                    This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                                </p>
                                <p>
                                    If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The personal information that we collect is used for providing and improving the service. we will not use or share your information with anyone except as described in this privacy policy.
                                </p>
                            </Grid>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <ol>
                                    <li className={styles.olElement}>Information Collection and Use</li>
                                    <p>
                                        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at set2score app unless otherwise defined in this Privacy Policy.
                                    </p>
                                    <p>
                                        For a better experience, while using our service, we may require you to provide us with certain personally identifiable information, including but not limited to email id, profile, name. The information that we request will be retained by us and used as described in this privacy policy.
                                    </p>
                                    <p>
                                        The app does use third party services that may collect information used to identify you.
                                    </p>
                                    <p>
                                        Link to privacy policy of third-party service providers used by the app
                                    </p>
                                    <p>
                                        [Google Play Services]
                                        <Link href={'https://www.google.com/policies/privacy/'}>(https://www.google.com/policies/privacy/)</Link>
                                    </p>
                                    <li className={styles.olElement}>Log Data</li>
                                    <p>
                                        We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
                                    </p>
                                    <li className={styles.olElement}>Cookies</li>
                                    <p>
                                        Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device&apos;s internal memory.
                                    </p>
                                    <p>
                                        This service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this service.
                                    </p>
                                    <li className={styles.olElement}>Service Providers</li>
                                    <p>
                                        We may employ third-party companies and individuals due to the following reasons:
                                    </p>
                                    <ul>
                                        <li>To facilitate our Service</li>
                                        <li>To provide the Service on our behalf</li>
                                        <li>To perform Service-related services</li>
                                        <li>To assist us in analysing how our service is used</li>
                                    </ul>
                                    <p>
                                        We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                                    </p>
                                    <li className={styles.olElement}>Security</li>
                                    <p>
                                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                                    </p>
                                    <li className={styles.olElement}>Links to Other Sites</li>
                                    <p>
                                        This service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                                    </p>
                                    <li className={styles.olElement}>Children&rsquo;s Privacy</li>
                                    <p>
                                        These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                                    </p>
                                    <li className={styles.olElement}>Changes to This Privacy Policy</li>
                                    <p>
                                        We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
                                    </p>
                                    <p>
                                        This policy is effective as of 2021-07-25
                                    </p>
                                    <li className={styles.olElement}>Contact Us</li>
                                    <p>
                                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at admin@set2score.com.
                                    </p>
                                </ol>
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

export default Privacy;