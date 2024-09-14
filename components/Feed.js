import { Avatar, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import styles from "../styles/Feed.module.css";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ChatIcon from '@mui/icons-material/Chat';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LatexMarkup from './LatexMarkup';
import { handleLogout } from '../utils/logout';
import { toastAlert } from '../helpers/toastAlert';
import Image from 'next/image';
import ImagePopup from './Modal/ImagePopup';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DeleteIcon from '@mui/icons-material/Delete';
import Report from './Modal/Report';
import { requestAPI } from '../helpers/apiHelper';
import DeleteConfirmation from './Modal/DeleteConfirmation';

const Feed = ({ data, subject, session, updateForum, type }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleUpVote = async () => {
        if(type === 'discussion') {
            let obj = {
                discussionId: data._id,
                direction: 'upVote'
            };
            await manageDiscussionVotes(obj);
        }else {
            let obj = {
                answer: data._id,
                direction: 'upVote'
            };
            await manageVotes(obj);
        }
    };

    const handleDownVote = async () => {
        if(type === 'discussion') {
            let obj = {
                discussionId: data._id,
                direction: 'downVote'
            };
            await manageDiscussionVotes(obj);
        }else {
            let obj = {
                answer: data._id,
                direction: 'downVote'
            }
            await manageVotes(obj);
        }
    };

    const manageVotes = async(payload) => {
        try {        
            let URL = '/api/votes/manage-answer-vote';

            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                toastAlert(data.message,"success");
                updateForum();
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"error");              
            }
        }catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };


    const manageDiscussionVotes  = async(payload) => {
        try {
            let URL = '/api/votes/manage-discussion-votes';
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                toastAlert(data.message,"success");
                updateForum();
            } else {
                if(data.statusCode == 401) {
                    handleLogout(router);
                }
                toastAlert(data.message,"error");
                console.log(data.message,"error");              
            }
        }catch(e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const closeReportModal = () => {
        setShowReportModal(false);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deleteForumComment  = async() => {
        try {
            let URL = '/api/forum/delete-forum-comment';

            let payload = {
                userId: data?.postedBy?._id,
                answerId: data?._id
            }
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let resData = await requestAPI(URL,reqObj);

            if(resData && resData?.statusCode == 200) {
                toastAlert(resData.message,"success");
                setShowDeleteModal(false);
                updateForum();
            } else {
                if(resData.statusCode == 401) {
                    handleLogout(router);
                }
                setShowDeleteModal(false);
                toastAlert(resData.message,"error");
                console.log(resData.message,"error");         
            }
        }catch(e) {
            setShowDeleteModal(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    const deleteAnsDiscussion  = async() => {
        try {
            let URL = '/api/discussion/delete-discussion';

            let payload = {
                userId: data?.postedBy?._id,
                discussionId: data?._id
            }
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let resData = await requestAPI(URL,reqObj);

            if(resData && resData?.statusCode == 200) {
                toastAlert(resData.message,"success");
                setShowDeleteModal(false);
                updateForum();
            } else {
                if(resData.statusCode == 401) {
                    handleLogout(router);
                }
                setShowDeleteModal(false);
                toastAlert(resData.message,"error");
                console.log(resData.message,"error");         
            }
        }catch(e) {
            setShowDeleteModal(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    };

    return (
        <section>
            <Grid container>
                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={type === 'discussion' ? styles.discussionMainContainer : styles.mainContainer}>
                    <Grid container>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.contentSection}>
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <Grid container>
                                                <Grid item xl={1} lg={1} sm={1} md={1} xs={3} className={styles.imageSection}>
                                                    <Avatar
                                                        // src={"https://i0.wp.com/moovmynt.com/wp-content/uploads/2021/09/Sunil-2.png?fit=538%2C608&ssl=1"}
                                                        className={styles.profileImage}
                                                    >
                                                        {data?.postedBy?.name.charAt(0)}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xl={11} lg={11} sm={11} md={11} xs={9}>
                                                    <span className={styles.username}>{data?.postedBy?.name}</span>
                                                    <span className={styles.userInfo}>
                                                        {subject}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <h4 className={styles.userQuestion}>Why do we use both f(x) and y to denote a function?</h4>
                                        </Grid> */}

                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <LatexMarkup
                                                latex={data?.text ?? data?.text }
                                                suppressHydrationWarning
                                            />
                                        </Grid>

                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            {
                                                data?.files?.length ?
                                                    data?.files?.map((file,i) => (
                                                        <div key={i}>
                                                            <Image
                                                                src={file}
                                                                width={300}
                                                                height={200}
                                                                alt="FeedImage"
                                                                className={styles.imageDimension}
                                                                onClick={() => {
                                                                    setSelectedImage(file);
                                                                    setIsModalOpen(true);
                                                                }}
                                                            />
                                                        </div>
                                                    ))
                                                : null
                                            }
                                            {
                                                isModalOpen ?
                                                    <ImagePopup
                                                        open={isModalOpen}
                                                        handleClose={closeModal}
                                                        image={selectedImage}
                                                    />
                                                : null
                                            }
                                        </Grid>

                                        {/* <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <span className={styles.reviewInfo}>
                                                12 views . View 7 upvotes . View 1 share . Submission accepted by Claire Germond
                                            </span>
                                        </Grid> */}

                                        {/* {
                                            type !== "discussion" ? */}
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.voteSection}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <Grid container className={styles.actionContainer}>
                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={9}>
                                                                            <Button
                                                                                className={`${styles.upvoteButton} ${data?.isUpvoted ?  styles.upvoted : styles.notUpvoted}`}
                                                                                onClick={() => handleUpVote()}
                                                                            >
                                                                                <KeyboardDoubleArrowUpIcon /> Upvote {data?.upVotes ? data?.upVotes : 0}
                                                                            </Button>
                                                                            <Button
                                                                                className={`${styles.downvoteButton} ${data?.isDownvoted ?  styles.downvoted : styles.notDownvoted}`}
                                                                                onClick={() => handleDownVote()}
                                                                            >
                                                                                <KeyboardDoubleArrowDownIcon /> Downvote {data?.downVotes ? data?.downVotes : 0}
                                                                            </Button>
                                                                        </Grid>
                                                                        <Grid item xl={3} lg={3} sm={3} md={3} xs={3} className={styles.reportIconContainer}>
                                                                            {
                                                                                session?.studentData?._id !== data?.postedBy?._id ?
                                                                                    <>
                                                                                        <ReportProblemIcon
                                                                                            className={styles.reportButton}
                                                                                            onClick={() => setShowReportModal(true)}
                                                                                        />
                                                                                        {
                                                                                            showReportModal ?
                                                                                                <Report
                                                                                                    open={showReportModal}
                                                                                                    handleClose={closeReportModal}
                                                                                                    type={type === 'discussion' ? 'discussion' : "comment"}
                                                                                                    referenceId={data._id}
                                                                                                />
                                                                                            : null
                                                                                        }
                                                                                    </>
                                                                                :
                                                                                    <Grid container>
                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.reportIconContainer}>
                                                                                            <ReportProblemIcon
                                                                                                className={styles.reportButton}
                                                                                                onClick={() => setShowReportModal(true)}
                                                                                            />
                                                                                            {
                                                                                                showReportModal ?
                                                                                                    <Report
                                                                                                        open={showReportModal}
                                                                                                        handleClose={closeReportModal}
                                                                                                        type={type === 'discussion' ? 'discussion' : "comment"}
                                                                                                        referenceId={data._id}
                                                                                                    />
                                                                                                : null
                                                                                            }
                                                                                        </Grid>
                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.reportIconContainer}>
                                                                                            <DeleteIcon
                                                                                                className={styles.reportButton}
                                                                                                onClick={() => setShowDeleteModal(true)}
                                                                                            />
                                                                                            {
                                                                                                showDeleteModal ?
                                                                                                    <DeleteConfirmation
                                                                                                        open={showDeleteModal}
                                                                                                        handleClose={closeDeleteModal}
                                                                                                        handleDelete={type === "discussion" ?  deleteAnsDiscussion : deleteForumComment}
                                                                                                    />
                                                                                                : null
                                                                                            }
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
                                            {/* : null
                                        } */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </section>
    )
}

export default Feed;