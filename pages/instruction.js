import { Button, Divider, Grid } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { handleLogout } from '../utils/logout';
import styles from "../styles/Instruction.module.css"
import scrollBarStyles from '../styles/Scrollbar.module.css'
import Link from 'next/link';
import SelectSubject from '../components/Modal/SelectSubject';
import LatexMarkup from '../components/LatexMarkup';
import Loader from '../components/Loader';
import { toastAlert } from '../helpers/toastAlert';
import TestCountDownTimer from '../components/Modal/TestCountDownTimer';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const Instruction = ({ session }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCountDownTimerModal, setShowCountDownTimerModal] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const router = useRouter();
    const { id, section } = router.query;

    useEffect(() => {
        setLoading(true);
        fetchData();

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
    }, []);

    const fetchData = async () => {
        try {
            let body = {
                id
            };

            let URL;
            if(section === "pastPapers") {
                URL = '/api/previousPapers/get-single-paper';
            }else {
                URL = '/api/testSeries/get-single-test-series';
            };

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(Object.keys(data?.data).length ? data?.data : []);
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"errorInFetchTestData");                  
            }
        } catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    };

    const redirect = () => {
        router.push({
            pathname: '/pastPapers/testMode',
            query: { id }
        })
    };

    const redirectToTestSeries = () => {
        router.push({
            pathname: '/testSeries/testMode',
            query: { id }
        })
    };

    const redirectWithSelectedSection = () => {
        router.push({
            pathname: '/pastPapers/testMode',
            query: { 
                id,
                selectedSections : selectedSections.map((section) => section._id)
            }
        })
    }

    const handleNextClick = async() => {
        if(section === "testSeries") {
            // redirectToTestSeries();
            setShowCountDownTimerModal(true);
        }else {
            if(!data?.selectSection) {
                setShowCountDownTimerModal(true);
                // redirect();
            }else {
                if(data?.sections?.length) {
                    setShowModal(true);
                }else {
                    // redirect();
                    setShowCountDownTimerModal(true);
                }
            }
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleSectionSelect = async(value) => {
        if(!selectedSections?.length) {
            let arr = [];
            arr.push(value);
            setSelectedSections(arr);
        } else {
            if(selectedSections.some(data => data._id === value._id)) {
                setSelectedSections(selectedSections.filter((data => data._id !== value._id)));
            }else {
                if(selectedSections.length < data.selectSection) {
                    let updatedData = [...selectedSections];
                    updatedData.push(value);
                    setSelectedSections(updatedData);
                }
            }
        }
    }

    const openTimerModal = () => {
        setShowModal(false);
        setShowCountDownTimerModal(true);
    }

    return (
        <div>
            <Head>
                <title>Set2Score-Instruction</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                <Grid container>
                    {
                        loading ?
                            <Grid container className={styles.mainContainer}>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Loader/>
                                </Grid>
                            </Grid>
                        :
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container className={styles.mainContainer}>
                                        <Grid item xl={9} lg={9} sm={9} md={9} xs={9} className={styles.instructionsSection}>
                                            <Grid container className={styles.instructionInnerContainer}>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <p className={styles.instructionTitle}>Instructions</p>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.instructionsContainer} ${scrollBarStyles.myCustomScrollbar}`}>
                                                                    <LatexMarkup
                                                                        latex={data?.instructions?.en ?? data?.instructions?.en }
                                                                        suppressHydrationWarning
                                                                        className={styles.marginRight}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xl={3} lg={3} sm={3} md={3} xs={3}>
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.testDetailsContainer}>
                                                            <p>Name of the test: {data?.name?.en}</p>
                                                            <p>Duration of test: {data.time}</p>
                                                            <p>No. of questions: {data?.sections?.flatMap(section => section.questions).length}</p>
                                                            <p>Total Marks: {data.marks}</p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container className={styles.actionBtnMainContainer}>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.btnContainer}>
                                            <Grid container>
                                                <Grid item xl={9} lg={9} sm={9} md={9} xs={9}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.backAndNextBtnContainer}>
                                                            <Grid container>
                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                    <Link
                                                                        href={{ 
                                                                            pathname: `/${section}`,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            className={styles.backBtn}
                                                                        >
                                                                            Back
                                                                        </Button>
                                                                    </Link>
                                                                </Grid>
                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.nextBtnGrid}>
                                                                    <Button
                                                                        className={styles.nextBtn}
                                                                        onClick={() => handleNextClick()}
                                                                    >
                                                                        Next
                                                                    </Button>
                                                                </Grid>

                                                                {
                                                                    showModal ?
                                                                        <Grid container>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <SelectSubject 
                                                                                    open={showModal}
                                                                                    handleClose={handleModalClose}
                                                                                    data={data?.sections}
                                                                                    handleSectionSelect={handleSectionSelect}
                                                                                    selectedSections={selectedSections}
                                                                                    totalSelectSection={data.selectSection}
                                                                                    renderModal={openTimerModal}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    : null
                                                                }

                                                                {
                                                                    showCountDownTimerModal ?
                                                                        <Grid container>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <TestCountDownTimer
                                                                                    open={showCountDownTimerModal}
                                                                                    redirect={
                                                                                        section === "testSeries" ?
                                                                                            redirectToTestSeries
                                                                                        : section === 'pastPapers' && !data.selectSection ?
                                                                                            redirectWithSelectedSection
                                                                                        : section === 'pastPapers' && data.selectSection &&             redirectWithSelectedSection
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    : null
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </section>
        </div>
    )
}

export default Instruction;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    
    if(!session) {
        return {
            redirect: { destination: "/" },
        };
    }
      
    return {
        props: {
            session
        }
    }
}