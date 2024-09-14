import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { Autocomplete, Avatar, Box, Button, CircularProgress, FormControl, Grid, OutlinedInput, TextField } from '@mui/material';
import styles from "../styles/Forum.module.css";
import scrollBarStyles from '../styles/Scrollbar.module.css';
import LinkSection from '../components/LinkSection';
import SocialMediaIcons from '../components/SocialMediaIcons';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { toastAlert } from '../helpers/toastAlert';
import { handleLogout } from '../utils/logout';
import { useRouter } from 'next/router';
import NavigationMenu from '../components/NavigationMenu';
import ForumQues from '../components/ForumQues';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { addForumValidation } from '../validations/forum.validation';
import Dropzone from 'react-dropzone';
import { handleDrop, renderPreview } from '../helpers/uploadImageHelper';
import GetTheApp from '../components/GetTheApp';
import Footer from '../components/Footer';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const Forum = ({ session }) => {
    const [loading, setLoading] = useState(false);
    const [subjectData, setSubjectData] = useState([]);
    const [subject, setSubject] = useState({});
    const [question, setQuestion] = useState("");
    const [activeTab, setActiveTab] = useState("feeds");
    const [feedData, setFeedData] = useState([]);
    const [files, setFiles] = useState([]);
    const [addPostLoading, setAddPostLoading] = useState(false);
    const [questionSubject, setQuestionSubject] = useState({});
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [forumId, setForumId] = useState('');
    const router = useRouter();

    useEffect(() => {
        if(session) {
            setLoading(true);
            fetchDeptWiseSubjectData();
            fetchForumData();
        };

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
    
    const fetchDeptWiseSubjectData = async () => {
        try {
            
            let URL = `/api/departments/get-single-department?id=${session?.studentData?.department}`;

            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                if(!Object.keys(data.data).length) {
                    toastAlert("Subject Not Found","error");
                }
                setSubjectData(Object.keys(data.data).length ? data?.data.subjects : []);
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
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

    const fetchForumData = async () => {
        try {
            let URL = '/api/forum/get-all-forum';
            
            let reqObj = {
                method: "GET",
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            console.log(data,'forumDataAfterDecrypt');

            if(data && data?.statusCode == 200) {
                if(!data.data.length) {
                    toastAlert("Feed Not Found","error");
                }
                setFeedData(data.data?.length ? data?.data : []);
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
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

    const fetchFilteredForumData = async (payload) => {
        try {
            let URL = '/api/forum/get-filtered-forum';
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                if(!data.data.length) {
                    toastAlert("Filtered Feed Not Found","error");
                }
                setFeedData(data.data?.length ? data?.data : []);
                setLoading(false);
            } else {
                if(data.statusCode == 401) {
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

    const handleActiveTabChange = async(val) => {
        if(val !== activeTab) {
            setLoading(true);
            setActiveTab(val);
            if(val === "feeds") {
                await fetchForumData();
            }else if(val === "recommended") {
                let obj = {
                    recommended: true,
                    type: 'recommended'
                    // department: session.studentData.department
                }
                await fetchFilteredForumData(obj);
            }else if(val === "questions") {
                let obj = {
                    postedBy: session?.studentData?._id,
                    type: 'question'
                    // department: session.studentData.department
                }
                await fetchFilteredForumData(obj);
            }
        }
    }

    const handleSubjectChange = async (data) => {
        setSubject(data);
        setLoading(true);
        if(data !== null) {
            let obj = {
                subject: data._id,
                type: 'subject'
                // department: session.studentData.department
            };
            await fetchFilteredForumData(obj);
        }else {
            await fetchForumData();
        }
    }

    const postForum = async (body) => {
        try {
            let URL;
            if(isEditClicked) {
                URL = '/api/forum/edit-forum';
            }else{
                URL = '/api/forum/save-forum';
            }
            
            let reqObj = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { Authorization: session?.studentData?.accessToken },
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
            toastAlert('Something Went Wrong, Please Try Again After Sometime', 'error');
            console.log(e, 'error');
        }
    };
      
    const uploadImages = async () => {
        try {
            const formData = new FormData();

            let imageURLArr = files?.filter((file) => typeof file === 'string');
            let newUploadedImageArr = files?.filter((file) => typeof file === 'object');
            
            console.log(imageURLArr,'filteredStringArr');
            console.log(newUploadedImageArr,'newUploadedImageArr');

            if(newUploadedImageArr?.length) {
                newUploadedImageArr.map((file) => formData.append('images', file));
                
                let URL = '/api/images/upload-image';
                
                let reqObj = {
                    method: 'POST',
                    body: formData,
                    headers: { Authorization: session?.studentData?.accessToken },
                };

                let data = await requestAPI(URL,reqObj);            
            
                if(data.statusCode == 200) {
                    if(imageURLArr?.length) {
                        return [...data.data, ...imageURLArr]
                    }else {
                        console.log(data.data,'APIResponse')
                        return data.data;
                    }
                }else {
                    if(data.statusCode == 401) {
                        handleLogout(router);
                    }
                    toastAlert(data.message, 'error');
                    throw new Error('Failed to upload image');
                }
            }else {
                return imageURLArr;
            }

        } catch(err) {
            console.error(err);
            toastAlert('Error uploading image', 'error');
            throw new Error('Failed to upload image');
        }
    };
      
    const handleSubmitPost = async () => {
        setAddPostLoading(true);

        let body;
        if(isEditClicked) {
            body = {
                forumId: forumId,
                text: question,
                files: [],
                subject: questionSubject?._id
            }
        }else {
            body = {
                text: question,
                files: [],
                subject: questionSubject?._id
            }
        }

        // validate Payload Value
        let validationMessage = await addForumValidation(body);
        if(validationMessage) {
            toastAlert(validationMessage,"error");
            setAddPostLoading(false);
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
            setAddPostLoading(false);
            return;
        }
        
        try {
            const response = await postForum(body);
            console.log(response, 'savedForumData');
            setFiles([]);
            setQuestion('');
            setQuestionSubject({});
            setIsEditClicked(false);
            setForumId('');
            refreshFeed();
            setAddPostLoading(false);
        } catch (error) {
            if(error.statusCode === 401) {
                handleLogout(router);
            }
            setAddPostLoading(false);
            toastAlert(error.message, 'error');
            console.log(error.message, 'error');
        }
    };

    const refreshFeed = async() => {
        // setLoading(true);
        if(activeTab === "feeds") {
            await fetchForumData();
        }else if(activeTab === "recommended") {
            let obj = {
                recommended: true,
                type: 'recommended'
                // department: session.studentData.department
            }
            await fetchFilteredForumData(obj);
        }else if(activeTab === "questions") {
            let obj = {
                postedBy: session?.studentData?._id,
                type: 'question'
                // department: session.studentData.department
            }
            await fetchFilteredForumData(obj);
        }
    }

    const handleInputChange = (inputValue) => {
        // Regular expression to match web links starting with http:// or https://
        const urlRegex = /(http:\/\/|https:\/\/)[^\s]+/g;
        
        // Remove web links from the input value
        const sanitizedValue = inputValue.replace(urlRegex, '');
        
        // Update the state with the sanitized value
        setQuestion(sanitizedValue);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleEditClick = (id) => {
        let selectedForum = feedData[id];
        setForumId(selectedForum?._id);
        setIsEditClicked(true);
        setQuestion(selectedForum?.text);
        setQuestionSubject(selectedForum?.subject);
        setFiles(selectedForum?.files);
        scrollToTop();
    }
    
    return (
        <>
            <Head>
                <title>Set2Score-Forum</title>
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
                                    <>
                                        <Grid container className={styles.mainContainer}>
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <NavigationMenu />
                                                        </Grid>

                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumAndLinkContainer}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumTypeMenuSection}>
                                                                    <Grid container>
                                                                        <Grid item xl={8} lg={8} sm={12} md={12} xs={12}>
                                                                            <Grid container>
                                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={2}
                                                                                            onClick={() => handleActiveTabChange("feeds")}
                                                                                        >
                                                                                            <span
                                                                                                className={`${styles.forumMenu} ${activeTab === "feeds" ? styles.activeForumTag : ''}`}
                                                                                            >
                                                                                                Feeds
                                                                                            </span>
                                                                                        </Grid>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={5}
                                                                                            onClick={() => handleActiveTabChange("recommended")}
                                                                                        >
                                                                                            <span
                                                                                                className={`${styles.forumMenu} ${activeTab === "recommended" ? styles.activeForumTag : ''}`}
                                                                                            >
                                                                                                Recommended
                                                                                            </span>
                                                                                        </Grid>
                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={5}
                                                                                            onClick={() => handleActiveTabChange("questions")}
                                                                                        >
                                                                                            <span
                                                                                                className={`${styles.forumMenu} ${activeTab === "questions" ? styles.activeForumTag : ''}`}
                                                                                            >
                                                                                                Your Questions
                                                                                            </span>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                {
                                                                                    activeTab === "feeds" ?
                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={12}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                    <Autocomplete
                                                                                                        className={styles.subjectAutocomplete}
                                                                                                        name="subject"
                                                                                                        value={subject}
                                                                                                        options={subjectData}
                                                                                                        autoHighlight
                                                                                                        onChange={(e, val) => handleSubjectChange(val)}
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
                                                                                                                className={styles.subjectDropDownTextField}
                                                                                                                {...params}
                                                                                                                label="Sort by subject"
                                                                                                                placeholder="Sort by Subject"
                                                                                                                inputProps={{
                                                                                                                    ...params.inputProps,
                                                                                                                    autoComplete: "off",
                                                                                                                    // style: {
                                                                                                                    //     height: '40px',
                                                                                                                    //     borderRadius: '5px',
                                                                                                                    //     border: 'none',
                                                                                                                    //     backgroundColor: '#EFEFEF',
                                                                                                                    //     ...params.inputProps.style,
                                                                                                                    // },
                                                                                                                }}
                                                                                                                InputLabelProps={{
                                                                                                                    style: {
                                                                                                                        color: 'var(--thm-color)',
                                                                                                                        border: 'none !important',
                                                                                                                    }
                                                                                                                }}
                                                                                                                // InputProps={{
                                                                                                                //     style: {
                                                                                                                //         height: '40px',
                                                                                                                //         borderRadius: '5px',
                                                                                                                //         border: 'none !important',
                                                                                                                //         backgroundColor: '#EFEFEF',
                                                                                                                //     },
                                                                                                                // }}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    : null
                                                                                }
                                                                            </Grid>
                                                                            
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.feedAndLinkSectionMainGrid}>
                                                                    <Grid container>
                                                                        {/* Forum : Feeds. Recommended and Your Questions and Subject */}
                                                                        <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                                                            <Grid container>
                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.feedSection}>
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.yourQuestionContainer}>
                                                                                                    <Grid container className={styles.mainContentSection}>
                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                            <Grid container>
                                                                                                                <Grid item xl={1} lg={1} sm={1} md={1} xs={2}>
                                                                                                                    <Avatar
                                                                                                                        className={styles.profileImage}
                                                                                                                    >
                                                                                                                        {session?.studentData?.name.charAt(0)}
                                                                                                                    </Avatar>
                                                                                                                </Grid>
                                                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={10}>
                                                                                                                    <Autocomplete
                                                                                                                        className={styles.deptWiseSubAutocomplete}
                                                                                                                        name="subject"
                                                                                                                        value={questionSubject}
                                                                                                                        options={subjectData}
                                                                                                                        autoHighlight
                                                                                                                        onChange={(e, val) => setQuestionSubject(val)}
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
                                                                                                                                className={styles.subjectInput}
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
                                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                    <Grid container className={styles.inputTextContainer}>
                                                                                                                        <Grid item xl={11} lg={11} sm={11} md={11} xs={12}>
                                                                                                                            <FormControl className={styles.formControlInputField}>
                                                                                                                                <OutlinedInput
                                                                                                                                    className={styles.inputField}
                                                                                                                                    placeholder="What's your question?"
                                                                                                                                    onChange={(evt) => handleInputChange(evt.target.value)}
                                                                                                                                    type="text"
                                                                                                                                    name="question"
                                                                                                                                    value={question}
                                                                                                                                    multiline
                                                                                                                                    minRows={3}
                                                                                                                                    style={{ borderRadius: '5px' }}
                                                                                                                                />
                                                                                                                            </FormControl>
                                                                                                                            <div className={styles.previewSection}>
                                                                                                                                {
                                                                                                                                    renderPreview(files,setFiles)
                                                                                                                                }
                                                                                                                            </div>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                    <Grid container className={styles.uploadAndPostBtnContainer}>
                                                                                                                        <Grid item xl={4} lg={4} sm={4} md={4} xs={8}>
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
                                                                                                                                                            multiple: true,
                                                                                                                                                            accept: "image/*"
                                                                                                                                                            // Only allow image files
                                                                                                                                                        })}
                                                                                                                                                    />
                                                                                                                                                    <CloudUploadIcon 
                                                                                                                                                        style={{
                                                                                                                                                            fontSize : '18px'
                                                                                                                                                        }}
                                                                                                                                                    />
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
                                                                                                                                            addPostLoading ?
                                                                                                                                                <CircularProgress
                                                                                                                                                    sx={{ color: 'var(--thm-color)' }}
                                                                                                                                                    size={20}
                                                                                                                                                />
                                                                                                                                            :
                                                                                                                                                <>
                                                                                                                                                    <ModeEditIcon
                                                                                                                                                        style={{
                                                                                                                                                            fontSize : '18px'
                                                                                                                                                        }}
                                                                                                                                                    />
                                                                                                                                                    Post
                                                                                                                                                </>
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
                                                                                            <Grid container>
                                                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={`${styles.feedDataMainGrid} ${scrollBarStyles.myCustomScrollbar}`}>
                                                                                                    <Grid container>
                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.feedDataInnerGrid}>
                                                                                                            {
                                                                                                                feedData?.length ?
                                                                                                                    feedData?.map((feed,idx) => (
                                                                                                                        <div key={idx}>
                                                                                                                            <ForumQues
                                                                                                                                data={feed}
                                                                                                                                feedIndex={idx}
                                                                                                                                updateForumFeed={refreshFeed}
                                                                                                                                session={session}
                                                                                                                                showAnswer={true}
                                                                                                                                handleEditClick={handleEditClick}
                                                                                                                                type='forum'
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    ))
                                                                                                                :
                                                                                                                    <Grid container className={styles.dataNotFoundContainer}>
                                                                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                                                                            <h5>Be the first one to ask Question</h5>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
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
                                                                        
                                                                        {/* Link & Social Media Icon Section */}
                                                                        <Grid item xl={3} lg={3} sm={12} md={12} xs={12} className={styles.linkAndSocialMediaIconContainer}>
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
                                                            </Grid>
                                                        </Grid>

                                                        
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container className={styles.footerAndGetTheAppContainer}>
                                            {/* GET_THE_APP_SECTION: START */}
                                            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                <GetTheApp/>
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
                                    </>
                                }
                            </Grid>
                        </Grid>
                    : null
                }
            </section>
        </>
    )
}

export default Forum;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    
    // if(!session) {
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