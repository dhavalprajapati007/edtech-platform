import { Button, CircularProgress, Grid } from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import styles from '../../styles/Courses.module.css';
import GetTheApp from '../../components/GetTheApp';
import Footer from '../../components/Footer';
import NavigationMenu from '../../components/NavigationMenu';
import LinkSection from '../../components/LinkSection';
import Link from 'next/link';
import SocialMediaIcons from '../../components/SocialMediaIcons';
import { toastAlert } from '../../helpers/toastAlert';
import { handleLogout } from '../../utils/logout';
import Loader from '../../components/Loader';
import { handleContextMenu, handleKeyDown } from '../../helpers/helper';
import { requestAPI } from '../../helpers/apiHelper';

const Courses = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState({});
    const [exam, setExam] = useState({});

    useEffect(() => {
        setLoading(true);
        if(session) {
            let promises = [];

            promises.push(fetchSingleDepartment());
            promises.push(fetchSingleExam());

            Promise.all(promises).then((res) => {
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log(err,"err")
            });
        }

        // attach the event listener to
        // the document object
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        
        // clean up the event listener when
        // the component unmounts
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    },[]);

    const fetchSingleDepartment = async () => {
        try {
            let URL = `/api/departments/get-single-department?id=${session?.studentData?.department}`;
            
            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                if(!Object.keys(data.data).length) {
                    toastAlert("Department Data Not Found","error");
                }
                setDepartment(Object.keys(data?.data).length ? data?.data : {});
            } else {
                if(data?.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"error");              
            }
        }catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };
    
    const fetchSingleExam = async () => {
        try {
            let URL = `/api/exams/get-single-exam?id=${session?.studentData?.exam}`;
            
            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                if(!Object.keys(data.data).length) {
                    toastAlert("Exam Data Not Found","error");
                }
                setExam(Object.keys(data?.data).length ? data?.data : {});
            } else {
                if(data?.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"error");              
            }
        }catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    return (
        <>
            <Head>
                <title>Set2Score-Courses</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="GATE, Set2Score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                {
                    session ?
                        <Grid container>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                {
                                    loading ?
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Loader/>
                                            </Grid>
                                        </Grid>
                                    :
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.paddingSpace}>
                                                        <NavigationMenu />
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.paddingSpace}>
                                                        <Grid container>
                                                            <Grid item xl={8} lg={8} sm={12} md={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <span className={styles.mainTitleText}>Your <span className={styles.bookmarkText}>Bookmarks</span></span>
                                                                    </Grid>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.cardMainGrid}>
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <Grid container className={styles.bookmarkCardContainer}>
                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.bookmarkInnerGrid}>
                                                                                        <Grid container>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                <span className={styles.deptAndExamText}>{exam?.code}-{department?.code}</span>
                                                                                            </Grid>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.titleTextGrid}>
                                                                                                <span className={styles.cardTitleText}>Bookmark Questions</span>
                                                                                            </Grid>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.exploreBtnGrid}>
                                                                                                <Link
                                                                                                    href='/courses/bookmarks'
                                                                                                >
                                                                                                    <Button className={styles.exploreButton}>
                                                                                                        explore
                                                                                                    </Button>
                                                                                                </Link>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                            {/* <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <Grid container>
                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                        
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid> */}
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xl={4} lg={4} sm={12} md={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
                                                                        <LinkSection/>
                                                                    </Grid>
                                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} className={styles.socialMediaSectionContainer}>
                                                                        <SocialMediaIcons />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    {/* GET_THE_APP_SECTION: START */}
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <GetTheApp />
                                                    </Grid>
                                                    {/* GET_THE_APP_SECTION: END */}

                                                    {/* FOOTER_SECTION: START */}
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <section id="contact">
                                                            <Footer />
                                                        </section>
                                                    </Grid>
                                                    {/* FOOTER_SECTION: END */}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                }
                            </Grid>
                        </Grid>
                    : null
                }
            </section>
        </>
    )
}

export default Courses;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    // if (!session) {
    //     return {
    //         redirect: { destination: "/" },
    //     };
    // }

    return {
        props: {
            session
        }
    }
}