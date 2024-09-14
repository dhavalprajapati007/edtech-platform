import { Autocomplete, Box, Button, Divider, Grid, TextField } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer';
import GetTheApp from '../../components/GetTheApp';
import LinkSection from '../../components/LinkSection';
import NavigationMenu from '../../components/NavigationMenu';
import SocialMediaIcons from '../../components/SocialMediaIcons';
import styles from "../../styles/TestSeries.module.css";
import LockIcon from "../../public/assets/images/Locked.png";
import UnlockIcon from "../../public/assets/images/Unlocked.png";
import blackLockIcon from "../../public/assets/images/LockBlack.png";
import blackUnlockIcon from "../../public/assets/images/UnlockBlack.png";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { handleLogout } from '../../utils/logout';
import dayjs from 'dayjs';
import Loader from '../../components/Loader';
import { toastAlert } from '../../helpers/toastAlert';
import DynamicCardWithPrice from '../../components/DynamicCardWithPrice';
import Link from 'next/link';
import { handleContextMenu, handleKeyDown } from '../../helpers/helper';
import { requestAPI } from '../../helpers/apiHelper';

const TestSeries = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [activeTabs, setActiveTabs] = useState("full");
    const [data, setData] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSub, setSelectedSub] = useState({});
    const [storeData, setStoreData] = useState([]);
    const [testResponseData, setTestResponseData] = useState([]);
    const router = useRouter();
    let currentDate = dayjs();

    useEffect(() => {
        if(session) {
            sessionStorage.clear();
            setLoading(true);

            let promises = [];

            promises.push(fetchTestResponse());
            promises.push(fetchFullLengthTestSeries());
            promises.push(fetchTestSeriesPaymentData());

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
    }, []);

    const fetchFullLengthTestSeries = async () => {
        try {
            let URL = '/api/testSeries/get-full-length-test-series';

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(data.data?.length ? data.data : []);
                if(!data.data?.length) {
                    toastAlert('TestSeriesNotFound','error');
                }
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"errorInFetchFullLengthTestSeries");
                toastAlert(data.message,"error");
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"errorInCatchBlock");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    const fetchSubjectWiseTestSeries = async () => {
        try {
            let URL = '/api/testSeries/get-subject-wise-test-series';

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(data.data?.length ? data.data : []);
                if(!data.data?.length) {
                    toastAlert('TestSeriesNotFound','error');
                }
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"errorInFetchSubjectWiseTestSeries");
                toastAlert(data.message,"error");
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"errorInCatchBlock");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    }

    const fetchTestSeriesPaymentData = async () => {
        try {
            let URL = "/api/payments/get-test-series-payment";

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

    const fetchSubjectForSubjectWiseTestSeries = async () => {
        try {
            let URL = "/api/testSeries/get-subject-list-for-test-series";
            
            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session.studentData.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setSubjectList(data?.data?.length ? data?.data : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"errorInFetchSubjectWiseTestSeries");
                toastAlert(data.message,"error");
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"errorInCatchBlock");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    }

    const fetchTestResponse = async () => {
        try {
            let URL = "/api/result/get-filtered-test?mode=TestSeries";

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session.studentData.accessToken }
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
                fetchFullLengthTestSeries();
            }else {
                let promises = [];

                promises.push(fetchSubjectForSubjectWiseTestSeries());
                promises.push(fetchSubjectWiseTestSeries());

                Promise.all(promises).then((res) => {
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                    console.log(err,"err")
                })
            }
        }
    }

    const handleStartTestClick = (id) => {
        router.push({
            pathname: '/instruction',
            query: { id , section: "testSeries" }
        })
    }

    const fetchSubjectSpecificTestSeries = async (val) => {
        try {
            let URL = `/api/testSeries/get-subject-specific-test-series?id=${val._id}`;

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(data?.data?.length ? data?.data : []);
                if(!data.data?.length) {
                    toastAlert('TestSeriesNotFound','error');
                }
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"errorInFetchSubjectWiseTestSeries");
                toastAlert(data.message,"error");
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"errorInCatchBlock");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    }

    const handleSubjectSelect = async(data) => {
        setLoading(true);
        setSelectedSub(data);
        if(data) {
            await fetchSubjectSpecificTestSeries(data);
        }else {
            await fetchSubjectWiseTestSeries();
        }
    }

    return (
        <>
            <Head>
                <title>Set2Score-TestSeries</title>
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
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.mainContainer}>
                                                <Loader/>
                                            </Grid>
                                        </Grid>
                                    :
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.mainContainer}>
                                                <NavigationMenu />
                                            </Grid>

                                            <Grid container className={styles.mainContainer}>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <h4 className={styles.testSeriesHeaderText}>Our
                                                                {
                                                                    activeTabs === 'full' ?
                                                                        <span className={styles.testSeriesText}>Test Series</span>
                                                                    :
                                                                        <span className={styles.testSeriesText}>Test Progress</span>
                                                                }
                                                            </h4>                                                
                                                        </Grid>
                                                    </Grid>

                                                    {/* <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.paperSolutionCard}>
                                                                            <Grid container>
                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.firstRow}>
                                                                                    <span className={styles.cardTitle}>Previous Year Papers with Solutions</span>
                                                                                </Grid>
                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.secondRow}>
                                                                                    <span className={styles.departmentTitle}>Department: Chemical Engineering</span>
                                                                                </Grid>
                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.featureContainer}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.leftSideFeatureContainer}>
                                                                                            <ul>
                                                                                                <li>10 Full length papers</li>
                                                                                                <li>40+ Subject wise papers</li>
                                                                                            </ul>
                                                                                        </Grid>
                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                                                            <ul>
                                                                                                <li>3 mock test -FREE</li>
                                                                                                <li>Subscription Valid Till : <span className={styles.validDate}>31st March 2024</span></li>
                                                                                            </ul>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.costAndActionContainer}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.btnContainer}>
                                                                                            <Button
                                                                                                className={styles.previewBtn}
                                                                                            >
                                                                                                Preview
                                                                                            </Button>
                                                                                            <Button
                                                                                                className={styles.subscribeBtn}
                                                                                            >
                                                                                                Subscribe
                                                                                            </Button>
                                                                                        </Grid>
                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.discountContainer}>
                                                                                                    <span>10% discount</span>
                                                                                                </Grid>
                                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.costSection}>
                                                                                                    <Grid container className={styles.costContainer}>
                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={7} className={styles.costActual}>
                                                                                                            <span>Cost: </span>
                                                                                                            <span className={styles.actualPrice}>Rs. 150</span>
                                                                                                        </Grid>
                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={5} className={styles.costDiscount}>
                                                                                                            <span className={styles.discountedPrice}>Rs. 50</span>
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
                                                                <Grid item xl={2} lg={2} md={0} sm={0} xs={0}>
                                                                </Grid>
                                                                <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className={styles.rightSection}>
                                                                    <Grid container>
                                                                        <Grid item xl={6} lg={2} md={4} sm={3} xs={0}></Grid>
                                                                        <Grid item xl={4} lg={8} md={6} sm={7} xs={10} className={styles.linkSection}>
                                                                            <LinkSection/>
                                                                        </Grid>
                                                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.socialMediaIconsContainer}>
                                                                            <SocialMediaIcons />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> */}

                                                    <Grid container>
                                                        <Grid item xl={8} lg={8} sm={12} md={12} xs={12}>
                                                            {
                                                                activeTabs === "full" ?
                                                                    <Grid container className={styles.testSeriesDetailsCard}>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            {
                                                                                storeData && storeData?.length ?
                                                                                    storeData?.map((value,idx) => (
                                                                                        <div 
                                                                                            key={idx}
                                                                                        >
                                                                                            <DynamicCardWithPrice data={value}/>
                                                                                        </div>
                                                                                    ))
                                                                                :
                                                                                    <p>Test series data not found</p>
                                                                            }
                                                                        </Grid>
                                                                    </Grid>
                                                                :
                                                                    <Grid container className={styles.testSeriesDetailsCard}>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            <Grid container>
                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.testProgressCard}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.testProgressCardInner}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                    <span className={styles.examTitle}>Target: GATE 2024</span>
                                                                                                </Grid>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                    <Grid container>
                                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                                            <Grid container className={styles.testProgressInsightCard}>
                                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                    <Grid container className={styles.fullLengthTestProgressCardInnerContainer}>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                            <span className={styles.fullLengthTitle}>Full Length</span>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.availableCompleteGrid}>
                                                                                                                            <span className={styles.availableCompleteText}>Available / Completed</span>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                            <Grid container>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of Free mock test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>04</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>01</span>
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of Paid mock test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>08</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>03</span>
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.totalTestDetailGrid}>
                                                                                                                            <Grid container>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of total mock test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>12</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>04</span>
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                                            <Grid container className={styles.testProgressInsightCard}>
                                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                    <Grid container className={styles.fullLengthTestProgressCardInnerContainer}>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                            <span className={styles.fullLengthTitle}>Subject Wise</span>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.availableCompleteGrid}>
                                                                                                                            <span className={styles.availableCompleteText}>Available / Completed</span>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                            <Grid container>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of free subject wise test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>04</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>01</span>
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of paid subject wise test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>08</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>03</span>
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.totalTestDetailGrid}>
                                                                                                                            <Grid container>
                                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                    <span className={styles.numberOfText}>Number of total subject wise test :</span>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.testInsightDataGrid}>
                                                                                                                                    <span>
                                                                                                                                        <span className={styles.availableTestNumber}>12</span>
                                                                                                                                        <span className={styles.slash}>/</span>
                                                                                                                                        <span className={styles.completedTestNumber}>04</span>
                                                                                                                                    </span>
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
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                            }
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} sm={12} md={12} xs={12}>
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

                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xl={8} lg={8} md={12} sm={12} xs={12} className={styles.testSeriesSection}>
                                                            <Grid container className={styles.testSeriesActiveModesGrid}>
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

                                                            {
                                                                activeTabs === 'subject' ?
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                            <Grid container className={styles.selectSubContainer}>
                                                                                <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                                                                                    <Autocomplete
                                                                                        className={styles.autocompleteField}
                                                                                        name="subject"
                                                                                        value={selectedSub}
                                                                                        options={subjectList}
                                                                                        autoHighlight
                                                                                        onChange={(e, val) => handleSubjectSelect(val)}
                                                                                        getOptionLabel={(option) => option.title ? option.title : ""}
                                                                                        renderOption={(props, option) => (
                                                                                            <Box
                                                                                                component="li"
                                                                                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                                                                {...props}
                                                                                            >
                                                                                                {option.title}
                                                                                            </Box>
                                                                                        )}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                className="department-dropdown"
                                                                                                {...params}
                                                                                                label="Subject"
                                                                                                placeholder="Select the subject"
                                                                                                inputProps={{
                                                                                                    ...params.inputProps,
                                                                                                    autoComplete: "off",
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                : null
                                                            }

                                                            <Grid container className={styles.testSeriesCardContainer}>
                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                    <Grid container>
                                                                        {
                                                                            data?.length ?
                                                                                data.map((testSeries,i) => (
                                                                                    <Grid
                                                                                        item
                                                                                        key={i}
                                                                                        xl={12}
                                                                                        lg={12}
                                                                                        md={12}
                                                                                        sm={12}
                                                                                        xs={12}
                                                                                        className={testSeries.lock ? styles.paidTestDetailCard : styles.freeTestDetailCard}
                                                                                    >
                                                                                        <Grid container className={styles.testDetailContainer}>
                                                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                                <Grid container>
                                                                                                    <Grid item xl={10} lg={10} md={10} sm={10} xs={12} className={styles.paperTitleMainGrid}>
                                                                                                        <span 
                                                                                                            className={styles.paperTitle}
                                                                                                        >
                                                                                                            Full length paper | {testSeries.name.en}
                                                                                                        </span>
                                                                                                    </Grid>
                                                                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
                                                                                                        <Button
                                                                                                            className={testSeries.lock ? styles.lockedTestBtn : styles.freeTestBtn}
                                                                                                        >
                                                                                                            <Image
                                                                                                                src={testSeries.lock ? LockIcon : UnlockIcon}
                                                                                                                alt={testSeries.lock ? 'lockIcon' : 'unlockIcon'}
                                                                                                            />
                                                                                                            {testSeries.lock ? "Locked" : "Free"}
                                                                                                        </Button>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                                    <Grid container className={styles.testInfoContainer}>
                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                                                                            <Grid container>
                                                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                                                    <span className={styles.marksQuesAndTimeDetails}>{testSeries.marks} Marks | {testSeries.totalQuestions} Questions | {testSeries.time/60}hrs</span>
                                                                                                                </Grid>
                                                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                                                    <Grid container>
                                                                                                                        {
                                                                                                                            dayjs(testSeries.releaseDate).isBefore(currentDate) ? 
                                                                                                                                <Grid
                                                                                                                                    item
                                                                                                                                    xl={12}
                                                                                                                                    lg={12}
                                                                                                                                    md={12}
                                                                                                                                    sm={12}
                                                                                                                                    xs={12}
                                                                                                                                    className={styles.unlockDateGrid}
                                                                                                                                >
                                                                                                                                    <span>Paper unlocked on:</span>
                                                                                                                                    <Image
                                                                                                                                        src={blackUnlockIcon}
                                                                                                                                        alt="UnlockIcon"
                                                                                                                                        className={styles.lockIcon}
                                                                                                                                    />
                                                                                                                                    <span
                                                                                                                                        className={styles.unlockDate}
                                                                                                                                    >
                                                                                                                                        {dayjs(testSeries.releaseDate).format('DD/MM/YYYY')}
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                            :
                                                                                                                                <Grid
                                                                                                                                    item
                                                                                                                                    xl={12}
                                                                                                                                    lg={12}
                                                                                                                                    md={12}
                                                                                                                                    sm={12}
                                                                                                                                    xs={12}
                                                                                                                                    className={styles.unlockDateGrid}
                                                                                                                                >
                                                                                                                                    <span>Paper will be unlocked on:</span>
                                                                                                                                    <Image
                                                                                                                                        src={blackLockIcon}
                                                                                                                                        alt="lockIcon"
                                                                                                                                        className={styles.lockIcon}
                                                                                                                                    />
                                                                                                                                    <span
                                                                                                                                        className={styles.unlockDate}
                                                                                                                                    >
                                                                                                                                        {dayjs(testSeries.releaseDate).format('DD/MM/YYYY')}
                                                                                                                                    </span>
                                                                                                                                </Grid>
                                                                                                                        }
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.startTestBtnMainGrid}>
                                                                                                            <Grid container>
                                                                                                                {
                                                                                                                    testResponseData && testResponseData?.length && testResponseData?.includes(testSeries._id) ?
                                                                                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                                                            <Grid container className={styles.testResBtnContainer}>
                                                                                                                                <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                                                                                                                                    <Grid container>
                                                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                                                                                                            <Link
                                                                                                                                                href={{ 
                                                                                                                                                    pathname: '/scoreCard',
                                                                                                                                                    query: {
                                                                                                                                                        id : testSeries._id,
                                                                                                                                                        section : 'testSeries'
                                                                                                                                                    }
                                                                                                                                                }}
                                                                                                                                            >
                                                                                                                                                <Button
                                                                                                                                                    className={styles.scoreCardBtn}
                                                                                                                                                >
                                                                                                                                                    Score Card 
                                                                                                                                                </Button>
                                                                                                                                            </Link>
                                                                                                                                        </Grid>
                                                                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                                                                                                            <Link 
                                                                                                                                                href={{ 
                                                                                                                                                    pathname: '/responseSheet',
                                                                                                                                                    query: {
                                                                                                                                                        id : testSeries._id,
                                                                                                                                                        section : 'testSeries'
                                                                                                                                                    }
                                                                                                                                                }}
                                                                                                                                            >
                                                                                                                                                <Button
                                                                                                                                                    className={styles.responseSheetBtn}
                                                                                                                                                >
                                                                                                                                                    View response sheet 
                                                                                                                                                </Button>
                                                                                                                                            </Link>
                                                                                                                                        </Grid>
                                                                                                                                    </Grid>
                                                                                                                                </Grid>
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    :
                                                                                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.startTestBtnContainer}>
                                                                                                                            <Button
                                                                                                                                className={styles.startTestBtn}
                                                                                                                                disabled={testSeries.lock || dayjs(testSeries.releaseDate).isAfter(currentDate)}
                                                                                                                                // disabled={testSeries.lock}
                                                                                                                                onClick={() => handleStartTestClick(testSeries._id)}
                                                                                                                                >
                                                                                                                                Start test
                                                                                                                            </Button>
                                                                                                                        </Grid>
                                                                                                                }
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                    </Grid>

                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                ))
                                                                            :
                                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                    <p>No Data Found!</p>
                                                                                </Grid>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {/* GET_THE_APP_SECTION: START */}
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <GetTheApp />
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
                    : null
                }
            </section>
        </>
    )
}

export default TestSeries;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    
    // if(!session) {
    //     return {
    //         redirect: { destination: "/" },
    //     };
    // }
      
    return {
        props: { session }
    }
}