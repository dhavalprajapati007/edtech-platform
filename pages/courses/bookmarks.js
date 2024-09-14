import { Button, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import GetTheApp from '../../components/GetTheApp';
import Footer from '../../components/Footer';
import NavigationMenu from '../../components/NavigationMenu';
import Loader from '../../components/Loader';
import { toastAlert } from '../../helpers/toastAlert';
import { handleLogout } from '../../utils/logout';
import Question from '../../components/Question';
import Choices from '../../components/Choices';
import AnswerInput from '../../components/AnswerInput';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Solution from '../../components/Solution';
import styles from '../../styles/Bookmark.module.css';
import scrollBarStyles from '../../styles/Scrollbar.module.css';
import { handleContextMenu, handleKeyDown, transform } from '../../helpers/helper.js';
import Report from '../../components/Modal/Report.js';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from '@mui/material/styles';
import Calc from "../../public/assets/images/Calc.png"
import { useRouter } from 'next/router';
import Image from 'next/image';
import Draggable from 'react-draggable';
import ScientificCalculator from '../../components/ScientificCalculator';
import { requestAPI } from '../../helpers/apiHelper';


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid #80A787`,
    borderRadius: '5px',
    // '&:not(:last-child)': {
    //     borderBottom: 0,
    // },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Bookmarks = ({ session }) => {
    const [expanded, setExpanded] = React.useState('panel0');
    const [loading, setLoading] = useState(false);
    const [bookmarkType, setBookmarkType] = useState('PreviousPaper');
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [userActionData, setUserActionData] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [data, setData] = useState([]);
    const [questionsList, setQuestionsList] = useState([]);
    const [activeSection, setActiveSection] = useState(0);
    const router = useRouter();
    const questionsPerPage = 5;
    
    useEffect(() => {
        if(session) {
            fetchFilteredBookMark();
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
    },[session]);

    const fetchFilteredBookMark = async () => {
        try {
            setLoading(true);
            let questionId = await sessionStorage.getItem('questionId');
            let subjectId = await sessionStorage.getItem('subjectId');
            sessionStorage.clear();

            let URL = '/api/bookmarks/get-filtered-bookmark-question';
            
            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(data?.data?.length ? data?.data : []);
                setQuestionsList(data?.data[activeSection]?.questions?.length ? data?.data[activeSection]?.questions : []);
                const allQuestions = data?.data?.flatMap(subjectWiseQues => subjectWiseQues.questions);
                const initialUserActionData = await allQuestions?.map((question) => ({
                    id: question._id,
                    isVisible: false,
                    answer: "",
                    result: ""
                }));
                setUserActionData(initialUserActionData);
                setLoading(false);
                if(questionId && subjectId) {
                    handleRedirectToQuestion(subjectId,questionId,data.data);
                }else {
                    // Logic to get the current set of questions based on the currentPage
                    const indexOfLastQuestion = currentPage * questionsPerPage;
                    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
                    setCurrentQuestions(data?.data[activeSection]?.questions.slice(indexOfFirstQuestion, indexOfLastQuestion));    
                }
            } else {
                if (data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                setLoading(false);
                console.log(data.message, "errorInFullPaperLoad");
            }
        }catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const toggleSolutionVisibility = (id) => {
        const newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.id === id);
        newUserActionData[arrIndex].isVisible = !newUserActionData[arrIndex]?.isVisible;
        setUserActionData(newUserActionData);
    };

    const manageBookmark = async(que) => {
        try {
            setBookmarkLoading(true);

            let URL = `/api/bookmarks/bookmark-question`;
            
            let body;
            if(bookmarkType === 'PreviousPaper') {
                body = {
                    question_id: que?._id,
                    type: bookmarkType,
                    previous_paper_id: que?.previousPaperId,
                    subjectId: que?.subject
                }
            }else if(bookmarkType === 'TestSeries') {
                body = {
                    question_id: que?._id,
                    type: bookmarkType,
                    test_series_id: que?.testSeriesId,
                    subjectId: que?.subject
                };
            }

            let reqObj = {
                method: "POST",
                body: JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);
            
            if(data && data?.statusCode == 200) {
                setBookmarkLoading(false);
                toastAlert(data.message,"success");
                await fetchFilteredBookMark();
            } else {
                setBookmarkLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"errorInForgotPassword");
            }
        } catch(e) {
            setBookmarkLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    }

    const handleMCQAnswerSelect = async (event, id, index) => {
        const newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.id === id);
        let specificData = newUserActionData[arrIndex];
        let choiceAns = await questionsList[index]?.choices?.find((choice) => choice?._id === event.target.value);
        specificData.answer = choiceAns?._id;
        specificData.result = choiceAns?.answer;
        setUserActionData(newUserActionData);
    };

    const handleMSQAnswerSelect = async (choice, id) => {
        const newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.id === id);
        let specificData = newUserActionData[arrIndex];
        if (!specificData?.answer?.length) {
            let arr = [];
            arr.push(choice?._id);
            specificData.answer = arr
        } else {
            if (specificData.answer.some(answer => answer === choice._id)) {
                specificData.answer = specificData.answer.filter((ansId => ansId !== choice._id))
            } else {
                specificData.answer.push(choice?._id);
            }
        }
        setUserActionData(newUserActionData);
    }

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const checkAnswer = (answer, id) => {
        let newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.id === id);
        let specificData = newUserActionData[arrIndex];
        let value = Number(specificData?.answer);
        const t = answer.indexOf(",");
        if (t != -1) {
            //two range answer
            //Divide it into 2 parts 
            let splitAns = answer.split(",");
            const answer1 = splitAns[0].split("to");
            //answer1 is first range
            const answer2 = splitAns[1].split("to");
            // answer2 is second range
            if ((Number(answer1[0]) <= value && value <= Number(answer1[1])) || (Number(answer2[0]) <= value && value <= Number(answer2[1]))) {
                specificData.result = true;
                setUserActionData(newUserActionData);
            } else {
                specificData.result = false;
                setUserActionData(newUserActionData);
            }
        } else {
            // One Range
            const check = answer.indexOf("to");
            if (check != -1) {
                let myna = answer.split("to");
                if (Number(myna[0]) <= value && value <= Number(myna[1])) {
                    specificData.result = true;
                    setUserActionData(newUserActionData);
                } else {
                    specificData.result = false;
                    setUserActionData(newUserActionData);
                }
            } else {
                //only one answer
                if (Number(answer) == value) {
                    specificData.result = true;
                    setUserActionData(newUserActionData);
                } else {
                    specificData.result = false;
                    setUserActionData(newUserActionData);
                }
            }
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleAccordionChange = (panel, idx) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        setQuestionsList(data[idx]?.questions?.length ? data[idx]?.questions : []);
        setCurrentQuestions(data[idx]?.questions.slice(0, 5));
        setActiveSection(idx);
        setCurrentPage(1);
        scrollToTop();
    };

    const handleAnswerValue = async (value, id) => {
        setUserActionData(prevState => {
            const newState = [...prevState];
            const arrIndex = newState.findIndex(obj => obj.id === id);
            newState[arrIndex] = { ...newState[arrIndex], answer: value, result: "" };
            return newState;
        });
    };

    const handleQuestionIndexClick = (subIdx, questionId, data) => {
        let currentPage = parseInt(questionId / 5) + 1;
        setActiveSection(parseInt(subIdx));
        setExpanded(`panel${subIdx}`)
        setQuestionsList(data[subIdx]?.questions?.length ? data[subIdx]?.questions : []);
        setCurrentPage(currentPage);
        setCurrentQuestions(data[subIdx]?.questions.slice((currentPage * 5) - 5, currentPage * 5));
        setTimeout(() => {
            const element = document.getElementById(`question-${questionId % 5}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
    }

    const handleRedirectToQuestion = async (subjectId, questionId, data) => {
        let currentPage = parseInt(questionId / 5) + 1;
        let subIdx = await data?.findIndex((bookmarkData) => bookmarkData?.subject?._id === subjectId);
        setActiveSection(parseInt(subIdx));
        setExpanded(`panel${subIdx}`)
        setQuestionsList(data[subIdx]?.questions?.length ? data[subIdx]?.questions : []);
        setCurrentPage(currentPage);
        setCurrentQuestions(data[subIdx]?.questions.slice((currentPage * 5) - 5, currentPage * 5));
        setTimeout(() => {
            const element = document.getElementById(`question-${questionId % 5}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
    }

    const redirectToDiscussion = async(question) => {
        let queIdx = await data[activeSection]?.questions?.findIndex((ques) => ques._id === question?._id);
        let subjectId = await data[activeSection]?.subject?._id;
        await sessionStorage.setItem('questionId',queIdx);
        await sessionStorage.setItem('subjectId',subjectId);

        router.push({
            pathname: '/discussion',
            query: { id: question?._id, refId: question?.type === "TestSeries" ? question?.test_series_id : question?.previous_paper_id , mode: question?.type, target: 'bookmark' }
        })
    }

    const handlePreviousClick = () => {
        if(activeSection === 0) {
            return
        }
        let first5Ques;
        setQuestionsList(data[activeSection - 1]?.questions?.length ? data[activeSection - 1]?.questions : []);
        first5Ques = data[activeSection - 1]?.questions.slice(0, 5);
        setCurrentPage(1);
        setCurrentQuestions(first5Ques);
        setActiveSection(activeSection - 1);
        setExpanded(`panel${activeSection - 1}`);
        scrollToTop();
    }

    const handleNextClick = () => {
        let first5Ques;
        if(data?.length <= activeSection+1) {
            return
        }else {
            setQuestionsList(data[activeSection + 1]?.questions?.length ? data[activeSection + 1]?.questions : []);
            first5Ques = data[activeSection + 1]?.questions.slice(0, 5);
        }
        setCurrentPage(1);
        setCurrentQuestions(first5Ques);
        setActiveSection(activeSection + 1);
        setExpanded(`panel${activeSection + 1}`);
        scrollToTop();
    }

    // Function to handle the previous button click
    const handlePrevPageClick = () => {
        setCurrentPage(currentPage - 1);
        const indexOfLastQuestion = (currentPage - 1) * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        let data = questionsList.slice(indexOfFirstQuestion, indexOfLastQuestion);
        if (data?.length) {
            setCurrentQuestions(data);
            setTimeout(() => {
                scrollToTop();
            }, 50);
        } else {
            return
        }
    };

    // Function to handle the next button click
    const handleNextPageClick = () => {
        const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        let data = questionsList.slice(indexOfFirstQuestion, indexOfLastQuestion);
        if (data?.length) {
            setCurrentPage(currentPage + 1);
            setCurrentQuestions(data);
            setTimeout(() => {
                scrollToTop();
            }, 50);
        } else {
            return
        }
    };

    const handleCalcClose = () => {
        setShowCalculator(false);
    }

    return (
        <>
            <Head>
                <title>Set2Score-Bookmarks</title>
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
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <p className={styles.bookmarkText}>Bookmarks</p>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container>
                                                            <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.bookmarkQuestionMainContainer}>
                                                                        <Grid container>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.bookmarkQuestionInnerContainer} ${scrollBarStyles.myCustomScrollbar}`}>
                                                                                <Grid container>
                                                                                    {
                                                                                        currentQuestions?.map((question, i) => (
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.singleQuestion} key={i} id={`question-${i}`}>
                                                                                                <Grid container className={styles.questionInnerContainer}>
                                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                        <Grid container>
                                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                <Question
                                                                                                                    question={question}
                                                                                                                    index={((currentPage - 1) * questionsPerPage) + (i)}
                                                                                                                    bookmarkLoading={bookmarkLoading}
                                                                                                                    manageBookmark={manageBookmark}
                                                                                                                    bookmarked={true}
                                                                                                                    mode="bookmark"
                                                                                                                />
                                                                                                            </Grid>
                                                                                                        </Grid>

                                                                                                        <Grid container>
                                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                <Choices
                                                                                                                    question={question}
                                                                                                                    userActionData={userActionData}
                                                                                                                    index={((currentPage - 1) * questionsPerPage) + (i)}
                                                                                                                    handleMCQAnswerSelect={handleMCQAnswerSelect}
                                                                                                                    handleMSQAnswerSelect={handleMSQAnswerSelect}
                                                                                                                    mode={"full"}
                                                                                                                />
                                                                                                            </Grid>

                                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                <AnswerInput
                                                                                                                    question={question}
                                                                                                                    userActionData={userActionData}
                                                                                                                    handleAnswerValue={handleAnswerValue}
                                                                                                                    checkAnswer={checkAnswer}
                                                                                                                    mode={"full"}
                                                                                                                />
                                                                                                            </Grid>
                                                                                                        </Grid>

                                                                                                        <Grid container>
                                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                <Grid container>
                                                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                        <Grid container>
                                                                                                                            <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                <Button className={styles.showHideSolBtn} onClick={() => toggleSolutionVisibility(question._id)}>
                                                                                                                                    {userActionData?.find(item => item.id === question?._id)?.isVisible ? "Hide Solution" : "Show Solution"}
                                                                                                                                </Button>
                                                                                                                            </Grid>
                                                                                                                            <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                                                                                <Grid container>
                                                                                                                                    <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                                        <Button
                                                                                                                                            onClick={() => redirectToDiscussion(question)}    
                                                                                                                                            className={styles.discussionBtn}
                                                                                                                                        >
                                                                                                                                            Discussion
                                                                                                                                        </Button>
                                                                                                                                    </Grid>
                                                                                                                                    <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.reportIconContainer}>
                                                                                                                                        <ReportProblemIcon
                                                                                                                                            className={styles.reportButton}
                                                                                                                                            onClick={() => setShowReportModal(true)}
                                                                                                                                        />
                                                                                                                                        {
                                                                                                                                            showReportModal ?
                                                                                                                                                <Report
                                                                                                                                                    open={showReportModal}
                                                                                                                                                    handleClose={closeReportModal}
                                                                                                                                                    type={"question"}
                                                                                                                                                    referenceId={question._id}
                                                                                                                                                />
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

                                                                                                        {/* Solution */}
                                                                                                        {
                                                                                                            userActionData?.find(item => item.id === question._id)?.isVisible ?
                                                                                                                <Grid container>
                                                                                                                    <Grid item xl={11} lg={11} sm={11} md={11} xs={11}>
                                                                                                                        <Solution
                                                                                                                            question={question}
                                                                                                                            transform={transform}
                                                                                                                        />
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                                : null
                                                                                                        }
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        ))
                                                                                    }
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container>
                                                                    {
                                                                        questionsList?.length ?
                                                                            <Grid item xl={11} lg={11} sm={11} md={11} xs={11} className={styles.prevNextBtnSection}>
                                                                                <Grid container>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                        <Button
                                                                                            className={styles.navActionBtn}
                                                                                            style={{ marginRight: "10px" }}
                                                                                            onClick={() => activeSection !== 0 && handlePreviousClick()}
                                                                                        >
                                                                                            <KeyboardDoubleArrowLeftIcon />
                                                                                        </Button>
                                                                                        <Button
                                                                                            className={styles.navActionBtn}
                                                                                            disabled={currentPage === 1}
                                                                                            onClick={() => handlePrevPageClick()}
                                                                                        >
                                                                                            <NavigateBeforeIcon />
                                                                                        </Button>
                                                                                    </Grid>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.nextBtnSection}>
                                                                                        <Button
                                                                                            className={styles.navActionBtn}
                                                                                            style={{ marginRight: "10px" }}
                                                                                            disabled={currentQuestions?.length < questionsPerPage}
                                                                                            onClick={() => handleNextPageClick()}
                                                                                        >
                                                                                            <NavigateNextIcon />
                                                                                        </Button>
                                                                                        <Button
                                                                                            className={styles.navActionBtn}
                                                                                            onClick={() => activeSection !== data?.sections?.length - 1 && handleNextClick()}
                                                                                        >
                                                                                            <KeyboardDoubleArrowRightIcon />
                                                                                        </Button>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        : null
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xl={3} lg={3} sm={12} md={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.calcAndFilterGrid}>
                                                                                <Grid container>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                        <Grid container>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                <Button
                                                                                                    className={styles.calcBtn}
                                                                                                    onClick={() => setShowCalculator(!showCalculator)}
                                                                                                >
                                                                                                    Calculator
                                                                                                    <Image src={Calc} className={styles.calcIcon} alt="calcIcon" />
                                                                                                </Button>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                        <Grid container className={showCalculator ? styles.showCalc : styles.hideCalc}>
                                                                                            <Draggable
                                                                                                allowAnyClick={true}
                                                                                                axis="both"
                                                                                                handle=".handle"
                                                                                                defaultPosition={{ x: 0, y: 0 }}
                                                                                                position={null}
                                                                                                grid={[25, 25]}
                                                                                                scale={1}
                                                                                            >
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.scientificCalcContainer} ${"handle"}`}>
                                                                                                    <ScientificCalculator
                                                                                                        handleClose={handleCalcClose}
                                                                                                    />
                                                                                                </Grid>
                                                                                            </Draggable>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                        <Grid container>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.langSection}>
                                                                                                <span>View in</span>
                                                                                                <span className={styles.langText}>English</span>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionMainGrid}>
                                                                        <Grid container>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.sectionMainContainer} ${scrollBarStyles.myCustomScrollbar}`}>
                                                                                <Grid container>
                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionInnerContainer}>
                                                                                        <Grid container>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionContainer}>
                                                                                                <span>Subject wise Bookmarks</span>
                                                                                            </Grid>

                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                {
                                                                                                    data?.map((subjectData, subIdx) => (
                                                                                                        <Accordion
                                                                                                            key={subIdx}
                                                                                                            expanded={expanded === `panel${subIdx}`}
                                                                                                            onChange={handleAccordionChange(`panel${subIdx}`, subIdx)}
                                                                                                            className={styles.accordionMain}
                                                                                                        >
                                                                                                            <AccordionSummary
                                                                                                                aria-controls={`panel${subIdx}d-content`}
                                                                                                                id={`panel${subIdx}d-header`}
                                                                                                                className={activeSection === subIdx ? styles.activeAccordionSummary : ""}
                                                                                                            >
                                                                                                                <Typography
                                                                                                                    className={activeSection === subIdx ? styles.activeAccordionTitle : styles.accordionTitle}
                                                                                                                >
                                                                                                                    {subjectData?.subject?.title}
                                                                                                                </Typography>
                                                                                                            </AccordionSummary>
                                                                                                            <AccordionDetails>
                                                                                                                <Grid container>
                                                                                                                    {
                                                                                                                        subjectData?.questions?.map((question, questionId) => (
                                                                                                                            <>
                                                                                                                                {(questionId % 6 === 0) && (
                                                                                                                                    <Grid container className={styles.questionIndexContainer} key={questionId}>
                                                                                                                                        {/* Add Grid container for every 5th index */}
                                                                                                                                    </Grid>
                                                                                                                                )}
                                                                                                                                <Grid item xl={2} lg={2} sm={2} md={2} xs={2}>
                                                                                                                                    <div
                                                                                                                                        key={question._id}
                                                                                                                                        className={styles.indexBtn}
                                                                                                                                        onClick={() => handleQuestionIndexClick(subIdx, questionId, data)}
                                                                                                                                    >
                                                                                                                                        {questionId + 1}
                                                                                                                                    </div>
                                                                                                                                </Grid>
                                                                                                                            </>
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </Grid>
                                                                                                            </AccordionDetails>
                                                                                                        </Accordion>
                                                                                                    ))
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

export default Bookmarks;

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