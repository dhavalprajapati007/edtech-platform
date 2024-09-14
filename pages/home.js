import { Button, Grid } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import GetTheApp from '../components/GetTheApp';
import NavigationMenu from '../components/NavigationMenu';
import ReviewSlider from '../components/ReviewSlider';
import styles from "../styles/HomePage.module.css";
import FeatureSlider from '../components/FeatureSlider';
import QuizOfTheWeek from '../components/QuizOfTheWeek';
import LinkSection from '../components/LinkSection';
import SocialMediaIcons from '../components/SocialMediaIcons';
import { handleLogout } from '../utils/logout';
import { useRouter } from 'next/router';
import LatexMarkup from '../components/LatexMarkup';
import Loader from '../components/Loader';
import { toastAlert } from '../helpers/toastAlert';
import SelectDepartment from '../components/Modal/SelectDepartment';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const Home = ({ session, id, student }) => {
    const [departmentDetail, setDepartmentDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const [reviewData, setReviewData] = useState([]);
    const [storeData, setStoreData] = useState([]);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [introText, setIntroText] = useState("The Graduate Aptitude Test in Engineering (GATE) is an examination that primarily tests the comprehensive understanding of various undergraduate subjects in engineering and science for admission into the Masters Program and Recruitment by some Public Sector Companies. GATE Examination is conducted jointly by the seven Indian Institutes of Technology at Mumbai, Delhi, Guwahati, Kanpur, Kharagpur, Chennai, Roorkee & Indian Institute of Science at Bengaluru on behalf of the National Coordination Board – GATE, The Department of Higher Education, Ministry of Education (MoE), Government of India.");
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        if((session && Object.keys(session).length) && (!student?.department || !student?.exam)) {
            setLoading(false);
            setShowDepartmentModal(true);
        }else {
            fetchData();
            fetchDepartmentWiseReviews();
            if((session && Object.keys(session).length)) {
                fetchStoreData();
            }else {
                id && fetchDepartmentWiseStoreData();
            }
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
    },[refreshData]);

    const fetchStoreData = async () => {
        try {
            let URL = "/api/payments/get-both-payments";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session.studentData.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                if(!data.data?.length) {
                    toastAlert("Data Not Found","error");
                }
                setStoreData(data.data?.length ? data.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"error");
                toastAlert(data.message,"error");
            }
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };


    const fetchDepartmentWiseStoreData = async () => {
        try {
            let URL = `/api/payments/get-department-wise-payments?id=${id}`;

            let reqObj = {
                method: "GET"
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                if(!data.data?.length) {
                    toastAlert("Data Not Found","error");
                }
                setStoreData(data.data?.length ? data.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"error");
                toastAlert(data.message,"error");
            }
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const fetchData = async () => {
        try {
            let URL;
            if(!session) {
                URL = `/api/departments/get-single-department?id=${id}`
            } else {
                URL = `/api/departments/get-single-department?id=${student?.department}`
            }

            let reqObj = {
                method: 'GET'
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                setDepartmentDetail(Object.values(data?.data)?.length ? data?.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                toastAlert(data?.message,"error");
                console.log(data.message,"error");
            }
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const fetchDepartmentWiseReviews = async() => {
        try {
            let URL = "/api/reviews/get-department-wise-reviews";
            let body;
            if(!session) {
                body = {
                    id
                }
            } else {
                body = {
                    id : student?.department
                }
            }

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body),
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                setReviewData(Object.keys(data?.data)?.length ? data?.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"error");
            }
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };
    
    const closeModal = () => {
        setShowDepartmentModal(false);
    }
    
    return (
        <>
            <Head>
                <title>Set2Score-Home</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                {
                    loading ?
                        <Grid container className={styles.marginSpace}>
                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                <Loader/>
                            </Grid>
                        </Grid>
                    :
                    showDepartmentModal ?
                        <SelectDepartment
                            open={showDepartmentModal}
                            handleClose={closeModal}
                            session={session}
                        />
                    :
                        <Grid container className={styles.homePageContainer}>
                            <Grid container className={styles.marginSpace}>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <NavigationMenu />
                                </Grid>
                                
                                {/* ABOUT_DEPARTMENT_SECTION: START */}
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                                            <Grid container className={styles.aboutLeftSection}>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.aboutDeptHeader}>
                                                    <h3>About GATE - <span className={styles.departmentTitle}>{departmentDetail?.title}</span></h3>
                                                </Grid>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    {
                                                        reviewData?.description?.en?.length ?
                                                            <LatexMarkup
                                                                latex={reviewData?.description?.en ?? reviewData?.description?.en}
                                                                suppressHydrationWarning
                                                                className={styles.marginRight}
                                                            />
                                                        :
                                                            <p className={styles.introDescription}>{introText}</p>
                                                    }
                                                </Grid>
                                                {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <QuizOfTheWeek />
                                                </Grid> */}
                                            </Grid>
                                        </Grid>
                                        <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className={styles.rightSection}>
                                            <Grid container>
                                                <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
                                                    <LinkSection
                                                        id={id}
                                                        onDepartmentChange={() => setRefreshData(true)}
                                                    />
                                                </Grid>
                                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1} className={styles.socialMediaSectionContainer}>
                                                    <SocialMediaIcons />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* ABOUT_DEPARTMENT_SECTION: END */}

                                {/* FEATURE_SECTION: START */}
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeSliderSection}>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeHeading}>
                                                    <h2>What’s in our <span className={styles.storeTextStyle}>Store ?</span></h2>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FeatureSlider
                                                        type={"store"}
                                                        data={storeData}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* FEATURE_SECTION: END */}
                            </Grid>

                            {/* GET_THE_APP_SECTION: START */}
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <GetTheApp/>
                                </Grid>
                            </Grid>
                            {/* GET_THE_APP_SECTION: END */}

                            <Grid container className={styles.marginSpace}>
                                {/* SLIDER: START */}
                                <Grid container spacing={1}>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.sliderSection}>
                                        <Grid container spacing={2}>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.reviewSliderText}>
                                                <h1>What <span className={styles.departmentTitle}>{departmentDetail.title}</span> students are saying</h1>
                                            </Grid>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <ReviewSlider
                                                    reviews={reviewData.reviews}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* SLIDER: END */}
                            </Grid>
                            
                            {/* FOOTER_SECTION: START */}
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <section id="contact">
                                        <Footer />
                                    </section>
                                </Grid>
                            </Grid>
                            {/* FOOTER_SECTION: END */}
                        </Grid>
                }
            </section>
        </>
    )
}

export default Home

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    
    // change this condition to !session later
    if(!session) {
        if(!context?.query?.id) {
            return {
                redirect: { destination: "/" },
            };
        }else {
            return {
                props: {
                    id: context?.query?.id ? context?.query?.id : null,
                }
            }
        };
    }

    if(session) {
        let URL = `${process.env.NEXTAUTH_URL}api/students/get-student?id=${session.studentData._id}`;

        let reqObj = {
            method: "GET",
            headers: { 'Authorization': session.studentData.accessToken }
        };

        let data = await requestAPI(URL,reqObj);

        let student = data.data;
        
        if(!student || !Object.keys(student).length) {
            return {
                redirect: { destination: "/" },
            };
        }

        // Pass data to the page via props
        return {
            props: {
                session,
                student
            },
        };
    }
}