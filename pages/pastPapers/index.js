import { Button, Grid, Paper } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import GetTheApp from '../../components/GetTheApp';
import NavigationMenu from '../../components/NavigationMenu';
import styles from "../../styles/PastPapers.module.css";
import FeatureSlider from '../../components/FeatureSlider';
import LinkSection from '../../components/LinkSection';
import SocialMediaIcons from '../../components/SocialMediaIcons';
import LockIcon from "../../public/assets/images/Locked.png";
import UnlockIcon from "../../public/assets/images/Unlocked.png";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { handleLogout } from '../../utils/logout';
import Loader from '../../components/Loader';
import { toastAlert } from '../../helpers/toastAlert';
import Link from 'next/link';
import { handleContextMenu, handleKeyDown } from '../../helpers/helper';
import { requestAPI } from '../../helpers/apiHelper';

const PastPapers = ({ session }) => {
    const [activeTabs, setActiveTabs] = useState("full");
    const [storeData, setStoreData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testResponseData, setTestResponseData] = useState([]);
    const [data, setData] = useState([]);
    const router = useRouter();

    const handleClick = (id) => {
        router.push({
            pathname: '/pastPapers/fullMode',
            query: { id, mode : activeTabs },
        })
    }

    useEffect(() => {
        if(session) {
            localStorage.clear();
            setLoading(true);
            ;

            let promises = [];
            promises.push(fetchTestResponse());
            promises.push(activeTabs === "full" ? getFullLengthPapers() : getSubjectWisePapers());
            promises.push(fetchStoreData());

            Promise.all(promises).then((res) => {
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log(err,"err")
            });

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
        }
    },[]);

    const getFullLengthPapers = async () => {
        try {
            let URL = "/api/previousPapers/get-full-length-papers";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(data.data?.length ? data.data : []);
                setLoading(false);
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
            console.log(e,"error");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    const getSubjectWisePapers = async () => {
        try {
            let URL = "/api/previousPapers/get-department-wise-subjects";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                console.log(data?.data,'subjectWiseData');
                setData(data.data?.length ? data.data : []);
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
            console.log(e,"error");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    const fetchStoreData = async () => {
        try {
            let URL = "/api/payments/get-previous-year-paper-payments";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session.studentData.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setStoreData(data.data?.length ? data.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"error");
            }
        } catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const fetchTestResponse = async () => {
        try {
            let URL = "/api/result/get-filtered-test?mode=PreviousYear";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setTestResponseData(data.data?.length ? data.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                console.log(data.message,"error");
                toastAlert(data.message,"error");
            }
        } catch (e) {
            console.log(e,"error");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    const handleTabChange = (val) => {
        if(activeTabs !== val) {
            setActiveTabs(val);
            setLoading(true);
            if(val==="full") {
                getFullLengthPapers();
            }else {
                getSubjectWisePapers();
            }
        }
    }

    const handleStartTestClick = (id) => {
        router.push({
            pathname: '/instruction',
            query: { id, section: "pastPapers" }
        });
    }

    return (
        <>
            <Head>
                <title>Set2Score-PastPapers</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
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
                                    <Grid container className={styles.marginSpace}>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <Loader/>
                                        </Grid>
                                    </Grid>
                                :
                                    <Grid container className={styles.homePageContainer}>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.marginSpace}>
                                            <NavigationMenu />
                                        </Grid>
                                        
                                        {/* ABOUT_DEPARTMENT_SECTION: START */}
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.marginSpace}>
                                            <Grid container spacing={1}>
                                                <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                                                    <Grid container className={styles.sectionTabs}>
                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                            <span 
                                                                onClick={() => handleTabChange("full")}
                                                                className={`${activeTabs === "full" ? styles.active : ""} ${styles.headerStyle}`}
                                                            >
                                                                Full Length
                                                            </span>
                                                        </Grid>
                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                            <span
                                                                onClick={() => handleTabChange("subject")}
                                                                className={`${activeTabs === "subject" ? styles.active : ""} ${styles.headerStyle}`}
                                                            >
                                                                Subject Wise
                                                            </span>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        {
                                                            (activeTabs === "full" && data?.length) ?
                                                                data?.map((paper,idx) => (
                                                                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12} className={styles.paperListSection} key={idx}>
                                                                        <Grid container className={`${styles.paperSection} ${paper.lock ? styles.lockedPaperSection : styles.unlockedPaperSection}`}>
                                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                <Grid container className={styles.maincontentSection}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={8} lg={8} sm={8} md={8} xs={6}>
                                                                                            <p className={styles.paperDeptAndExam}>{paper?.exam?.code}-{paper?.department?.code}</p>
                                                                                        </Grid>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={6} className={styles.btnSection}>
                                                                                            <Button 
                                                                                                className={paper.lock ? styles.lockButton : styles.unlockButton}
                                                                                            >
                                                                                                <Image src={paper.lock ? LockIcon : UnlockIcon} alt="lockIcon"/>
                                                                                                { paper.lock ? "Locked" : "Free" }
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <p className={styles.paperTitle}>{paper?.name?.en}</p>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    
                                                                                    <Grid container className={styles.actionBtnContainer}>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.btnCenter}>
                                                                                                    {
                                                                                                        testResponseData && testResponseData?.length &&
                                                                                                        testResponseData?.includes(paper?._id) ?
                                                                                                            <Link 
                                                                                                                href={{ 
                                                                                                                    pathname: '/responseSheet',
                                                                                                                    query: {
                                                                                                                        id: paper?._id,
                                                                                                                        section: 'pastPapers'
                                                                                                                    }
                                                                                                                }}
                                                                                                            >
                                                                                                                <Button
                                                                                                                    className={styles.actionBtn}
                                                                                                                    disabled={paper.lock}
                                                                                                                >
                                                                                                                    Response Sheet
                                                                                                                </Button>
                                                                                                            </Link>
                                                                                                        : null
                                                                                                    }
                                                                                                </Grid>
                                                                                                <Grid item xl={3} lg={3} sm={3} md={3} xs={3} className={styles.btnCenter}>
                                                                                                    <Button
                                                                                                        className={styles.actionBtn}
                                                                                                        disabled={paper.lock}
                                                                                                        onClick={() => handleStartTestClick(paper._id)}
                                                                                                    >
                                                                                                        Start Test
                                                                                                    </Button>
                                                                                                </Grid>
                                                                                                <Grid item xl={3} lg={3} sm={3} md={3} xs={3} className={styles.btnCenter}>
                                                                                                    <Button
                                                                                                        className={styles.actionBtn}
                                                                                                        disabled={paper.lock}
                                                                                                        onClick={() => handleClick(paper._id)}
                                                                                                    >
                                                                                                        Explore                         
                                                                                                    </Button>    
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                ))
                                                            :
                                                                (activeTabs === "subject" && data?.length && data[0]?.subjects?.length) ?
                                                                    data[0]?.subjects?.map((subject,idx) => (
                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={12} className={styles.paperListSection} key={idx}>
                                                                            <Grid container className={`${styles.paperSection} ${subject.lock ? styles.lockedPaperSection : styles.unlockedPaperSection}`}>
                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.maincontentSection}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={8} lg={8} sm={8} md={8} xs={6}   >
                                                                                            <p className={styles.paperDeptAndExam}>
                                                                                                {/* GATE-EE ({subject?.yearRange?.from}-{subject?.yearRange?.to}) */}
                                                                                                GATE-EE ({data[0]?.yearRange?.from}-{data[0]?.yearRange?.to})
                                                                                            </p>
                                                                                        </Grid>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={6} className={styles.btnSection}>
                                                                                            <Button
                                                                                                className={subject.lock ? styles.lockButton : styles.unlockButton}
                                                                                                disabled={subject.lock}
                                                                                            >
                                                                                                <Image src={subject.lock ? LockIcon : UnlockIcon} alt="lockIcon"/>
                                                                                                { subject.lock ? "Locked" : "Free" }
                                                                                            </Button>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <p className={styles.paperTitle}>{subject?.title}</p>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid container>
                                                                                        <Grid item xl={8} lg={8} sm={8} md={8} xs={9}>
                                                                                            <p className={styles.totalQuesCount}>Total Number of Question: {subject?.totalQues}</p>
                                                                                        </Grid>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={3} className={styles.btnCenter}>
                                                                                            <Button
                                                                                                className={styles.actionBtn}
                                                                                                disabled={subject.lock}
                                                                                                onClick={() => handleClick(subject._id)}
                                                                                            >
                                                                                                Explore                         
                                                                                            </Button>    
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    ))
                                                            : null
                                                        }
                                                    </Grid>
                                                </Grid>
                                                <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className={styles.linkAndSocialMediaIconContainer}>
                                                    {/* <Grid container>
                                                        <Grid item xl={6} lg={2} md={4} sm={3} xs={0}></Grid>
                                                        <Grid item xl={4} lg={8} md={6} sm={7} xs={10} className={styles.linkSection}>
                                                            <LinkSection/>
                                                        </Grid>
                                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.socialMediaIconsContainer}>
                                                            <SocialMediaIcons />
                                                        </Grid>
                                                    </Grid> */}
                                                    
                                                    <Grid container>
                                                        <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
                                                            <LinkSection />
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
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.previousPapersSliderSection}>
                                            <Grid container>
                                                <Grid item xl={1} lg={1} md={0} sm={0} xs={0}></Grid>
                                                <Grid item xl={10} lg={10} md={12} sm={12} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.previousPapersHeading}>
                                                            <h2>Our <span className={styles.previousPapersTextStyle}>Previous year papers ?</span></h2>
                                                        </Grid>
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <FeatureSlider
                                                                type={"store"}
                                                                data={storeData}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xl={1} lg={1} md={0} sm={0} xs={0}></Grid>
                                            </Grid>
                                        </Grid>
                                        {/* FEATURE_SECTION: END */}

                                        {/* GET_THE_APP_SECTION: START */}
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <GetTheApp/>
                                            </Grid>
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
                            }
                            </Grid>
                        </Grid>
                    :null
                }
            </section>
        </>
    )
}

export default PastPapers;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    
    // change this condition to !session later
    // if(!session) {
    //     return {
    //         redirect: { destination: "/" },
    //     };
    // }

    return {
        props: { session }
    }
}