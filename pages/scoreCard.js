import { Button, Grid } from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from "../styles/ScoreCard.module.css";
import dynamic from 'next/dynamic'
import NoSSR from '../components/NoSSR';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { formatTime, handleContextMenu, handleKeyDown } from '../helpers/helper';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';
import { toastAlert } from '../helpers/toastAlert';
import { requestAPI } from '../helpers/apiHelper';

const ScoreCard = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const router = useRouter();
    const { id, section } = router.query;

    useEffect(() => {
        setLoading(true);
        fetchTestResponseData();

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

    const fetchTestResponseData = async () => {
        try {
            let URL = '/api/result/get-single-test-response';
            
            let body = {
                id,
                mode: section === "pastPapers" ? 'PreviousYear' : "TestSeries"
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
                console.log(data.message,"errorInFullPaperLoad");                  
            }
        } catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    };

    let testAnalysisData = {
        options: {
            labels: ["Wrong questions","Correct questions", "Unattempted"],
            colors: ['#FF0000', "#34B53A", "#DBDBDB"],
            theme: {
                monochrome: {
                    enabled: false
                }
            },
            legend: {
                show: false,
                position: 'top',
                horizontalAlign: 'left',
                fontFamily : 'Poppins'
            },
            fill: {
                colors: ['#FF0000', "#34B53A", "#DBDBDB"],
            },
            responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%"
                    },
                    legend: {
                        show: false
                    }
                }
            }
            ],
            chart: {
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        console.log(config?.w?.config?.labels[config?.dataPointIndex]);
                    }
                },
                type: 'pie'
            }
        },
        series: [data?.wrongAns ? data?.wrongAns : 0,data?.correctAns ? data?.correctAns : 0,data?.unattempted ? data?.unattempted : 0]
    }

    // let radialBarChart = {
    //     options: {
    //         chart: {
    //             height: 280,
    //             type: "radialBar"
    //         },
    //         series: [67],
    //         colors: ["#20E647"],
    //         plotOptions: {
    //             radialBar: {
    //             hollow: {
    //                 margin: 0,
    //                 size: "70%",
    //                 background: "#293450"
    //             },
    //             track: {
    //                 dropShadow: {
    //                 enabled: true,
    //                 top: 2,
    //                 left: 0,
    //                 blur: 4,
    //                 opacity: 0.15
    //                 }
    //             },
    //             dataLabels: {
    //                 name: {
    //                 offsetY: -10,
    //                 color: "#fff",
    //                 fontSize: "13px"
    //                 },
    //                 value: {
    //                 color: "#fff",
    //                 fontSize: "30px",
    //                 show: true
    //                 }
    //             }
    //             }
    //         },
    //         fill: {
    //             type: "gradient",
    //             gradient: {
    //             shade: "dark",
    //             type: "vertical",
    //             gradientToColors: ["#87D4F9"],
    //             stops: [0, 100]
    //             }
    //         },
    //         stroke: {
    //             lineCap: "round"
    //         },
    //         labels: ["Progress"]
    //     }
    // }

    const calculatePercentage = () => {
        const percentage = (data.finalMarks / data.positiveMarks) * 100;
        if(percentage < 0 || isNaN(percentage)) {
            return 0;
        } else {
            return percentage.toFixed(2);
        }
    }
    
    return (
        <div>
            <NoSSR>
                <Head>
                    <title>Set2Score-ScoreCard</title>
                    <meta name="description" content="Skyrocket your presentation for gate exam" />
                    <meta name="keywords" content="gate, set2score, engineering" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.png" />
                </Head>
                <section>
                    <Grid container className={styles.mainContainer}>
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
                                        {/* <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Link href={`/${section}`}>
                                                    <Button className={styles.backToHome}>
                                                        Back to home
                                                    </Button>
                                                </Link>
                                            </Grid>
                                        </Grid> */}

                                        <Grid container className={styles.detailsAndScoreContainer}>
                                            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className={styles.testDetailsMainGrid}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Link href={`/${section}`}>
                                                            <Button className={styles.backToHome}>
                                                                Back to home
                                                            </Button>
                                                        </Link>
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <Grid container className={styles.testDetails}>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <Grid container className={styles.testDetailsContainer}>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.testDetailsForm}>
                                                                        <span className={styles.testDetailsHeader}>Test Details</span>
                                                                        <p>Name of the test: <span className={styles.testDetailsValue}>{data?.title}</span></p>
                                                                        <p>Total mark: <span className={styles.testDetailsValue}>{data.totalMarks}</span></p>
                                                                        <p>Duration: <span className={styles.testDetailsValue}>{data.duration} Minutes</span></p>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                                                <Grid container className={styles.testAnalysis}>
                                                    {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.candidateScoreContainer}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <span className={styles.candidateScoreHeader}>Candidate Score</span>
                                                            </Grid>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <p>Marks Scored:</p>
                                                                </Grid>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.dataInsight}>
                                                                <div>
                                                                    <div className={styles.squareStyle} style={{background : "var(--thm-color)"}}></div>
                                                                    <span>Your score:  
                                                                        <span style={{color : "var(--thm-color)", fontWeight: 800, marginLeft : "2px"}}>
                                                                            {testData.finalMarks}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className={styles.squareStyle} style={{ background : "#CCCC00"}}></div>
                                                                    <span>Topper score: 91.96</span>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={10} lg={10} sm={12} md={10} xs={12} className={styles.progressBarContainer}>
                                                                <ProgressBar
                                                                    completed={60}
                                                                    barContainerClassName={styles.candidateScoreBarContainer}
                                                                    completedClassName={styles.candidateScoreBarCompleted}
                                                                    labelClassName={styles.label}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> */}

                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Grid container>
                                                            {/* <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.rankContainer}>
                                                                        <Grid container className={styles.rankContent}>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <span>Your Rank in this paper</span>
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.dataInsight}>
                                                                                <div>
                                                                                    <div className={styles.squareStyle} style={{background : "#34B53A"}}></div>
                                                                                    <span>Your rank: <span style={{color : "var(--thm-color)", fontWeight: 800}}>20</span></span>
                                                                                </div>
                                                                                <div>
                                                                                    <div className={styles.squareStyle} style={{ background : "#CCCC00"}}></div>
                                                                                    <span>Total number of candidate's appeared : 1500</span>
                                                                                </div>                                                               
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} >
                                                                                <Chart
                                                                                    className={styles.radilProgressChart}
                                                                                    options={radialBarChart.options}
                                                                                    series={radialBarChart?.options?.series}
                                                                                    type="radialBar"
                                                                                    width={400}
                                                                                    height={300}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid> */}
                                                            
                                                            <Grid item xl={8} lg={8} sm={7} md={6} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.testAnalysisContainer}>
                                                                        <Grid container className={styles.testAnalysisContent}>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <span>Test Analysis</span>
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.dataInsight}>
                                                                                <div>
                                                                                    <div className={styles.squareStyle} style={{background : "#DBDBDB"}}></div>
                                                                                    <span>Unattempted:
                                                                                        <span style={{color : "var(--thm-color)", fontWeight: 800, marginLeft : "3px"}}>
                                                                                            {data?.unattempted}
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    <div className={styles.squareStyle} style={{ background : "#34B53A"}}></div>
                                                                                    <span>Correct questions : {data?.correctAns}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <div className={styles.squareStyle} style={{ background : "#FF0000"}}></div>
                                                                                    <span>Wrong questions : {data?.wrongAns}</span>
                                                                                </div>                                                               
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                {(typeof window !== 'undefined') &&
                                                                                    <Chart
                                                                                        className={styles.testAnalysisPieChart}
                                                                                        options={testAnalysisData?.options}
                                                                                        series={testAnalysisData?.series}
                                                                                        type={"pie"}
                                                                                        width={400}
                                                                                        height={250}
                                                                                    />
                                                                                }
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <span>Total number of questions: {data?.totalQues}</span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Grid container className={styles.marksAnalysisContainer}>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <span>Marks Analysis</span>
                                                            </Grid>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.dataInsight}>
                                                                <div>
                                                                    <span>Total Marks Scored: {data?.positiveMarks}</span>
                                                                </div>
                                                                <div>
                                                                    <div className={styles.squareStyle} style={{background : "#FF0000"}}></div>
                                                                    <span>Negative marks: {data?.negativeMarks}</span>
                                                                </div>
                                                                <div>
                                                                    <div className={styles.squareStyle} style={{ background : "var(--thm-color)"}}></div>
                                                                    <span>Final marks scored: {data?.finalMarks}</span>
                                                                </div>                    
                                                            </Grid>
                                                            <Grid item xl={11} lg={11} sm={11} md={11} xs={12} className={styles.progressBarContainer}>
                                                                <ProgressBar
                                                                    bgcolor={"var(--thm-color)"}
                                                                    completed={calculatePercentage()}
                                                                    remainingBg={"#FF0000"}
                                                                />
                                                            </Grid>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.dataInsight}>
                                                                <div>
                                                                    <span>Idle time left : {formatTime(data?.remainingTime)}</span>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Grid container>
                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                <Link 
                                                                    href={{ 
                                                                        pathname: '/responseSheet',
                                                                        query: { id, section }
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
                                        </Grid>
                                    </Grid>
                                </Grid>
                        }
                    </Grid>
                </section>
            </NoSSR>
        </div>
    )
};

export default ScoreCard;

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