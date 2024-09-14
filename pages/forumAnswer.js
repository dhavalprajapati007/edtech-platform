import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { Avatar, Button, CircularProgress, FormControl, Grid, OutlinedInput } from '@mui/material';
import styles from "../styles/ForumAnswer.module.css";
import scrollBarStyles from '../styles/Scrollbar.module.css';
import LinkSection from '../components/LinkSection';
import SocialMediaIcons from '../components/SocialMediaIcons';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { getSession } from 'next-auth/react';
import PostIcon from "../public/assets/images/PostIcon.png";
import Image from 'next/image';
import Feed from '../components/Feed';
import { toastAlert } from '../helpers/toastAlert';
import { handleLogout } from '../utils/logout';
import { useRouter } from 'next/router';
import NavigationMenu from '../components/NavigationMenu';
import ForumQues from '../components/ForumQues';
import { handleDrop, renderPreview } from '../helpers/uploadImageHelper';
import Dropzone from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { addForumAnswerValidation } from '../validations/forum.validation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const ForumAnswer = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [feedData, setFeedData] = useState([]);
    const [addAnsLoading, setAddAnsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setLoading(true);
        fetchSingleForum();

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
    },[]);

    const fetchSingleForum = async () => {
        try {        
            let URL = `/api/forum/get-single-forum?id=${id}`;

            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                if(!Object.keys(data.data)?.length) {
                    toastAlert("Feed Not Found","error");
                }
                console.log(data?.data,'singleForumData');
                setFeedData(data?.data?.length ? data?.data[0] : []);
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

    const postForumAnswer = async (body) => {
        try {
            let URL = '/api/forum/submit-forum-answers';

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

    const handleSubmitPost = async () => {
        setAddAnsLoading(true);

        let body = {
            text: question,
            files: [],
            forum: id
        }

        // validate Payload Value
        let validationMessage = await addForumAnswerValidation(body);
        if(validationMessage) {
            toastAlert(validationMessage,"error");
            setAddAnsLoading(false);
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
            setAddAnsLoading(false);
            return;
        }
        
        try {
            const response = await postForumAnswer(body);
            console.log(response, 'savedForumAnswerData');
            setFiles([]);
            setQuestion('');
            fetchSingleForum();
            setAddAnsLoading(false);
        } catch (error) {
            if(error.statusCode === 401) {
                handleLogout(router);
            }
            setAddAnsLoading(false);
            toastAlert(error.message, 'error');
            console.log(error.message, 'error');
        }
    };

    const handleInputChange = (inputValue) => {
        const urlRegex = /(http:\/\/|https:\/\/)[^\s]+/g;
        const sanitizedValue = inputValue.replace(urlRegex, '');
        setQuestion(sanitizedValue);
    };

    return (
        <>
            <Head>
                <title>Set2Score-ForumAnswer</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                <Grid container className={styles.mainContainer}>
                    {
                        loading ?
                            <Grid container className={styles.marginSpace}>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Loader/>
                                </Grid>
                            </Grid>
                        :
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <NavigationMenu />
                                        </Grid>

                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumAndLinkContainer}>
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Link
                                                        href={'/forum'}
                                                        className={styles.backToFeeds}
                                                    >
                                                        <span >
                                                            <ArrowBackIcon/>
                                                        </span>
                                                        <span>
                                                            Back to feeds
                                                        </span>
                                                    </Link>
                                                </Grid>

                                                {/* Forum : Feeds. Recommended and Your Questions and Subject */}
                                                <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.feedSection}>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumQuesGrid}
                                                                        >
                                                                            <ForumQues
                                                                                data={feedData}
                                                                                updateForumFeed={fetchSingleForum}
                                                                                session={session}
                                                                                showAnswer={false}
                                                                                type='forumAnswer'
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.yourQuestionContainer}>
                                                                            <Grid container className={styles.mainContentSection}>
                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={1} lg={1} sm={1} md={1} xs={12}>
                                                                                            <Avatar
                                                                                                // src={"https://i0.wp.com/moovmynt.com/wp-content/uploads/2021/09/Sunil-2.png?fit=538%2C608&ssl=1"}
                                                                                                className={styles.profileImage}
                                                                                            >
                                                                                                {feedData?.postedBy?.name.charAt(0)}
                                                                                            </Avatar>
                                                                                        </Grid>
                                                                                        <Grid item xl={11} lg={11} sm={11} md={11} xs={11}>
                                                                                            <FormControl className={styles.inputField}>
                                                                                                <OutlinedInput
                                                                                                    placeholder="What's your question?"
                                                                                                    onChange={(evt) => handleInputChange(evt.target.value)}
                                                                                                    type="text"
                                                                                                    name="question"
                                                                                                    value={question}
                                                                                                    multiline
                                                                                                    className={styles.questionInput}
                                                                                                    style={{ borderRadius: '30px' }}
                                                                                                />
                                                                                                <div className='preview'>
                                                                                                    {
                                                                                                        renderPreview(files,setFiles)
                                                                                                    }
                                                                                                </div>
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                            <Grid container className={styles.uploadAndPostBtnContainer}>
                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={4}>
                                                                                                    <Grid container>
                                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.uploadBtnGrid}>
                                                                                                            <Button
                                                                                                                className={styles.uploadAndPostBtn}
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
                                                                                                            </Button>
                                                                                                        </Grid>
                                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.postBtnGrid}>
                                                                                                            <Button
                                                                                                                className={styles.uploadAndPostBtn}
                                                                                                                onClick={() => handleSubmitPost()}
                                                                                                            >
                                                                                                                {
                                                                                                                    addAnsLoading ?
                                                                                                                        <CircularProgress
                                                                                                                            sx={{ color: 'var(--thm-color)' }}
                                                                                                                            size={20}
                                                                                                                        />
                                                                                                                    :
                                                                                                                        <span
                                                                                                                            className={styles.actionPost}
                                                                                                                        >
                                                                                                                            <Image
                                                                                                                                src={PostIcon}
                                                                                                                                alt="PostIcon"
                                                                                                                            />
                                                                                                                            Post
                                                                                                                        </span>
                                                                                                                }
                                                                                                            </Button>
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

                                                                    <Grid container className={styles.answerSection}>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            <span className={styles.answerText}>Answer</span>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.feedDataMainGrid} ${scrollBarStyles.myCustomScrollbar}`}>
                                                                            <Grid container>
                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.feedDataInnerGrid}>
                                                                                    {
                                                                                        feedData?.answers?.length ?
                                                                                            feedData?.answers?.map((feed,i) => (
                                                                                                <React.Fragment
                                                                                                    key={i}
                                                                                                >
                                                                                                    <Feed
                                                                                                        data={feed}
                                                                                                        subject={feedData?.subject?.title}
                                                                                                        session={session}
                                                                                                        updateForum={fetchSingleForum}
                                                                                                    />
                                                                                                    {
                                                                                                        feedData?.answers?.length-1 !== i ?
                                                                                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                <hr className={styles.horizontalRuler}/>
                                                                                                            </Grid>
                                                                                                        :null
                                                                                                    }
                                                                                                </React.Fragment>
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
                            </Grid>
                    }
                </Grid>
            </section>
        </>
    )
}

export default ForumAnswer;

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