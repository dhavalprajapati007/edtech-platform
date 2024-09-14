import { Autocomplete, Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import NavigationMenu from '../../components/NavigationMenu.js';
import styles from "../../styles/PastPaper.module.css";
import { useRouter } from 'next/router';
import GetTheApp from '../../components/GetTheApp.js';
import Footer from '../../components/Footer.js';
import Calc from "../../public/assets/images/Calc.png"
import Image from 'next/image';
import watermarkLogo from '../../public/assets/images/Set2ScoreLogo.png'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import Question from '../../components/Question.js';
import Solution from '../../components/Solution.js';
import Choices from '../../components/Choices.js';
import AnswerInput from '../../components/AnswerInput.js';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { handleLogout } from '../../utils/logout.js';
import Draggable from 'react-draggable';
import ScientificCalculator from '../../components/ScientificCalculator.js';
import { handleContextMenu, handleKeyDown, transform } from '../../helpers/helper.js';
import QuestionPaper from '../../components/Modal/QuestionPaper.js';
import Loader from '../../components/Loader.js';
import scrollBarStyles from "../../styles/Scrollbar.module.css";
import { toastAlert } from '../../helpers/toastAlert.js';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Report from '../../components/Modal/Report.js';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { requestAPI } from '../../helpers/apiHelper.js';

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

// const PastPaper = ({ session, data, error }) => {
const PastPaper = ({ session }) => {
    const [expanded, setExpanded] = React.useState('panel0');
    const [activeSection, setActiveSection] = useState(0);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [userActionData, setUserActionData] = useState([]);
    const router = useRouter();
    const { id, mode } = router.query;
    const [modeType, setModeType] = useState("full");
    const [questionsList, setQuestionsList] = useState([]);
    const [subjectDetails, setSubjectDetails] = useState({});
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentYear, setCurrentYear] = useState();
    const [yearRange, setYearRange] = useState([]);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showStartTestBtn, setShowStartTestBtn] = useState(false);
    const [showQuestionPaper, setShowQuestionPaper] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const questionsPerPage = 5;

    useEffect(() => {
        setLoading(true);
        
        let promises = [];

        promises.push(fetchPaper());
        promises.push(fetchBookmark());

        if(mode === "subject") {
            promises.push(getSubjectDetails());
        }

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
    }, [])

    const fetchPaper = async () => {
        try {
            let questionId = await sessionStorage.getItem('questionId');
            let sectionId = await sessionStorage.getItem('sectionId');
            let yearId = await sessionStorage.getItem('yearId');
            sessionStorage.clear();
            let body = {
                id
            };

            if (mode === "full") {
                let URL = '/api/previousPapers/get-single-paper';
            
                let reqObj = {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: { 'Authorization': session?.studentData?.accessToken }
                };

                let data = await requestAPI(URL,reqObj);

                if (data && data?.statusCode == 200) {
                    setData(Object.keys(data?.data).length ? data?.data : []);
                    setQuestionsList(data?.data?.sections[activeSection]?.questions?.length ? data?.data?.sections[activeSection]?.questions : []);
                    const allQuestions = data?.data?.sections?.flatMap(section => section.questions);
                    const initialUserActionData = await allQuestions?.map((question) => ({
                        id: question._id,
                        isVisible: false,
                        answer: "",
                        result: ""
                    }));
                    setUserActionData(initialUserActionData);
                    setLoading(false);
                    if(questionId && sectionId) {
                        handleQuestionIndexClick(sectionId,questionId,data.data);
                    }else {
                        // Logic to get the current set of questions based on the currentPage
                        const indexOfLastQuestion = currentPage * questionsPerPage;
                        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
                        setCurrentQuestions(data?.data?.sections[activeSection]?.questions.slice(indexOfFirstQuestion, indexOfLastQuestion));    
                    }
                } else {
                    if (data.statusCode == 401) {
                        handleLogout(router);
                    }
                    toastAlert(data.message,"error");
                    setLoading(false);
                    console.log(data.message, "errorInFullPaperLoad");
                }
            } else if (mode === "subject") {

                // const response = await fetch(`/api/departments/get-single-department?id=${session?.studentData?.department}`, {
                //     method: "GET",
                //     headers: { Authorization: session?.studentData?.accessToken }
                // });

                // const data = await response.json();

                // if (data && data?.statusCode == 200) {
                //     console.log(data,"departmentData");

                //     const newArray = [];
                //     for (let i = parseInt(data?.data?.yearRange?.from); i <= parseInt(data?.data?.yearRange?.to); i++) {
                //         newArray.push(`${i}`);
                //     }
                //     setYearRange(newArray.reverse());
                //     setCurrentYear(year ? year : data?.data?.yearRange?.to);
                // } else {
                //     if (data.statusCode == 401) {
                //         handleLogout(router);
                //     }
                //     toastAlert(data.message,"error");
                //     console.log(data.message, "errorInDeptData");
                // }

                // let payload = {
                //     id,
                //     year: year ? parseInt(year) : parseInt(data?.data?.yearRange?.to)
                // }

                // const [questionsRes, subjectRes] = await Promise.all([
                //     fetch("/api/previousPapers/get-subject-wise-questions", {
                //         method: "POST",
                //         body: JSON.stringify(payload),
                //         headers: { Authorization: session?.studentData?.accessToken }
                //     }),
                //     fetch(`/api/subjects/get-subject?id=${id}`, {
                //         method: "GET",
                //         headers: { Authorization: session?.studentData?.accessToken }
                //     })
                // ]);

                // const questionsData = await questionsRes.json();
                // const subjectData = await subjectRes.json();

                // if(questionsData && questionsData.statusCode == 200 && subjectData && subjectData.statusCode == 200) {
                //     console.log(questionsData, "examData");
                //     console.log(subjectData, "subjectDetailsData");
                //     setData(Object.keys(questionsData?.data).length ? questionsData?.data : []);
                //     const initialUserActionData = await questionsData?.data?.map((question) => ({
                //         id: question._id,
                //         isVisible: false,
                //         answer: "",
                //         result: "",
                //     }));
                //     setUserActionData(initialUserActionData);
                //     setSubjectDetails(subjectData.data);
                //     setQuestionsList(questionsData?.data?.length ? questionsData?.data : []);
                //     setLoading(false);

                //     if(questionId && year) {
                //         handleQuestionIndexClickForSubj(questionId,questionsData?.data);
                //     }else{
                //         // Logic to get the current set of questions based on the currentPage
                //         const indexOfLastQuestion = currentPage * questionsPerPage;
                //         const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
                //         setCurrentQuestions(questionsData?.data.slice(indexOfFirstQuestion, indexOfLastQuestion));
                //     }
                // } else {
                //     if(questionsData.statusCode == 401 || subjectData.statusCode == 401) {
                //         handleLogout(router);
                //     }
                //     setLoading(false);
                //     console.log(questionsData.message || subjectData.message, "error");
                //     toastAlert(questionsData.message || subjectData.message, "error");
                // }

                let payload = {
                    id
                };

                let URL = '/api/previousPapers/get-year-wise-subject-questions';
            
                let reqObj = {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { Authorization: session?.studentData?.accessToken }
                };

                let data = await requestAPI(URL,reqObj);

                if (data && data?.statusCode == 200) {
                    setData(data?.data?.length ? data?.data : []);
                    setQuestionsList(data?.data[activeSection]?.questions?.length ? data?.data[activeSection]?.questions : []);
                    const allQuestions = data?.data?.flatMap(yearWiseData => yearWiseData.questions);
                    const initialUserActionData = await allQuestions?.map((question) => ({
                        id: question._id,
                        isVisible: false,
                        answer: "",
                        result: ""
                    }));
                    setUserActionData(initialUserActionData);
                    setLoading(false);
                    if(questionId && yearId) {
                        handleQuestionIndexClickForSubj(yearId,questionId,data?.data);
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
            };
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e, "errorInCatchBlock");
        }
    };


    const getSubjectDetails = async () => {
        try {
            let URL = `/api/subjects/get-subject?id=${id}`;
            
            let reqObj = {
                method: "GET",
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setSubjectDetails(Object?.keys(data.data)?.length ? data?.data : {});
            } else {
                toastAlert(data.message,"error");
                console.log(data.message,"errorInFetchSubjectDetails");
            }
        } catch(e) {
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

    const handleAnswerValue = async (value, id) => {
        setUserActionData(prevState => {
            const newState = [...prevState];
            const arrIndex = newState.findIndex(obj => obj.id === id);
            newState[arrIndex] = { ...newState[arrIndex], answer: value, result: "" };
            return newState;
        });
    }

    const handleAccordionChange = (panel, idx) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        if(mode === "full") {
            setQuestionsList(data?.sections[idx]?.questions?.length ? data?.sections[idx]?.questions : []);
            setCurrentQuestions(data?.sections[idx]?.questions.slice(0, 5));         
        }else{
            setQuestionsList(data[idx]?.questions?.length ? data[idx]?.questions : []);
            setCurrentQuestions(data[idx]?.questions.slice(0, 5));
        }

        setActiveSection(idx);
        setCurrentPage(1);
        scrollToTop();
    };

    const toggleSolutionVisibility = (id) => {
        const newUserActionData = [...userActionData];
        const arrIndex = newUserActionData.findIndex(obj => obj.id === id);
        newUserActionData[arrIndex].isVisible = !newUserActionData[arrIndex]?.isVisible;
        setUserActionData(newUserActionData);
    };

    const handlePreviousClick = () => {
        if(activeSection === 0) {
            return
        }
        let first5Ques;
        if(mode === 'full') {
            setQuestionsList(data?.sections[activeSection - 1]?.questions?.length ? data?.sections[activeSection - 1]?.questions : []);
            first5Ques = data?.sections[activeSection - 1]?.questions.slice(0, 5);
        }else if(mode === 'subject') {
            setQuestionsList(data[activeSection - 1]?.questions?.length ? data[activeSection - 1]?.questions : []);
            first5Ques = data[activeSection - 1]?.questions.slice(0, 5);
        }
        setCurrentPage(1);
        setCurrentQuestions(first5Ques);
        setActiveSection(activeSection - 1);
        setExpanded(`panel${activeSection - 1}`);
        scrollToTop();
    }

    const handleNextClick = () => {
        let first5Ques;
        if(mode === 'full') {
            if(data?.sections?.length <= activeSection+1) {
                return
            }else {
                setQuestionsList(data?.sections[activeSection + 1]?.questions?.length ? data?.sections[activeSection + 1]?.questions : []);
                first5Ques = data?.sections[activeSection + 1]?.questions.slice(0, 5);
            }
        }else if(mode === 'subject') {
            if(data?.length <= activeSection+1) {
                return
            }
            setQuestionsList(data[activeSection + 1]?.questions?.length ? data[activeSection + 1]?.questions : []);
            first5Ques = data[activeSection + 1]?.questions.slice(0, 5);
        }
        setCurrentPage(1);
        setCurrentQuestions(first5Ques);
        setActiveSection(activeSection + 1);
        setExpanded(`panel${activeSection + 1}`);
        scrollToTop();
    }

    const handleQuestionIndexClick = (sectionId, questionId, data) => {
        let currentPage = parseInt(questionId / 5) + 1;
        setActiveSection(parseInt(sectionId));
        setExpanded(`panel${sectionId}`)
        setQuestionsList(data?.sections[sectionId]?.questions?.length ? data?.sections[sectionId]?.questions : []);
        setCurrentPage(currentPage);
        setCurrentQuestions(data?.sections[sectionId]?.questions.slice((currentPage * 5) - 5, currentPage * 5));
        setTimeout(() => {
            const element = document.getElementById(`question-${questionId % 5}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
    }

    const handleQuestionIndexClickForSubj = (yearSectionId,questionId,data) => {
        let currentPage = parseInt(questionId / 5) + 1;
        setActiveSection(parseInt(yearSectionId));
        setExpanded(`panel${yearSectionId}`)
        setQuestionsList(data[yearSectionId]?.questions?.length ? data[yearSectionId]?.questions : []);
        setCurrentPage(currentPage);
        setCurrentQuestions(data[yearSectionId]?.questions.slice((currentPage * 5) - 5, currentPage * 5));
        setTimeout(() => {
            const element = document.getElementById(`question-${questionId % 5}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);

    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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

    const setYearAndFetchQues = (val) => {
        if (val) {
            setCurrentYear(val);
            setLoading(true);
            fetchSubjectAndYearWiseQuestions(val);
        }
    }

    const fetchSubjectAndYearWiseQuestions = async (val) => {
        try {
            let body = {
                id,
                year: parseInt(val)
            };

            let URL = '/api/previousPapers/get-subject-wise-questions';
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(body),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if (data && data?.statusCode == 200) {
                setData(data?.data.length ? data?.data : []);
                const initialUserActionData = await data?.data?.map((question) => ({
                    id: question._id,
                    isVisible: false,
                    answer: "",
                    result: "",
                }));
                setUserActionData(initialUserActionData);
                setQuestionsList(data?.data?.length ? data?.data : []);
                setCurrentPage(1);
                setCurrentQuestions(data?.data.slice(0, questionsPerPage));
                setLoading(false);
            } else {
                if (data.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                console.log(data.message, "error");
                toastAlert(data.message, "error");
            }
        } catch (e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e, "error");
        }
    }

    const manageBookmark = async(que) => {
        try {
            setBookmarkLoading(true);

            let URL = `/api/bookmarks/bookmark-question`;

            let body = {
                question_id: que?._id,
                type: 'PreviousPaper',
                previous_paper_id: router.query.id,
                subjectId: que?.subject
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

    const handleModeChange = (val) => {
        setModeType(val);
        val === "test" ? setShowStartTestBtn(true) : setShowStartTestBtn(false);
    }

    const handleModalClose = () => {
        setShowQuestionPaper(false);
    }

    const handleCalcClose = () => {
        setShowCalculator(false);
    }

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const redirectToDiscussion = async(questionId) => {
        if(mode === "full") {
            let queIdx = await data?.sections[activeSection]?.questions?.findIndex((ques) => ques._id === questionId);
            await sessionStorage.setItem('questionId',queIdx);
            await sessionStorage.setItem('sectionId',activeSection);
        }else {
            let queIdx = await data[activeSection]?.questions?.findIndex((ques) => ques._id === questionId);
            await sessionStorage.setItem('questionId',queIdx);
            await sessionStorage.setItem('yearId',activeSection);
        }

        router.push({
            pathname: '/discussion',
            query: { id: questionId, refId: id, mode }
        })
    }

    return (
        <>
            <Head>
                <title>Set2Score-PastPaper</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                <Grid container className={styles.homePageContainer}>
                    {
                        loading ?
                            <Grid container className={styles.mainContainer}>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Loader />
                                </Grid>
                            </Grid>
                            :
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.mainContainer}>
                                    <NavigationMenu />
                                </Grid>

                                <Grid container className={styles.mainContainer}>
                                    {/* Navigation Text */}
                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.navSection}>
                                        {
                                            mode === "full" ?
                                                <span className={styles.navText}>
                                                    <Link href='/pastPapers'>
                                                        <span className={styles.fullModeText}>
                                                            Past Papers &gt; &gt; &nbsp;
                                                        </span>
                                                    </Link>
                                                    {data?.name?.en} &gt; &gt; &nbsp;
                                                    Full Mode &gt; &gt; &nbsp;
                                                    {data?.sections[activeSection]?.name}
                                                </span>
                                                :
                                                <span className={styles.navText}>
                                                    <Link href='/pastPapers'>
                                                        <span className={styles.fullModeText}>
                                                            Past Papers &gt; &gt; &nbsp;
                                                        </span>
                                                    </Link>
                                                    Subject Wise &gt; &gt; {subjectDetails.title} &gt; &gt; Full Mode
                                                </span>
                                        }
                                        {/* <Link href="/pastPapers">
                                            <Button
                                                className={styles.navActionBtn}
                                            >
                                                <ArrowBackIcon />
                                                Back
                                            </Button>
                                        </Link> */}
                                    </Grid>

                                    <Grid container className={styles.paperContainer}>
                                        {/* Paper Questions */}
                                        <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.questionMainGrid}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.fullModeQuestionsAndNavSections} ${scrollBarStyles.myCustomScrollbar}`}>
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
                                                                                                bookmarked={bookmarkedQuestions?.length > 0 && bookmarkedQuestions?.some((bookmarkedQues) => bookmarkedQues?.question_id === question._id)}
                                                                                                mode="full"
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
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.solutionAndDiscussionContainer}>
                                                                                                    <Grid container>
                                                                                                        <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                            <Button className={styles.showHideSolBtn} onClick={() => toggleSolutionVisibility(question._id)}>
                                                                                                                {userActionData.find(item => item.id === question._id)?.isVisible ? "Hide Solution" : "Show Solution"}
                                                                                                            </Button>
                                                                                                        </Grid>
                                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                                                            <Grid container>
                                                                                                                <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                                    <Button
                                                                                                                        onClick={() => redirectToDiscussion(question._id)}    
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
                                                                                        userActionData.find(item => item.id === question._id)?.isVisible ?
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
                                                                                <Grid className={styles.waterMarkIcon}>
                                                                                    <Image
                                                                                        src={watermarkLogo}
                                                                                        className={styles.watermarkImage}
                                                                                        alt="appLogoWatermark"
                                                                                        />
                                                                                    <span className={styles.watermarkId}>
                                                                                        {session?.studentData?._id}
                                                                                    </span>
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

                                        {/* Calc and Paper Section : START */}
                                        <Grid item xl={3} lg={3} sm={7} md={6} xs={12} className={styles.fixedCalcAndSectionContainer}>
                                            {/* {
                                                mode === "subject" &&
                                                <Grid container className={styles.yearDropdownForSubject}>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Autocomplete
                                                            className={styles.autocompleteField}
                                                            name="exam"
                                                            value={currentYear}
                                                            options={yearRange}
                                                            autoHighlight
                                                            onChange={(e, val) => setYearAndFetchQues(val)}
                                                            getOptionLabel={(option) => option ? option : ""}
                                                            renderOption={(props, option) => (
                                                                <Box
                                                                    component="li"
                                                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                                    {...props}
                                                                >
                                                                    {option}
                                                                </Box>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    className="department-dropdown"
                                                                    {...params}
                                                                    label="Year"
                                                                    placeholder="Select Year"
                                                                    inputProps={{
                                                                        ...params.inputProps,
                                                                        autoComplete: "off",
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            } */}

                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.calcAndViewInSectionMain}>
                                                    <Grid container className={styles.calcAndViewInSectionContainer}>
                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.calcBtnSection}>
                                                            <Button
                                                                className={styles.calcBtn}
                                                                onClick={() => setShowCalculator(!showCalculator)}
                                                            >
                                                                Calculator
                                                                <Image src={Calc} className={styles.calcIcon} alt="calcIcon" />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.langSection}>
                                                            <span>View in</span>
                                                            <span className={styles.langText}>English</span>
                                                        </Grid>
                                                    </Grid>
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

                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionMainGrid}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.sectionMainContainer} ${scrollBarStyles.myCustomScrollbar}`}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionInnerContainer}>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.sectionContainer}>
                                                                            <span>{mode === 'subject' ? subjectDetails?.title : 'Sections' }</span>
                                                                        </Grid>

                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            {
                                                                                mode === "full" ?
                                                                                    data?.sections?.map((section, sectionId) => (
                                                                                        <Accordion
                                                                                            key={section._id}
                                                                                            expanded={expanded === `panel${sectionId}`}
                                                                                            onChange={handleAccordionChange(`panel${sectionId}`, sectionId)}
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
                                                                                                        section?.questions?.map((question, questionId) => (
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
                                                                                                                        onClick={() => handleQuestionIndexClick(sectionId, questionId, data)}
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
                                                                                    :
                                                                                    data?.map((yearWiseData, index) => (
                                                                                        <Accordion
                                                                                            key={index}
                                                                                            expanded={expanded === `panel${index}`}
                                                                                            onChange={handleAccordionChange(`panel${index}`,index)}
                                                                                            className={styles.accordionMain}
                                                                                        >
                                                                                            <AccordionSummary
                                                                                                aria-controls={`panel${index}d-content`}
                                                                                                id={`panel${index}d-header`}
                                                                                                className={styles.activeAccordionSummary}
                                                                                            >
                                                                                                <Typography
                                                                                                    className={styles.activeAccordionTitle}
                                                                                                >
                                                                                                    {yearWiseData.year}
                                                                                                </Typography>
                                                                                            </AccordionSummary>
                                                                                            <AccordionDetails>
                                                                                                <Grid container>
                                                                                                    {
                                                                                                        yearWiseData?.questions?.map((question, questionId) => (
                                                                                                            <>
                                                                                                                {(questionId % 6 === 0) && (
                                                                                                                    <Grid container className={styles.questionIndexContainer} key={questionId}>
                                                                                                                        {/* Add Grid container for every 7th index */}
                                                                                                                    </Grid>
                                                                                                                )}
                                                                                                                <Grid item xl={2} lg={2} sm={2} md={2} xs={2}>
                                                                                                                    <div
                                                                                                                        key={question._id}
                                                                                                                        className={styles.indexBtn}
                                                                                                                        onClick={() => handleQuestionIndexClickForSubj(index,questionId,data)}
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

                                            <Grid container className={styles.paddingLeftStyle}>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.modeContainer}>
                                                            <span>Mode</span>
                                                        </Grid>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <FormControl className={styles.formControl}>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                                    name="controlled-radio-buttons-group"
                                                                    value={modeType}
                                                                    onChange={(e) => handleModeChange(e.target.value)}
                                                                >
                                                                    <FormControlLabel
                                                                        value="full"
                                                                        control={<Radio className={`${styles.modeRadioBtn}`} />}
                                                                        label="Full Mode"
                                                                    />
                                                                    {
                                                                        mode === "full" ?
                                                                            <FormControlLabel
                                                                                value="test"
                                                                                className={styles.modeRadioBtn}
                                                                                control={<Radio className={`${styles.modeRadioBtn}`} />}
                                                                                label="Test Mode"
                                                                            />
                                                                            : null
                                                                    }
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {
                                                showStartTestBtn ?
                                                    <Grid container className={styles.paddingLeftStyle}>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <Link
                                                                        href={{
                                                                            pathname: '/instruction',
                                                                            query: { id, section: "pastPapers" }
                                                                        }}
                                                                    >
                                                                        <Button className={styles.startTestBtn}>
                                                                            Start Test
                                                                        </Button>
                                                                    </Link>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    : null
                                            }

                                            <Grid container className={styles.paddingLeftStyle}>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
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
                                                                data={mode === "full" ? data.sections : questionsList}
                                                                mode={mode}
                                                                title={mode !== "full" ? subjectDetails.title : ""}
                                                            />
                                                            : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Calc and Paper Section : END */}
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
            </section>
        </>
    )
}

export default PastPaper;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    if (!session) {
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