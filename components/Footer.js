import React from "react";
import { Button, Grid } from "@mui/material";
import Link from "next/link";
import styles from "../styles/Home.module.css"
import Image from "next/image";
import appLogo from "../public/assets/images/Set2ScoreLogo.png"
import facebookLogo from "../public/assets/images/Facebook.png"
import linkedInLogo from "../public/assets/images/LinkedIn.png"
import twitterLogo from "../public/assets/images/TwRoundIcon.png"
import youTubeLogo from "../public/assets/images/YtRoundedIcon.png"
import instagramLogo from "../public/assets/images/instaRoundedIcon.png"
import Set2ScoreFrame from "../public/assets/images/Set2ScoreFrame.png"
import { useSession } from 'next-auth/react';

const Footer = () => {
    const { data: session } = useSession();

    return (
        <footer className={styles.footerContainer}>
            {/* Footer column */}
            <Grid container className={styles.footerInfoAndLinks}>
                <Grid item lg={12} sm={12} md={12} xs={12} xl={12} className={styles.footerSection}>
                    <Grid container>
                        <Grid item xl={4} lg={4} sm={12} md={12} xs={12} className={styles.companyInfoCol}>
                            <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Image src={appLogo} width={172} height={28} alt="appLogo"/>
                                    <p className={styles.companyTitle}>Sangyaan surge Ed Tech Pvt. Ltd</p>
                                    <div className={styles.companyAddress}>
                                        <span>21, 3rd Cross, Ayyappa Layout,</span>
                                        <span>Marathalli, Bangalore,</span>
                                        <span>India, 560037</span>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xl={8} lg={8} sm={12} md={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container>
                                        <Grid item lg={4} sm={4} md={4} xs={12} xl={4} className={styles.linkSection}>
                                            <h3>Company</h3>
                                            <Grid container spacing={1}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/aboutUs" target="_blank">About us</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/" target="_blank">Careers</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/" target="_blank">FAQ</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/privacy" target="_blank">Privacy Policy</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/termsAndConditions" target="_blank">Terms & Conditions</Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={4} sm={4} md={4} xs={12} xl={4} className={styles.linkSection}>
                                            <h3>Products</h3>
                                            <Grid container spacing={1}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/pastPapers" target="_blank">Previous Papers</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/testSeries" target="_blank">Test Series</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/" target="_blank">Quizzes</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/" target="_blank">Online Videos</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/forum" target="_blank">Forum</Link>
                                                </Grid>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="/" target="_blank">Study material</Link>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                        <Grid item lg={4} xl={4} sm={4} md={4} xs={12} className={styles.ourAppsMain}>
                                            <Grid container>
                                                <Grid item lg={12} xl={12} sm={12} md={12} xs={12}>
                                                    <h3>Our Apps</h3>
                                                    <Grid container spacing={1} className={styles.ourAppsSection}>
                                                        <Grid item xl={3} lg={2} md={4} sm={4} xs={12}>
                                                            <Link href="/" target="_blank">
                                                                <Image src={Set2ScoreFrame} alt="appLogo"/>
                                                            </Link>
                                                        </Grid>
                                                        <Grid item xl={9} lg={10} md={8} sm={8} xs={12}>
                                                            <Grid container spacing={1}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12} className={styles.getTheAppSectionText}>
                                                                    <span>Set2Score - GATE Exam preparation app</span>
                                                                </Grid>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <Link href="https://play.google.com/store/apps/details?id=in.set2score.set2score" target="_blank">
                                                                        <Button className={styles.downloadButton}>
                                                                            Download
                                                                        </Button>
                                                                    </Link>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item lg={12} sm={12} md={12} xs={12} xl={12} className={styles.footerSection}>
                    <Grid container>
                        <Grid item xl={4} lg={4} sm={12} md={12} xs={12} className={styles.companyInfoCol}>
                            <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={styles.contactUsSection}>
                                    <h3>Contact Us</h3>
                                    <p>admin@set2score.com</p>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                        <Grid item xl={8} lg={8} sm={12} md={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container>
                                        <Grid item lg={4} sm={4} md={4} xs={12} xl={4} className={styles.linkSection}>
                                            <h3>Follow us</h3>
                                            <Grid container spacing={1}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Link href="https://www.facebook.com/Set2Score" target="_blank" className={styles.imageLink}>
                                                        <Image src={facebookLogo} width={20} height={20} alt="facebookLogo"/>
                                                    </Link>
                                                    <Link href="https://www.linkedin.com/company/set2score" target="_blank" className={styles.imageLink}>
                                                        <Image src={linkedInLogo} width={20} height={20} alt="linkedInLogo"/>
                                                    </Link>
                                                    <Link href="https://twitter.com/Set2Score" target="_blank" className={styles.imageLink}>
                                                        <Image src={twitterLogo} width={20} height={20} alt="twitterLogo"/>
                                                    </Link>
                                                    <Link href="https://www.instagram.com/set2score/" target="_blank" className={styles.imageLink}>
                                                        <Image src={instagramLogo} width={20} height={20} alt="twitterLogo"/>
                                                    </Link>
                                                    <Link href="https://www.youtube.com/@set2score659" target="_blank" className={styles.imageLink}>
                                                        <Image src={youTubeLogo} width={20} height={20} alt="twitterLogo"/>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={4} sm={4} md={4} xs={12} xl={4} className={styles.linkSection}>
                                            {
                                                session ?
                                                    <Grid container className={styles.myAcSection}>
                                                        <Grid item lg={12} sm={12} md={12} xs={12} xl={12}>
                                                            <h3>My Account</h3>
                                                            <Grid container spacing={1}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <Link href="/" target="_blank">Refer and earn</Link>
                                                                </Grid>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <Link href="/" target="_blank">My profile</Link>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                : null
                                            }
                                        </Grid>
                                        <Grid item lg={4} xl={3} sm={4} md={4} xs={12} className={styles.ourAppsMain}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h3>Working hours</h3>
                                                <p>9am - 7pm (Mon-Sat)</p>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Footer copyright text */}
            <Grid container>
                <Grid item lg={12} sm={12} md={12} xs={12} xl={12} className={styles.copyrightTextSection}>
                    <span className={styles.copyrightText}>&#169; 2023 Sangyaan surge Ed Tech Pvt. Ltd. All rights reserved.</span>
                </Grid>
            </Grid>
        </footer>
    );
}

export default Footer;