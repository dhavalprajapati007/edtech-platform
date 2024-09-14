import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AnswerInput from '../../components/AnswerInput';
import Choices from '../../components/Choices';
import Instruction from '../../components/Modal/Instruction';
import QuestionPaper from '../../components/Modal/QuestionPaper';
import Question from '../../components/Question';
import styles from "../../styles/TestMode.module.css";
import { handleLogout } from '../../utils/logout';
import Calc from "../../public/assets/images/TestModeCalc.png";
import ScreenMode from "../../public/assets/images/ScreenMode.png"
import ExclamationIcon from "../../public/assets/images/circleAlertIcon.png"
import TestModeTimer from "../../public/assets/images/TestModeTimer.png"
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Draggable from 'react-draggable';
import ScientificCalculator from '../../components/ScientificCalculator';
import CountdownTimer from '../../components/Timer';
import CustomText from '../../components/Modal/CustomText';
import SubmiTestConfirmation from '../../components/Modal/SubmiTestConfirmation';
import Loader from '../../components/Loader';
import scrollBarStyles from "../../styles/Scrollbar.module.css";
import { toastAlert } from '../../helpers/toastAlert';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Report from '../../components/Modal/Report';
import { handleContextMenu, handleKeyDown } from '../../helpers/helper';
import { requestAPI } from '../../helpers/apiHelper';

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

const TestMode = ({ session }) => {
    const [showInstruction, setShowInstruction] = useState(false);
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
    const [showCustomTextModal, setShowCustomTextModal] = useState(false);
    const [showSubmitTestConfirmationModal, setShowSubmitTestConfirmationModal] = useState(false);
    const [submitTestLoader, setSubmitTestLoader] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setLoading(true);
        fetchTestSeriesPaper();
        fetchBookmark();

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

    const fetchTestSeriesPaper = async () => {
        try {
            localStorage.removeItem("userActionData");
            localStorage.removeItem("remainingTime");
            let body = {
                id
            };

            let URL = '/api/testSeries/get-single-test-series';

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setData(Object.keys(data?.data).length ? data?.data : []);
                const allQuestions = data?.data?.sections?.flatMap(section => section.questions);
                setQuestionsList(allQuestions);
                setCurrentQuestion(allQuestions[0]);
                setActiveSection(0);
                setCurrentIndex(0);
                const initialUserActionData = await allQuestions?.map((question,i) => ({
                    id: question._id,
                    answer: "",
                    result: "",
                    actualMarks: parseFloat(question.markingRule?.positive),
                    obtainedMarks: 0, 
                    status: i === 0 ? "notAnswered" : "notVisited"
                }));
                setUserActionData(initialUserActionData);
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message,"errorInFullPaperLoad");
                toastAlert(data.message,"error");
            }
        } catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    };

    useEffect(() => {
        if(remainingTime === 0) {
            setShowCustomTextModal(true);
            handleSectionTackle();
        };
    }, [remainingTime]);

    const handleModalClose = () => {
        setShowQuestionPaper(false);
    }

    const handleConfirmationModalClose = () => {
        setShowSubmitTestConfirmationModal(false);
    }

    const handleTimeUpModalClose = () => {
        setShowCustomTextModal(false);
    }

    const handleInstructionModalClose = () => {
        setShowInstruction(false);
    }

    const handleMCQAnswerSelect = async(event,id) => {
        const newUserActionData = [...userActionData];
        let question = await questionsList.find((ques) => ques._id === id);
        let choiceAns = await question?.choices?.find((choice) => choice?._id === event.target.value);
        let specificData = await newUserActionData?.find((act) => act.id === id);
        specificData.answer = choiceAns?._id;
        specificData.result = choiceAns?.answer;
        specificData.obtainedMarks = choiceAns?.answer ? parseFloat(question?.markingRule?.positive) : parseFloat(question?.markingRule?.negative);
        setUserActionData(newUserActionData);
    };

    const handleMSQAnswerSelect = async(choice,id) => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.id === id);
        if(!specificData?.answer?.length) {
            let arr = [];
            arr.push(choice?._id);
            specificData.answer = arr
        } else {
            if(specificData.answer.some(answer => answer === choice._id)) {
                specificData.answer = specificData.answer.filter((ansId => ansId !== choice._id))
            }else {
                specificData.answer.push(choice?._id);
            }
        }

        if(specificData.answer?.length) {
            let { result, marks } = await checkMSQAnswer(currentQuestion.choices,specificData.answer);
            specificData.result = result;
            specificData.obtainedMarks = marks;
        }else {
            specificData.result = "";
            specificData.obtainedMarks = 0;
        }
        setUserActionData(newUserActionData);
    }

    const checkMSQAnswer = async(choices, selectedOptions) => {
        const correctAnswerIds = new Set(choices.filter(choice => choice.answer).map(choice => choice._id));
        const selectedIds = new Set(selectedOptions.map(option => option._id));
        if(selectedOptions.some((option) => option.answer === false)) {
            return { result : false, marks : Number(currentQuestion.markingRule.negative) };
        }else {
            const isCorrect = correctAnswerIds.size === selectedIds.size && [...correctAnswerIds].every(id => selectedIds.has(id));
            if(isCorrect) {
                return { result : isCorrect, marks : Number(currentQuestion.markingRule.positive)};
            }else {
                return { result : isCorrect, marks : 0};
            }
        }
    }

    const handleAnswerValue = async(value,id) => {
        setUserActionData(prevState => {
            const newState = [...prevState];
            const arrIndex = newState.findIndex(obj => obj.id === id);
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
        let specificData = await newUserActionData?.find((act) => act.id === id);
        if(specificData.status === "notVisited") {
            specificData.status = "notAnswered";
        }
        setUserActionData(newUserActionData);
    }

    const clearResponse = async() => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.id === currentQuestion._id);
        specificData.answer = "";
        specificData.result = "";
        specificData.obtainedMarks = 0;
        setUserActionData(newUserActionData);
    }

    const handleNavigate = async() => {
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

    const saveAndNext = async() => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.id === currentQuestion._id);

        if(specificData.answer === "") {
            specificData.status = "notAnswered"
        }else {
            specificData.status = "answered"
        };
        await handleNavigate();
        currentQuestion.mode === "answer" && await checkAnswer();
        setUserActionData(newUserActionData);
    }

    const markForReview = async() => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.id === currentQuestion._id);
        if(specificData.status === 'marked' || specificData.status === 'markedAndAnswered') {
            if(specificData.answer === "") {
                specificData.status = "notAnswered"
            }else {
                specificData.status = "answered"
            };
        }else {
            if(specificData.answer === "") {
                specificData.status = "marked"
            }else {
                specificData.status = "markedAndAnswered"
            };
        }
        await handleNavigate();
        currentQuestion.mode === "answer" && await checkAnswer();
        setUserActionData(newUserActionData);
    }

    const handleTimeChange = (value) => {
        setRemainingTime(value);
    };

    const checkAnswer = () => {
        let newUserActionData = [...userActionData];
        const specificData = newUserActionData.find(obj => obj.id === currentQuestion._id);
        let answer = currentQuestion?.answer?.en;
        let value = Number(specificData.answer);
        const t = answer.indexOf(",");
        if (t != -1) {
            //two range answer
            //Divide it into 2 parts 
            let splitAns = answer.split(",");
            const answer1 = splitAns[0].split("to");
            //answer1 is first range
            const answer2 = splitAns[1].split("to");
            // answer2 is second range
            if((Number(answer1[0]) <= value && value <= Number(answer1[1])) ||  (Number(answer2[0]) <= value && value <= Number(answer2[1]))) {
                specificData.result = true;
                specificData.obtainedMarks = Number(currentQuestion.markingRule.positive);
                setUserActionData(newUserActionData);
            } else {
                specificData.result = false;
                specificData.obtainedMarks = Number(currentQuestion.markingRule.negative);
                setUserActionData(newUserActionData);
            }
        } else {
            // One Range
            const check = answer.indexOf("to");
            if(check!=-1) {
                let myna = answer.split("to");
                if(Number(myna[0]) <= value && value <= Number(myna[1])){
                    specificData.result = true;
                    specificData.obtainedMarks = Number(currentQuestion.markingRule.positive);
                    setUserActionData(newUserActionData);
                } else {
                    specificData.result = false;
                    specificData.obtainedMarks = Number(currentQuestion.markingRule.negative);
                    setUserActionData(newUserActionData);
                }
            } else {
                //only one answer
                if(Number(answer) == value){
                    specificData.result = true;
                    setUserActionData(newUserActionData);
                }else{
                    specificData.result = false;
                    setUserActionData(newUserActionData);
                }
            }
        }
    }

    const handlePaperSubmit = () => {
        setShowSubmitTestConfirmationModal(true);
    }

    const handleCalcClose = () => {
        setShowCalculator(false);
    }

    const submitPaper = async (result) => {
        setSubmitTestLoader(true);
        // call API to store results in database
        try {
            let unattempted = result?.filter((action) => action?.status === "marked" ||  action?.status === "notVisited" || action?.status === "notAnswered" || action?.status === "").length;
            let answered = result?.filter((action) => action?.status === "answered" || action?.status === "markedAndAnswered");
            let correctAns = answered?.filter((action) => action?.result === true).length;
            let wrongAns = answered?.filter((action) => action?.result === false).length;
            const positiveMarks = answered.reduce((acc, val) => val.result ? acc + val.obtainedMarks : acc, 0);
            const negativeMarks = answered.reduce((acc, val) => !val.result ? acc + val.obtainedMarks : acc, 0);
            const finalMarks = positiveMarks - negativeMarks;

            let URL = "/api/result/store-test-response";

            // Create a function to filter the results based on question ID
            function filterResultsByQuestionId(questionId) {
                return result.filter((result) => result.id === questionId);
            }
  
            // Create a function to retrieve the section based on question ID
            function getSectionByQuestionId(questionId) {
                for (const section of data.sections) {
                    const question = section.questions.find((q) => q._id === questionId);
                    if(question) {
                        return section;
                    }
                }
                return null; // Return null if no section is found
            }
        
            // Create a function to transform the filtered results into the desired format
            function transformResults(questionId) {
                const filteredResults = filterResultsByQuestionId(questionId);
                const section = getSectionByQuestionId(questionId);
                const transformedData = transformedResults.find((data) => data.sectionId === section._id);
            
                if(transformedData) {
                    // If the section already exists in transformedResults, add the question to its "questions" array
                    transformedData.questions.push(
                        ...filteredResults.map(({ id, actualMarks, ...rest }) => ({
                            questionId: id,
                            ...rest,
                        }))
                    );
                }else {
                    // If the section does not exist, create a new section object and add it to transformedResults
                    const newSection = {
                        sectionId: section._id,
                        title: section.name,
                        questions: filteredResults.map(({ id, actualMarks, ...rest }) => ({
                            questionId: id,
                            ...rest,
                        })),
                    };
                    transformedResults.push(newSection);
                }
            }
            
            // Create an array to store the final transformed data
            const transformedResults = [];
            
            // Iterate over the questions in each section and transform the results
            data?.sections.forEach((section) => {
                section.questions.forEach((question) => {
                    transformResults(question?._id);
                });
            });
            
            // Print the transformed results
            console.log(transformedResults, "transformedResults");

            let body = {
                referenceId: data._id,
                exam: data.exam,
                department: data?.department,
                title: data?.name?.en,
                mode: "TestSeries",
                totalQuestions: result?.length,
                duration: data?.time,
                remainingTime: remainingTime,
                sections: transformedResults,
                unattempted,
                correctAns,
                wrongAns,
                positiveMarks,
                negativeMarks,
                finalMarks,
                totalMarks: data.marks
            };

            console.log(body,"payloadForSubmitTest");

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let responseData = await requestAPI(URL,reqObj);

            if(responseData && responseData?.statusCode == 200) {
                setSubmitTestLoader(false);
                
                toastAlert(responseData.message,"success");
                router.push({
                    pathname: '/scoreCard',
                    query: { id, section : "testSeries" }
                })
            } else {
                if(responseData.statusCode == 401) {
                    handleLogout(router);
                }
                setSubmitTestLoader(false);
                toastAlert(responseData.message,"error");
                console.log(responseData.message,"error");
            }
        } catch(e) {
            setSubmitTestLoader(false);
            console.log(e,"error");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    }

    const handleSectionTackle = async() => {
        let finalArr = [];
        data?.sections?.map((section) => {
            let firstIndex = userActionData.findIndex((ques) => ques.id === section.questions[0]._id);
            let lastIndex = userActionData.findIndex((ques) => ques.id === section.questions[section.questions.length-1]._id);

            let slicedArr = userActionData.slice(firstIndex,lastIndex+1);
            if(section.tackle > 0) {
                let filteredArr = slicedArr?.filter((action) => action?.status === "answered" || action?.status === "markedAndAnswered");
                let tackledArr = filteredArr.slice(0,section.tackle);
                finalArr.push(tackledArr);
            } else {
                finalArr.push(slicedArr);
            }
        })

        if(data?.sections.some((section) => section.tackle > 0)) {
            submitPaper(finalArr.flat());
        }else {
            submitPaper(userActionData);
        }
    };

    const manageBookmark = async(ques) => {
        try {
            setBookmarkLoading(true);

            let URL = '/api/bookmarks/bookmark-question';
            console.log(URL);

            let body = {
                question_id: ques?._id,
                type: 'TestSeries',
                test_series_id: router.query.id,
                subjectId: ques?.subject
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

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const handleTabClick = async(sectionIndex) => {
        const newUserActionData = [...userActionData];
        let specificData = await newUserActionData?.find((act) => act.id === currentQuestion._id);
        if(specificData.status === "notVisited") {
            specificData.status = "notAnswered";
        }
        setUserActionData(newUserActionData);

        setActiveSection(sectionIndex);
        setExpanded(`panel${sectionIndex}`);
        setCurrentIndex(0);
        setCurrentQuestion(data?.sections[sectionIndex]?.questions[0]);
    }

    return (
        <>
            <Head>
                <title>Set2Score-TestMode</title>
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
                                                                        bookmarked={bookmarkedQuestions?.length > 0 && bookmarkedQuestions?.some((bookmarkedQues) => bookmarkedQues?.question_id === currentQuestion._id)}
                                                                        mode="testSeries"
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <Choices
                                                                        question={currentQuestion}
                                                                        userActionData={userActionData}
                                                                        index={currentIndex}
                                                                        handleMCQAnswerSelect={handleMCQAnswerSelect}
                                                                        handleMSQAnswerSelect={handleMSQAnswerSelect}
                                                                        mode={"test"}
                                                                    />
                                                                </Grid>

                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <AnswerInput
                                                                        question={currentQuestion}
                                                                        userActionData={userActionData}
                                                                        handleAnswerValue={handleAnswerValue}
                                                                        mode={"test"}
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            <Grid container>
                                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                                    <Button
                                                                                                        className={`${userActionData?.find((act) => act.id === currentQuestion._id)?.status === 'marked' || userActionData?.find((act) => act.id === currentQuestion._id)?.status === 'markedAndAnswered' ? styles.markedReviewButton : styles.markForReviewBtn}`}
                                                                                                        onClick={() => markForReview()}
                                                                                                    >
                                                                                                        Mark for review
                                                                                                    </Button>
                                                                                                </Grid>
                                                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                                                                                                    <Button
                                                                                                        className={styles.clearResBtn}
                                                                                                        onClick={() => clearResponse()}
                                                                                                    >
                                                                                                        Clear Response
                                                                                                    </Button>        
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>    
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.saveAndNextBtnContainer}>
                                                                                                    <Button
                                                                                                        className={styles.saveAndNextBtn}
                                                                                                        onClick={() => saveAndNext()}
                                                                                                    >
                                                                                                        Save & Next
                                                                                                    </Button>
                                                                                                </Grid>
                                                                                                {/* <Grid item xl={4} lg={4} sm={4} md={4} xs={4} className={styles.reportIconGrid}>
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
                                                                                                </Grid> */}
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            {/* <Grid container>
                                                                <Grid item xl={2} lg={4} sm={4} md={4} xs={6}>
                                                                    <Button
                                                                        className={styles.bookmarkBtn}
                                                                        onClick={() => manageBookmark(currentQuestion._id)}
                                                                    >
                                                                        {
                                                                            bookmarkLoading ?
                                                                                <CircularProgress
                                                                                    sx={{ color: 'var(--white)' }}
                                                                                    size={20}
                                                                                />
                                                                            :
                                                                                bookmarkedQuestions?.length && bookmarkedQuestions.includes(currentQuestion._id) ?
                                                                                    <BookmarkIcon/>
                                                                                :
                                                                                    <BookmarkBorderIcon/>
                                                                        }
                                                                    </Button>
                                                                </Grid> 
                                                            </Grid> */}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* Calc and Paper Section : START */}
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
                                                                    <CountdownTimer
                                                                        countdownTime={data.time}
                                                                        handleTimeChange={handleTimeChange}
                                                                    />
                                                                    {
                                                                        showCustomTextModal ?
                                                                            <CustomText
                                                                                open={showCustomTextModal}
                                                                                handleClose={handleTimeUpModalClose}
                                                                                text={'Time\'s Up!!'}
                                                                            />
                                                                        : null
                                                                    }
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
                                                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.verticleAlignCenter}>
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
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xl={4} lg={4} md={4} sm={4} xs={4} className={styles.textAlignCenter}>
                                                                                    <span className={styles.viewInText}>View in</span>
                                                                                    <span className={styles.langText}>English</span>
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
                                                                    // onChange={handleAccordionChange(`panel${activeSection}`,activeSection)}
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
                                                        
                                                        {/* <Grid container className={`${styles.sectionsMainContainer} ${scrollBarStyles.myCustomScrollbar}`}>
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
                                                                                                {(questionId % 6 === 0) && (
                                                                                                    <Grid container className={styles.questionIndexContainer} key={questionId}>
                                                                                                    </Grid>
                                                                                                )}
                                                                                                <Grid item xl={2} lg={2} sm={2} md={2} xs={2}>
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
                                                        </Grid> */}
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
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.submitPaperBtnContainer}>
                                                            <Button
                                                                className={`${styles.submitPaperBtn} ${"handle"}`}
                                                                onClick={() => handlePaperSubmit()}
                                                                disabled={submitTestLoader}
                                                            >
                                                                {submitTestLoader ?
                                                                    <CircularProgress
                                                                        sx={{ color: 'var(--white)' }}
                                                                        size={25}
                                                                    /> : 'Submit Paper'
                                                                }
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
                                                        {
                                                            showSubmitTestConfirmationModal ?
                                                                <SubmiTestConfirmation
                                                                    open={showSubmitTestConfirmationModal}
                                                                    handleClose={handleConfirmationModalClose}
                                                                    remainingTime={remainingTime}
                                                                    handleSubmit={handleSectionTackle}
                                                                />
                                                            :
                                                                null
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Calc and Paper Section : END */}
                                    </Grid>
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </section>
        </>
    )
}

export default TestMode;

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