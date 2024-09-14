import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from "../styles/Discussion.module.css";
import { Avatar, Button, CircularProgress, FormControl, Grid, OutlinedInput } from '@mui/material';
import Head from 'next/head';
import Loader from '../components/Loader';
import NavigationMenu from '../components/NavigationMenu';
import { toastAlert } from '../helpers/toastAlert';
import { handleDrop, renderPreview } from '../helpers/uploadImageHelper';
import Dropzone from 'react-dropzone';
import Image from 'next/image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PostIcon from "../public/assets/images/PostIcon.png";
import LinkSection from '../components/LinkSection';
import SocialMediaIcons from '../components/SocialMediaIcons';
import Feed from '../components/Feed';
import { postDiscussionValidation } from '../validations/forum.validation';
import Question from '../components/Question';
import DiscussionChoices from '../components/DiscussionChoices';
import AnswerInput from '../components/AnswerInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Link from 'next/link';
import Solution from '../components/Solution';
import { handleContextMenu, handleKeyDown, transform } from '../helpers/helper';
import Report from '../components/Modal/Report';
import { requestAPI } from '../helpers/apiHelper';

const Discussion = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [discussion, setDiscussion] = useState([]);
    const [question, setQuestion] = useState({});
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");
    const [showSolution, setShowSolution] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [postDiscussionLoading, setPostDiscussionLoading] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const router = useRouter();
    const { id, refId, mode, target } = router.query;

    useEffect(() => {
        setLoading(true);
        fetchQuesWiseDiscussion();
        getSingleQuestion();
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
    },[id, refId]);

    const fetchQuesWiseDiscussion = async () => {
        try {
            let URL = `/api/discussion/get-question-wise-discussion?id=${id}`;

            let reqObj = {
                method: 'GET',
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);
            console.log(data,'discussionData');

            if(data && data?.statusCode == 200) {
                setDiscussion(data?.data?.length ? data?.data : []);
                setLoading(false);
            } else {
                if(data?.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"error");              
            }
        }catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const getSingleQuestion = async () => {
        try {
            let URL = `/api/questions/get-single-question?id=${id}`;
            
            let reqObj = {
                method: 'GET',
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);
            
            if(data && data?.statusCode == 200) {
                setQuestion(Object.keys(data.data)?.length ? data.data : {});
                setLoading(false);
            } else {
                if(data?.statusCode == 401) {
                    handleLogout(router);
                }
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"error");
            }
        }catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const postDiscussion = async (body) => {
        try {
            let URL = '/api/discussion/post-discussion';
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(body),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);
        
            if(data && data.statusCode == 200) {
                toastAlert(data.message,"success");
            }else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message, 'error');
                console.log(data.message, 'error');
            }
      
            return data;
        }catch (e) {
            console.error(e);
            toastAlert('Something Went Wrong, Please Try Again After Sometime', 'error');
            console.log(e, 'error');
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

    const uploadImages = async () => {
        try {
            const formData = new FormData();
            files.map((file) => formData.append('images', file));

            let URL = '/api/images/upload-image';
            
            let reqObj = {
                method: 'POST',
                body: formData,
                headers: { 'Authorization' : session?.studentData?.accessToken  }
            };

            let data = await requestAPI(URL,reqObj);
        
            if (data.statusCode == 200) {
                return data.data;
            }else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message, 'error');
                throw new Error('Failed to upload image');
            }
        } catch(err) {
            console.error(err);
            toastAlert('Error uploading image', 'error');
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmitDiscussion = async () => {
        setPostDiscussionLoading(true);

        let body = {
            text: content,
            files: [],
            id
        }

        // validate Payload Value
        let validationMessage = await postDiscussionValidation(body);
        if(validationMessage) {
            toastAlert(validationMessage,"error");
            setPostDiscussionLoading(false);
            return;
        }
        
        let imageUrls = [];
        
        try {
            if(files.length) {
                imageUrls = await uploadImages();
                body = {...body, files : imageUrls };
            }
        } catch(error) {
            console.error(error);
            toastAlert('Error uploading image', 'error');
            setPostDiscussionLoading(false);
            return;
        }
        
        try {
            const response = await postDiscussion(body);
            console.log(response, 'savedDiscussionData');
            setFiles([]);
            setContent('');
            fetchQuesWiseDiscussion();
            setPostDiscussionLoading(false);
        } catch (error) {
            if(error.statusCode === 401) {
                handleLogout(router);
            }
            setPostDiscussionLoading(false);
            toastAlert(error.message, 'error');
            console.log(error.message, 'error');
        }
    };

    const manageBookmark = async(que) => {
        try {
            setBookmarkLoading(true);

            let URL = `/api/bookmarks/bookmark-question`;

            let body;
            if(mode?.toLowerCase() === 'testseries') {
                body = {
                    question_id: que?._id,
                    type: 'TestSeries',
                    test_series_id: refId,
                    subjectId: que?.subject
                };
            }else {
                body = {
                    question_id: que?._id,
                    type: 'PreviousPaper',
                    previous_paper_id: refId,
                    subjectId: que?.subject
                };
            };
            
            let reqObj = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Authorization' : session?.studentData?.accessToken  }
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

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const handleInputChange = (inputValue) => {
        const urlRegex = /(http:\/\/|https:\/\/)[^\s]+/g;
        const sanitizedValue = inputValue.replace(urlRegex, '');
        setContent(sanitizedValue);
    };

    return (
        <>
            <Head>
                <title>Set2Score-Discussion</title>
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
                                    {/* Navigation Menu */}
                                    <Grid container>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <NavigationMenu />
                                        </Grid>
                                    </Grid>

                                    <Grid container>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.backBtnContainer}>
                                            <Link
                                                href={{ 
                                                    pathname: target && target === 'bookmark' ? '/courses/bookmarks' : mode === "full" || mode === "subject" ? '/pastPapers/fullMode' : '/responseSheet',
                                                    query: mode === "full" || mode === "subject" ? { id : refId, mode } : { id: refId, section: mode }
                                                }}
                                            >
                                                <Button
                                                    className={styles.backBtn}
                                                >
                                                    <ArrowBackIcon 
                                                        className={styles.backIcon}
                                                    />
                                                    Back
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>

                                    {/* Discussion, Links and Social Media Icons */}
                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumAndLinkContainer}>
                                            <Grid container>
                                                {/* Forum : Feeds. Recommended and Your Questions and Subject */}
                                                <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                                <Grid container>
                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                        <Grid container>
                                                            <Grid item xl={8} lg={8} sm={8} md={8} xs={12} className={styles.feedSection}>
                                                                <Grid container className={styles.questionBg}>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <Grid container className={styles.questionMainContainer}>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <Question
                                                                                    question={question}
                                                                                    index={0}
                                                                                    bookmarkLoading={bookmarkLoading}
                                                                                    manageBookmark={manageBookmark}
                                                                                    bookmarked={bookmarkedQuestions?.length > 0 && bookmarkedQuestions?.some((bookmarkedQues) => bookmarkedQues?.question_id === question._id)}
                                                                                    mode="discussion"
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <DiscussionChoices
                                                                                    question={question}
                                                                                    index={0}
                                                                                    mode={"discussion"}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <AnswerInput
                                                                                    question={question}
                                                                                    mode={"discussion"}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <Grid container>
                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                        <Grid container>
                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                <Grid container>
                                                                                                    <Grid item xl={8} lg={8} sm={8} md={8} xs={8}>
                                                                                                        <Button
                                                                                                            className={styles.showHideSolBtn}
                                                                                                            onClick={() => setShowSolution(!showSolution)}
                                                                                                        >
                                                                                                            {
                                                                                                                showSolution ? 
                                                                                                                    "Hide Solution"
                                                                                                                : 
                                                                                                                    "Show Solution"
                                                                                                            }
                                                                                                        </Button>
                                                                                                    </Grid>
                                                                                                    <Grid item xl={4} lg={4} sm={4} md={4} xs={4}
                                                                                                    className={styles.reportIconContainer}>
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
                                                                            
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            {
                                                                                showSolution ?
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
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
                                                                </Grid>

                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.horizontalRuler}>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.yourQuestionContainer}>
                                                                        <Grid container className={styles.mainContentSection}>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <Grid container>
                                                                                    <Grid item xl={1} lg={1} sm={1} md={1} xs={12}>
                                                                                        <Avatar
                                                                                            className={styles.profileImage}
                                                                                        >
                                                                                            {session?.studentData?.name.charAt(0)}
                                                                                        </Avatar>
                                                                                    </Grid>
                                                                                    <Grid item xl={11} lg={11} sm={11} md={11} xs={12}>
                                                                                        <FormControl className={styles.inputField}>
                                                                                            <OutlinedInput
                                                                                                placeholder="Write here your doubts"
                                                                                                onChange={(evt) => handleInputChange(evt.target.value)}
                                                                                                type="text"
                                                                                                name="content"
                                                                                                value={content}
                                                                                                multiline
                                                                                                className={styles.questionInput}
                                                                                                style={{ borderRadius: '30px' }}
                                                                                            />
                                                                                            <div className={styles.previewSection}>
                                                                                                {
                                                                                                    renderPreview(files,setFiles)
                                                                                                }
                                                                                            </div>
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                <Grid container>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6}
                                                                                        className={`${styles.borderRight} ${styles.actionGrid}`}
                                                                                    >
                                                                                        <span
                                                                                            className={styles.actionPost}
                                                                                            // onClick={() => uploadImage()}
                                                                                        >
                                                                                            <Dropzone onDrop={(img) => handleDrop(img,setFiles)}>
                                                                                                {({ getRootProps, getInputProps }) => (
                                                                                                    <div
                                                                                                        {...getRootProps()}
                                                                                                        className={styles.actionPost}
                                                                                                    >
                                                                                                        <input
                                                                                                            {...getInputProps({
                                                                                                                id: "imageInput",
                                                                                                                type: "file",
                                                                                                                // onChange: handleImageInput,
                                                                                                                multiple: true,
                                                                                                                accept: "image/*"
                                                                                                                // Only allow image files
                                                                                                            })}
                                                                                                        />
                                                                                                        <CloudUploadIcon />
                                                                                                        Upload
                                                                                                    </div>
                                                                                                )}
                                                                                            </Dropzone>
                                                                                        </span>
                                                                                    </Grid>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.textCenter}>
                                                                                        {
                                                                                            postDiscussionLoading ?
                                                                                                <CircularProgress
                                                                                                    sx={{ color: 'var(--thm-color)' }}
                                                                                                    size={20}
                                                                                                />
                                                                                            :
                                                                                                <span
                                                                                                    className={styles.actionPost}
                                                                                                    onClick={() => handleSubmitDiscussion()}
                                                                                                >
                                                                                                    <Image
                                                                                                        src={PostIcon}
                                                                                                        alt="PostIcon"
                                                                                                    />
                                                                                                    Post
                                                                                                </span>
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>



                                                                <Grid container className={styles.answerSection}>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        <span className={styles.answerText}>Comments</span>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid container>
                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                        {
                                                                            discussion?.length ?
                                                                                discussion?.map((disc,i) => (
                                                                                    <Feed
                                                                                        key={i}
                                                                                        data={disc}
                                                                                        session={session}
                                                                                        type={"discussion"}
                                                                                        updateForum={fetchQuesWiseDiscussion}
                                                                                    />
                                                                                ))
                                                                            :
                                                                                <Grid container>
                                                                                    <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                        <h5>Be the first to give an answer</h5>
                                                                                    </Grid>
                                                                                </Grid>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                </Grid>
                                                
                                                {/* Link & Social Media Icon Section */}
                                                <Grid item xl={3} lg={3} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={11} lg={11} md={11} sm={11} xs={11} className={styles.linkSectionCompGrid}>
                                                            <LinkSection />
                                                        </Grid>
                                                        <Grid item xl={1} lg={1} md={1} sm={1} xs={1} className={styles.socialMediaSectionContainer}>
                                                            <SocialMediaIcons />
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
        </>
    )
}

export default Discussion;

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
};