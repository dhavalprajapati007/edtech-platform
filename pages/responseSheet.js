import { Button, Grid, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AnswerInput from '../components/AnswerInput';
import Choices from '../components/Choices';
import QuestionPaper from '../components/Modal/QuestionPaper';
import Question from '../components/Question';
import styles from "../styles/ResponseSheet.module.css";
import scrollBarStyles from '../styles/Scrollbar.module.css';
import { handleLogout } from '../utils/logout';
import ScreenMode from "../public/assets/images/ScreenMode.png"
import TestModeTimer from "../public/assets/images/TestModeTimer.png";
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Solution from '../components/Solution';
import { formatTime, getSelectedAnswerLetter, handleContextMenu, handleKeyDown, transform } from '../helpers/helper';
import Calc from "../public/assets/images/TestModeCalc.png";
import ScientificCalculator from '../components/ScientificCalculator';
import Draggable from 'react-draggable';
import Link from 'next/link';
import Loader from '../components/Loader';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { toastAlert } from '../helpers/toastAlert';
import Report from '../components/Modal/Report';
import { requestAPI } from '../helpers/apiHelper';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
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

const ResponseSheet = ({ session }) => {
    const [showQuestionPaper, setShowQuestionPaper] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [userActionData, setUserActionData] = useState([]);
    const [questionsList, setQuestionsList] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = React.useState('panel0');
    const [activeSection, setActiveSection] = useState(0);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [testResData, setTestResData] = useState([]);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const router = useRouter();
    const { id, section } = router.query;
    let testData = [];

    useEffect(() => {
        setLoading(true);
        let promises = [];

        promises.push(fetchTestResponseData());
        promises.push(fetchBookmark());
        promises.push(fetchData());

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
    }, []);

    const fetchTestResponseData = async () => {
        try {
            let URL = '/api/result/get-single-test-response';

            let body = {
                id,
                mode: section === "pastPapers" ? 'PreviousYear' : "TestSeries"
            };

            let reqObj = {
                method: 'POST',
                body : JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };
        
            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                testData = Object.keys(data?.data).length ? data?.data : [];
                setTestResData(Object.keys(data?.data).length ? data?.data : []);
                let questionData = data?.data?.sections?.flatMap(section => section.questions)?.map((val) => ({...val, showSolution: true}));
                console.log(questionData,'questionData');
                setUserActionData(questionData && questionData?.length ? questionData : []);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"errorInFullPaperLoad");                  
            }
        } catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    };

    const fetchData = async () => {
        try {
            let questionIndex = parseInt(sessionStorage.getItem('questionId'));
            let sectionIndex = parseInt(sessionStorage.getItem('sectionId'));
            sessionStorage.clear();
            let body = {
                id
            };
            
            let URL = "";
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
                let allQuestions;
                if(section === "pastPapers") {
                    const updatedSections = await data?.data?.sections.filter(item => {
                        return testData?.sections?.some(section => section.sectionId === item._id);
                    });
                    console.log(updatedSections, 'updatedSections');
                    let updatedPaperData = { ...data?.data, sections: updatedSections };
                    setData(updatedPaperData);
                    allQuestions = updatedSections?.flatMap(section => section.questions);
                }else {
                    setData(Object.keys(data?.data).length ? data?.data : []);
                    allQuestions = data?.data?.sections?.flatMap(section => section.questions);
                }
                setQuestionsList(allQuestions);
                if(questionIndex && sectionIndex) {
                    let question = await data?.data?.sections[sectionIndex]?.questions[questionIndex];
                    setCurrentQuestion(question);
                    setActiveSection(sectionIndex);
                    setCurrentIndex(questionIndex);
                    setExpanded(`panel${sectionIndex}`);
                }else {
                    setCurrentQuestion(allQuestions[0]);
                    setActiveSection(0);
                    setCurrentIndex(0);
                }
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"errorInDataFetching");                  
            }
        } catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    };

    const fetchBookmark = async() => {
        try {
            let URL = '/api/bookmarks/get-bookmark-question';

            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };
        
            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setBookmarkedQuestions(data?.data?.questions?.length ? data?.data?.questions : [])
            } else {
                toastAlert(data.message,"error");
                console.log(data.message,"errorInBookmarkFetch");
            }
        } catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    }

    const handleModalClose = () => {
        setShowQuestionPaper(false);
    };

    const handleAnswerValue = async(value,id) => {
        setUserActionData(prevState => {
            const newState = [...prevState];
            const arrIndex = newState.findIndex(obj => obj.questionId === id);
            newState[arrIndex] = { ...newState[arrIndex], answer: value, result : ""};
            return newState;
        });
    }

    const handleAccordionChange = (panel,idx) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleQuestionIndexClick = async(sectionId,questionId, id) => {
        setActiveSection(sectionId);
        setCurrentIndex(questionId);
        setCurrentQuestion(questionsList?.find((que) => que?._id === id));
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.questionId === id);
        if(specificData.status === "notVisited") {
            specificData.status = "notAnswered";
        }
        setUserActionData(newUserActionData);
    }

    const handleNext = async() => {
        let questionIndex = await questionsList.findIndex((ques) => ques._id === currentQuestion._id);
        if(data.sections[activeSection].questions.length === currentIndex+1 && data.sections.length !== activeSection+1) {
            setActiveSection(activeSection+1);
            setExpanded(`panel${activeSection+1}`);
            setCurrentIndex(0);
            setCurrentQuestion(questionsList[questionIndex+1]);
        }else{
            if(!(data.sections.length === activeSection+1 && data.sections[activeSection].questions.length === currentIndex+1)) {
                setCurrentIndex(currentIndex+1);
                setCurrentQuestion(questionsList[questionIndex+1]);
            }
        }
    }

    const handlePrev = async() => {
        let questionIndex = await questionsList.findIndex((ques) => ques._id === currentQuestion._id);
        let sectionWiseQuestionIndex = data.sections[activeSection].questions.findIndex((ques) => ques._id === currentQuestion._id);
        if(sectionWiseQuestionIndex === 0 && activeSection !== 0) {
            setActiveSection(activeSection-1);
            setExpanded(`panel${activeSection-1}`);
            setCurrentIndex(data.sections[activeSection-1].questions.length-1);
            setCurrentQuestion(questionsList[questionIndex-1]);
        }else{
            if(!(activeSection === 0 && sectionWiseQuestionIndex === 0)) {
                setCurrentIndex(currentIndex-1);
                setCurrentQuestion(questionsList[questionIndex-1]);
            }
        }
    }

    const toggleSolutionVisibility = (id) => {
        const newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.questionId === id);
        newUserActionData[arrIndex].showSolution = !newUserActionData[arrIndex]?.showSolution;
        setUserActionData(newUserActionData);
    };

    const handleCalcClose = () => {
        setShowCalculator(false);
    };

    const redirectToDiscussion = async(questionId) => {
        let queIdx = await data?.sections[activeSection]?.questions?.findIndex((ques) => ques._id === questionId);
        await sessionStorage.setItem('questionId',queIdx);
        await sessionStorage.setItem('sectionId',activeSection);

        router.push({
            pathname: '/discussion',
            query: { id: questionId, refId: id, mode: section }
        })
    }

    const handleTabClick = async(sectionIndex) => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.questionId === currentQuestion._id);
        if(specificData.status === "notVisited") {
            specificData.status = "notAnswered";
        }
        setUserActionData(newUserActionData);

        setActiveSection(sectionIndex);
        setExpanded(`panel${sectionIndex}`);
        setCurrentIndex(0);
        setCurrentQuestion(data?.sections[sectionIndex]?.questions[0]);
    }

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const manageBookmark = async(que) => {
        try {
            setBookmarkLoading(true);

            let URL = `/api/bookmarks/bookmark-question`;

            let body;
            if(section === 'pastPapers') {   
                body = {
                    question_id: que?._id,
                    type: 'PreviousPaper',
                    previous_paper_id: router.query.id,
                    subjectId: que?.subject
                };
            }else {
                body = {
                    question_id: que?._id,
                    type: 'TestSeries',
                    test_series_id: router.query.id,
                    subjectId: que?.subject
                };
            };

            let reqObj = {
                method: "POST",
                body: JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };
        
            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setBookmarkLoading(false);
                setBookmarkedQuestions(data?.data?.questions?.length ? data?.data?.questions : []);
                toastAlert(data.message,"success");
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

    return (
        <>
            <Head>
                <title>Set2Score-ResponseSheet</title>
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
                                

                                <Grid container className={styles.paperContainer}>
                                    {/* Paper Questions */}
                                    <Grid item xl={9} lg={7} sm={12} md={12} xs={12}>
                                        <Grid container className={styles.testQuestionAndSectionTitleContainer}>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionTitleMainGrid}>
                                                        <span className={styles.sectionStaticText}>Sections</span>
                                                        {
                                                            data?.sections?.map((section,idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`${styles.sectionTitle} ${activeSection === idx ? styles.activeSectinTab : ''}`}
                                                                    onClick={()=>handleTabClick(idx)}
                                                                >
                                                                    {section?.name}
                                                                </span>
                                                            ))
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.testModeQuestionSectionLeft} ${scrollBarStyles.myCustomScrollbar}`}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.singleQuestion} id={`question-${1}`}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <Question
                                                                    question={currentQuestion}
                                                                    index={currentIndex}
                                                                    bookmarkLoading={bookmarkLoading}
                                                                    manageBookmark={manageBookmark}
                                                                    bookmarked={bookmarkedQuestions?.length > 0 && bookmarkedQuestions?.some((bookmarkedQues) => bookmarkedQues?.question_id === currentQuestion?._id)}
                                                                    mode="response"
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <Choices
                                                                    question={currentQuestion}
                                                                    userActionData={userActionData}
                                                                    index={currentIndex}
                                                                    mode={"response"}
                                                                />
                                                            </Grid>

                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <AnswerInput
                                                                    question={currentQuestion}
                                                                    userActionData={userActionData}
                                                                    handleAnswerValue={handleAnswerValue}
                                                                    mode={"response"}
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                        {
                                                            currentQuestion && Object.keys(currentQuestion).length && (currentQuestion.mode === "mcq" || currentQuestion.mode === "msq") ?
                                                                <Grid container className={styles.responseContainer}>
                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <span className={styles.responseText}>
                                                                                    Your response:
                                                                                    <span 
                                                                                        className={userActionData.find(item => item.questionId === currentQuestion._id)?.result ? styles.rightAns : styles.wrongAns}
                                                                                    >
                                                                                        {
                                                                                            userActionData.find(item => item.questionId === currentQuestion._id)?.answer === "" ?
                                                                                                "Not Answered"
                                                                                            :
                                                                                                Object.keys(currentQuestion).length && 
                                                                                                getSelectedAnswerLetter(currentQuestion?.choices,userActionData.find(item => item.questionId === currentQuestion._id)?.answer)
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                            </Grid>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <span className={styles.responseText}>
                                                                                    Correct response:
                                                                                    <span className={styles.rightAns}>
                                                                                        {transform(currentQuestion?.choices)}
                                                                                    </span>
                                                                                </span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            : null
                                                        }

                                                        {
                                                            currentQuestion && Object.keys(currentQuestion).length && currentQuestion.mode === "answer" ?
                                                                <Grid container className={styles.responseContainer}>
                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <span className={styles.responseText}>
                                                                                    Your response:
                                                                                    <span 
                                                                                        className={userActionData.find(item => item.questionId === currentQuestion._id)?.result ? styles.rightAns : styles.wrongAns}
                                                                                    >
                                                                                        {
                                                                                            userActionData.find(item => item.questionId === currentQuestion._id)?.answer === "" ?
                                                                                                "Not Answered"
                                                                                            :
                                                                                                userActionData.find(item => item.questionId === currentQuestion._id)?.answer
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                            </Grid>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <span className={styles.responseText}>
                                                                                    Correct response:
                                                                                    <span className={styles.rightAns}>
                                                                                        {currentQuestion?.answer.en}
                                                                                    </span>
                                                                                </span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            : null
                                                        }
                                                        

                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                        <Grid container>
                                                                            <Button
                                                                                className={styles.showHideSolBtn}
                                                                                onClick={() => toggleSolutionVisibility(currentQuestion._id)}
                                                                            >
                                                                                {
                                                                                    userActionData.find(item => item.questionId === currentQuestion?._id)?.showSolution ?
                                                                                        "Hide Solution"
                                                                                    :
                                                                                        "Show Solution"
                                                                                }
                                                                            </Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                        <Grid container>
                                                                            <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                <Button
                                                                                    className={styles.discussionBtn}
                                                                                    onClick={() => redirectToDiscussion(currentQuestion._id)}
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
                                                                                            referenceId={currentQuestion._id}
                                                                                        />
                                                                                    : null
                                                                                }
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Solution */}
                                                        {
                                                            userActionData.find(item => item.questionId === currentQuestion?._id)?.showSolution ?
                                                                <Grid container>
                                                                    <Grid item xl={11} lg={11} sm={11} md={11} xs={11}>
                                                                        <Solution
                                                                            question={currentQuestion}
                                                                            transform={transform}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            : null
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid container className={styles.navigateBtnContainer}>
                                                <Grid item xl={11} lg={11} sm={11} md={11} xs={11}>
                                                    <Grid container>
                                                        <Grid item xl={8} lg={6} sm={0} md={6} xs={0}>
                                                        </Grid>
                                                        <Grid item xl={4} lg={5} sm={12} md={5} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.textEnd}>
                                                                    <Button
                                                                        className={styles.prevAndNextBtn}
                                                                        onClick={() => handlePrev()}
                                                                    >
                                                                        Prev
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={`${styles.textEnd} ${styles.nextNavBtn}`}>
                                                                    <Button
                                                                        className={styles.prevAndNextBtn}
                                                                        onClick={() => handleNext()}
                                                                    >
                                                                        Next
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Calc and Paper Section : START */}
                                    {/* <Grid item xl={3} lg={5} sm={7} md={6} xs={12} className={styles.fixedCalcAndSectionContainer}>
                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.insightContainer}>
                                                        <Grid container style={{ marginBottom : "30px"}}>
                                                            <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                <div className={styles.answeredTotal}>
                                                                    {userActionData.filter((action) => action.status === "answered").length}
                                                                </div>
                                                                <span>Answered</span>
                                                            </Grid>
                                                            <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                <div className={styles.markedTotal}>
                                                                    {userActionData.filter((action) => action.status === "marked").length}
                                                                </div>
                                                                <span>Marked</span>
                                                            </Grid>
                                                            <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                <div className={styles.notVisitedTotal}>
                                                                    {userActionData.filter((action) => action.status === "notVisited").length}
                                                                </div>
                                                                <span>Not visited</span>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container>
                                                            <Grid item xl={7} lg={7} sm={7} md={7} xs={7}>
                                                                <div className={styles.markedAndAnsweredTotal}>
                                                                    {userActionData.filter((action) => action.status === "markedAndAnswered").length}
                                                                </div>
                                                                <span>Marked and answered</span>
                                                            </Grid>
                                                            <Grid item xl={5} lg={5} sm={5} md={5} xs={5}>
                                                                <div className={styles.notAnsweredTotal}>
                                                                    {userActionData.filter((action) => action.status === "notAnswered").length}
                                                                </div>
                                                                <span>Not answered</span>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid container className={showCalculator ? styles.showCalc : styles.hideCalc}>
                                                    <Draggable
                                                        allowAnyClick={true}
                                                        axis="both"
                                                        handle=".handle"
                                                        defaultPosition={{x: 0, y: 0}}
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

                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionContainer}>
                                                        <span>Sections</span>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        {
                                                            data?.sections?.map((section,sectionId) => (
                                                                <Accordion
                                                                    key={section._id}
                                                                    expanded={expanded === `panel${sectionId}`}
                                                                    onChange={handleAccordionChange(`panel${sectionId}`,sectionId)}
                                                                    className={styles.accordionMain}
                                                                >
                                                                    <AccordionSummary
                                                                        aria-controls={`panel${sectionId}d-content`}
                                                                        id={`panel${sectionId}d-header`}
                                                                        className={activeSection === sectionId ? styles.activeAccordionSummary : ""}
                                                                    >
                                                                        <Typography
                                                                            className={activeSection === sectionId ? styles.activeAccordionTitle : styles.accordionTitle}
                                                                        >
                                                                            {section.name}
                                                                        </Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <Grid container>
                                                                            {
                                                                                section?.questions?.map((question,questionId) => (
                                                                                    <>
                                                                                        {(questionId % 4 === 0) && (
                                                                                            <Grid container className={styles.questionIndexContainer} key={questionId}>
                                                                                            </Grid>
                                                                                        )}
                                                                                        <Grid item xl={3} lg={3} sm={3} md={3} xs={3}>
                                                                                            <div
                                                                                                className={`${userActionData.find(item => item.id === question._id)?.status !== "" ?
                                                                                                    userActionData.find(item => item.id === question._id)?.status === "answered" ?
                                                                                                        styles.answeredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.id === question._id)?.status === "marked" ?
                                                                                                        styles.markedIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.id === question._id)?.status === "markedAndAnswered" ?
                                                                                                        styles.markedAndAnsweredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.id === question._id)?.status === "notAnswered" ?
                                                                                                        styles.notAnsweredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.id === question._id)?.status === "notVisited" &&
                                                                                                        styles.notVisitedIndexBtn
                                                                                                    : styles.indexBtn}
                                                                                                    ${styles.indexBtnContainer}`
                                                                                                }
                                                                                                onClick={() => handleQuestionIndexClick(sectionId,questionId,question._id)}
                                                                                            >
                                                                                                <span
                                                                                                    key={question._id}
                                                                                                >
                                                                                                    {questionId + 1}
                                                                                                </span>
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

                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <Button
                                                    className={styles.questionPaperBtn}
                                                    onClick={() => setShowQuestionPaper(true)}
                                                >
                                                    Question Paper
                                                </Button>
                                            </Grid>
                                            {
                                                showQuestionPaper ?
                                                    <QuestionPaper
                                                        open={showQuestionPaper}
                                                        handleClose={handleModalClose}
                                                        data={data.sections}
                                                    />
                                                : null
                                            }
                                        </Grid>

                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.textCenter}>
                                                <Link
                                                    href={{ 
                                                        pathname: '/scoreCard',
                                                        query: { id, section }
                                                    }}
                                                >
                                                    <Button
                                                        className={styles.scoreCardBtn}
                                                    >
                                                        Score Card
                                                    </Button>
                                                </Link>
                                            </Grid>
                                        </Grid>

                                        <Grid container>
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.textCenter}>
                                                <Link
                                                    href={{ 
                                                        pathname: `/${section}`,
                                                    }}
                                                >
                                                    <Button
                                                        className={styles.backToHomeBtn}
                                                    >
                                                        Back to Home
                                                    </Button>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid> */}

                                    <Grid item xl={3} lg={5} md={6} sm={7} xs={12}>
                                        <Grid container className={styles.leftSideContainer}>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.fixedCalcAndSectionContainer}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                <span className={styles.testTitle}>Full Length | {data?.name?.en?.length ? data?.name?.en : ""}</span>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.countDownTimerGrid}>
                                                                <Image src={TestModeTimer} className={styles.calcIcon} height={15} width={15} alt="screenModeIcon"/>
                                                                <span className={styles.timerText}>Time left:</span>
                                                                <span className={styles.timeValue}>{formatTime(testResData?.remainingTime)}</span>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.calcScreenAndViewInContainer}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4} className={styles.alignAndJustifyCenter}>
                                                                                <Image
                                                                                    src={Calc}
                                                                                    className={styles.actionIcon}
                                                                                    alt="calcIcon"
                                                                                    onClick={() => setShowCalculator(!showCalculator)}
                                                                                />                   
                                                                            </Grid>
                                                                            
                                                                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4} className={styles.alignAndJustifyCenter}>
                                                                                <Grid container>
                                                                                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.verticleAlignCenter}>
                                                                                        <Image src={ScreenMode} className={styles.actionIcon} alt="screenModeIcon"/>
                                                                                    </Grid>
                                                                                    {/* <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.verticleAlignCenter}>
                                                                                        <Image
                                                                                            src={ExclamationIcon}
                                                                                            className={styles.actionIcon}
                                                                                            alt="exclamationIcon"
                                                                                            onClick={() => setShowInstruction(true)}
                                                                                        />
                                                                                        {
                                                                                            showInstruction ?
                                                                                                <Instruction
                                                                                                    open={showInstruction}
                                                                                                    handleClose={handleInstructionModalClose}
                                                                                                    instruction={data.instructions?.en}
                                                                                                />
                                                                                            : null
                                                                                        }
                                                                                    </Grid> */}
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item xl={4} lg={4} md={4} sm={4} xs={4} className={styles.textAlignCenter}>
                                                                                <Link
                                                                                    href={{ 
                                                                                        pathname: `/${section}`,
                                                                                    }}
                                                                                >
                                                                                    <Button
                                                                                        className={styles.backToHomeBtn}
                                                                                    >
                                                                                        <ArrowBackIcon
                                                                                            className={styles.backIcon}
                                                                                        />
                                                                                        Back
                                                                                    </Button>
                                                                                </Link>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid container className={showCalculator ? styles.showCalc : styles.hideCalc}>
                                                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                <Draggable
                                                                                    allowAnyClick={true}
                                                                                    axis="both"
                                                                                    handle=".handle"
                                                                                    defaultPosition={{x: 0, y: 0}}
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
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid container className={styles.fixedCalcAndSectionInnerContainer}>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Grid container>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.insightContainer}>
                                                                <Grid container className={styles.answerStatusContainer}>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <div className={styles.answeredTotal}>
                                                                                    {userActionData.filter((action) => action.status === "answered").length}
                                                                                </div>
                                                                                <span>Answered</span>
                                                                            </Grid>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <div className={styles.markedTotal}>
                                                                                    {userActionData.filter((action) => action.status === "marked").length}
                                                                                </div>
                                                                                <span>Marked</span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid container className={styles.answerStatusContainer}>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <div className={styles.notVisitedTotal}>
                                                                                    {userActionData.filter((action) => action.status === "notVisited").length}
                                                                                </div>
                                                                                <span>Not visited</span>
                                                                            </Grid>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                <div className={styles.notAnsweredTotal}>
                                                                                    {userActionData.filter((action) => action.status === "notAnswered").length}
                                                                                </div>
                                                                                <span>Not answered</span>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                
                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <div className={styles.markedAndAnsweredTotal}>
                                                                            {userActionData.filter((action) => action.status === "markedAndAnswered").length}
                                                                        </div>
                                                                        <span>Marked and answered</span>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        <Grid container className={`${styles.sectionsMainContainer} ${scrollBarStyles.myCustomScrollbar}`}>
                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                <Accordion
                                                                    key={data?.sections && data?.sections[activeSection]?._id}
                                                                    expanded={expanded === `panel${activeSection}`}
                                                                    className={styles.accordionMain}
                                                                >
                                                                    <AccordionSummary
                                                                        aria-controls={`panel${activeSection}d-content`}
                                                                        id={`panel${activeSection}d-header`}
                                                                        className={styles.activeAccordionSummary}
                                                                    >
                                                                        <Typography
                                                                            className={styles.activeAccordionTitle}
                                                                        >
                                                                            {data?.sections && data?.sections[activeSection]?.name}
                                                                        </Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <Grid container>
                                                                            {
                                                                                data?.sections && data?.sections[activeSection]?.questions?.map((question,questionId) => (
                                                                                    <>
                                                                                        {(questionId % 6 === 0) && (
                                                                                            <Grid container className={styles.questionIndexContainer} key={questionId}>
                                                                                                {/* Add Grid container for every 5th index */}
                                                                                            </Grid>
                                                                                        )}
                                                                                        <Grid item xl={2} lg={2} sm={2} md={2} xs={2}>
                                                                                            <div
                                                                                                className={`${userActionData.find(item => item.questionId === question._id)?.status !== "" ?
                                                                                                    userActionData.find(item => item.questionId === question._id)?.status === "answered" ?
                                                                                                        styles.answeredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.questionId === question._id)?.status === "marked" ?
                                                                                                        styles.markedIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.questionId === question._id)?.status === "markedAndAnswered" ?
                                                                                                        styles.markedAndAnsweredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.questionId === question._id)?.status === "notAnswered" ?
                                                                                                        styles.notAnsweredIndexBtn
                                                                                                    :
                                                                                                    userActionData.find(item => item.questionId === question._id)?.status === "notVisited" &&
                                                                                                        styles.notVisitedIndexBtn
                                                                                                    : styles.indexBtn}
                                                                                                    ${styles.indexBtnContainer}`
                                                                                                }
                                                                                                onClick={() => handleQuestionIndexClick(activeSection,questionId,question._id)}
                                                                                            >
                                                                                                <span
                                                                                                    key={question._id}
                                                                                                >
                                                                                                    {questionId + 1}
                                                                                                </span>
                                                                                            </div>
                                                                                        </Grid>
                                                                                    </>
                                                                                ))
                                                                            }
                                                                        </Grid>
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>             
                                                
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Button
                                                            className={styles.questionPaperBtn}
                                                            onClick={() => setShowQuestionPaper(true)}
                                                        >
                                                            Question Paper
                                                        </Button>
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.textCenter}>
                                                        <Link
                                                            href={{ 
                                                                pathname: '/scoreCard',
                                                                query: { id, section }
                                                            }}
                                                        >
                                                            <Button
                                                                className={styles.scoreCardBtn}
                                                            >
                                                                Score Card
                                                            </Button>
                                                        </Link>
                                                    </Grid>
                                                    
                                                    {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.submitPaperBtnContainer}>
                                                        <Button
                                                            className={`${styles.submitPaperBtn} ${"handle"}`}
                                                            onClick={() => handlePaperSubmit()}
                                                            disabled={submitTestLoader}
                                                        >
                                                            {submitTestLoader ?
                                                                <CircularProgress
                                                                    sx={{ color: 'var(--white)' }}
                                                                    size={25}
                                                                /> : 'Submit Test'
                                                            }
                                                        </Button>                                                
                                                    </Grid> */}
                                                    {
                                                        showQuestionPaper ?
                                                            <QuestionPaper
                                                                open={showQuestionPaper}
                                                                handleClose={handleModalClose}
                                                                data={data.sections}
                                                            />
                                                        : null
                                                    }
                                                    
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* Calc and Paper Section : END */}
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </section>
        </>
    )
}

export default ResponseSheet;

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