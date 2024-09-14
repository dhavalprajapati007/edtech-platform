import { Avatar, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import styles from "../styles/Feed.module.css";
import ChatIcon from '@mui/icons-material/Chat';
import LatexMarkup from './LatexMarkup';
import Link from 'next/link';
import Image from 'next/image';
import ImagePopup from './Modal/ImagePopup';
import PostImage from '../public/assets/images/PlaceIn.png';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Report from './Modal/Report';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { toastAlert } from '../helpers/toastAlert';
import { handleLogout } from '../utils/logout';
import Feed from './Feed';
import { requestAPI } from '../helpers/apiHelper';
import DeleteConfirmation from './Modal/DeleteConfirmation';

const ForumQues = ({ data, feedIndex, updateForumFeed, session, type, showAnswer, handleEditClick }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const closeReportModal = () => {
        setShowReportModal(false);
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    }

    const handleUpVote = async () => {
        let obj = {
            forum: data._id,
            direction: 'upVote'
        };
        await manageVotes(obj);
    };

    const handleDownVote = async () => {
        let obj = {
            forum: data._id,
            direction: 'downVote'
        }
        await manageVotes(obj);
    };

    const manageVotes = async(payload) => {
        try {
            let URL = '/api/votes/manage-forum-vote';
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                toastAlert(data.message,"success");
                updateForumFeed();
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

    const deleteForumAndAnswers = async() => {
        try {
            let URL = '/api/forum/delete-forum-and-answers';

            let payload = {
                forumId: data?._id,
                userId: data?.postedBy?._id
            }
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { Authorization: session?.studentData?.accessToken }
            };

            let resData = await requestAPI(URL,reqObj);

            if(resData && resData?.statusCode == 200) {
                console.log(resData,'deleteForumData');
                toastAlert(resData.message,"success");
                setShowDeleteModal(false);
                updateForumFeed();
            } else {
                if(resData.statusCode == 401) {
                    handleLogout(router);
                }
                setShowDeleteModal(false);
                toastAlert(resData?.message,"error");
                console.log(resData?.message,"error");              
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
                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.forumQuesMainContainer}>
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
                                                        {data?.subject?.title}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>

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

                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.voteSection}>
                                            <Grid container>
                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                    <Grid container>
                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container className={styles.actionContainer}>
                                                                <Grid item xl={6} lg={6} sm={6} md={6} xs={12} className={styles.textCenter}>
                                                                    <Grid container>
                                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                            <Grid container>
                                                                                <Grid item xl={6} lg={6} sm={8} md={8} xs={10}>
                                                                                    <Grid container>
                                                                                        <Grid item xl={6} lg={6} sm={6} md={6} xs={12} className={styles.upvoteDownvoteBtnMainGrid}>
                                                                                            <Button
                                                                                                className={`${styles.upvoteButton} ${data?.isUpvoted ? styles.upvoted : styles.notUpvoted}`}
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
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xl={4} lg={4} sm={4} md={4} xs={2} className={styles.chatIconGrid}>
                                                                                    <Link
                                                                                        href={{ 
                                                                                            pathname: '/forumAnswer',
                                                                                            query: { id : data._id }
                                                                                        }}
                                                                                    >
                                                                                        <Button
                                                                                            className={styles.textCenter}
                                                                                            style={{
                                                                                                backgroundColor: 'white',
                                                                                                color: 'black'
                                                                                            }}
                                                                                        >
                                                                                            <ChatIcon
                                                                                                className={styles.muiIconStyle}
                                                                                            />
                                                                                                {
                                                                                                    data?.answerCount ?
                                                                                                        data?.answerCount
                                                                                                    :
                                                                                                        data?.answers?.length
                                                                                                    ?
                                                                                                        data?.answers?.length
                                                                                                    :
                                                                                                        0
                                                                                                }
                                                                                        </Button>
                                                                                    </Link>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>

                                                                        
                                                                    </Grid>
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
                                                                                            type={"forum"}
                                                                                            referenceId={data._id}
                                                                                        />
                                                                                    : null
                                                                                }
                                                                            </>
                                                                    :
                                                                        <Grid container>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.postAnswerContainer}>
                                                                                <ReportProblemIcon 
                                                                                    className={styles.reportButton}
                                                                                    onClick={() => setShowReportModal(true)}
                                                                                />
                                                                                {
                                                                                    showReportModal ?
                                                                                        <Report
                                                                                            open={showReportModal}
                                                                                            handleClose={closeReportModal}
                                                                                            type={"forum"}
                                                                                            referenceId={data._id}
                                                                                        />
                                                                                    : null
                                                                                }
                                                                            </Grid>
                                                                            <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.postAnswerContainer}>
                                                                                <Grid container>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.deleteAndEditGrid}>
                                                                                        {
                                                                                            type !== 'forumAnswer' ?
                                                                                            <>
                                                                                                <DeleteIcon
                                                                                                    className={styles.reportButton}
                                                                                                    onClick={() => setShowDeleteModal(true)}
                                                                                                />
                                                                                                {
                                                                                                    showDeleteModal ?
                                                                                                        <DeleteConfirmation
                                                                                                            open={showDeleteModal}
                                                                                                            handleClose={closeDeleteModal}
                                                                                                            handleDelete={deleteForumAndAnswers}
                                                                                                        />
                                                                                                    : null
                                                                                                }
                                                                                            </>
                                                                                            : null
                                                                                        }
                                                                                    </Grid>
                                                                                    <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.deleteAndEditGrid}>
                                                                                        {
                                                                                            type !== 'forumAnswer' ?
                                                                                            <>
                                                                                                <EditIcon
                                                                                                    className={styles.reportButton}
                                                                                                    onClick={() => handleEditClick(feedIndex)}
                                                                                                />
                                                                                            </>
                                                                                            : null
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                                
                                                                            </Grid>
                                                                        </Grid>
                                                                    }
                                                                </Grid>
                                                                {
                                                                    type === 'forum' ?
                                                                        <Grid item xl={3} lg={3} sm={3} md={3} xs={9} className={styles.postAnswerContainer}>
                                                                            <Link
                                                                                href={{ 
                                                                                    pathname: '/forumAnswer',
                                                                                    query: { id : data._id }
                                                                                }}
                                                                            >
                                                                                <span className={styles.postAnsImageText}>
                                                                                    <Image
                                                                                        src={PostImage}
                                                                                        alt='postImage'
                                                                                        height={15}
                                                                                        width={15}
                                                                                    />
                                                                                    <span className={styles.postAnsText}>Post your Answer</span>
                                                                                </span>
                                                                            </Link>
                                                                        </Grid>
                                                                    : null
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        {
                                                            showAnswer && data?.answers && Object.keys(data?.answers)?.length ?
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    <hr className={styles.horizontalRuler}/>
                                                                </Grid>
                                                            :null
                                                        }

                                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                            <Grid container>
                                                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                                                    {
                                                                        (showAnswer && data?.answers && Object.keys(data?.answers)?.length) ?
                                                                            <Feed
                                                                                data={data?.answers}
                                                                                session={session}
                                                                                updateForum={updateForumFeed}
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </section>
    )
}

export default ForumQues;