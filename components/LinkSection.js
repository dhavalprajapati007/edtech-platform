import { Grid } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from "../styles/LinkSection.module.css";
import DepartmentIcon from '../public/assets/images/DepartmentIcon.png';
import ExamIcon from '../public/assets/images/ExamIcon.png'; 
import PreviousPaperAnalysisIcon from '../public/assets/images/PreviousPaperAnalysisIcon.png'; 
import StoreIcon from '../public/assets/images/StoreIcon.png'; 
import SyllabusIcon from '../public/assets/images/SyllabusIcon.png'; 
import PreviousYearCutOffIcon from '../public/assets/images/PreviousYearCutOffIcon.png';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Login from './Modal/Login';
import ForgotPassword from './Modal/ForgotPassword';
import ResetPassword from './Modal/ResetPassword';
import Signup from './Modal/Signup';
import SelectDepartment from './Modal/SelectDepartment';
import { useRouter } from 'next/router';

const LinkSection = ({ id, onDepartmentChange }) => {
    const { data: session } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);
    const [showResetPassModal, setShowResetPassModal] = useState(false);
    const router = useRouter();
    const { pathname } = router;
    const [email, setEmail] = useState("");

    const handleLoginModalClose = () => {
        setShowLoginModal(false);
    }

    const handleSignupModalClose = () => {
        setShowSignupModal(false);
    }

    const handleForgotPassModalClose = () => {
        setShowForgotPassModal(false);
    }

    const openLoginModal = () => {
        setShowLoginModal(true)
        setShowSignupModal(false);
        setShowForgotPassModal(false);
    }

    const openSignupModal = () => {
        setShowSignupModal(true);
        setShowLoginModal(false);
        setShowForgotPassModal(false);
    } 

    const openForgotPassModal = () => {
        setShowForgotPassModal(true);
        setShowSignupModal(false);
        setShowLoginModal(false);
    }

    const openResetPassModal = (email) => {
        setEmail(email);
        setShowResetPassModal(true);
        setShowForgotPassModal(false);
        setShowSignupModal(false);
        setShowLoginModal(false);
    }

    const handleForgotPassModalBackClick = () => {
        setShowForgotPassModal(false);
        setShowLoginModal(true);
    }

    const handleResetPassModalClose = () => {
        setShowResetPassModal(false);
    }

    const handleSelectDepartmentModalClose = () => {
        setShowDepartmentModal(false);
        if(pathname === '/home') {
            onDepartmentChange();
        }
    }

    const openModal = () => {
        if(session) {
            setShowDepartmentModal(true);
        }else{
            setShowLoginModal(true);
        }
    };

    return (
        <Grid container>
            <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Link
                                    href={{ 
                                        pathname: '/syllabus',
                                        ...(id && { query: { id } })
                                    }}
                                    className={`${styles.firstLink} ${styles.linkStyle}`}
                                >
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={SyllabusIcon} alt="syllabusIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Syllabus</span>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Link
                                    href={{ 
                                        pathname: '/yearCutOff',
                                        ...(id && { query: { id } })
                                    }}
                                    className={`${styles.middleLinks} ${styles.linkStyle}`}
                                >
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={PreviousYearCutOffIcon} alt="previousYearCutOffIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Previous year GATE cut-off</span>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Link
                                    href={{ 
                                        pathname: '/paperAnalysis',
                                        ...(id && { query: { id } })
                                    }}
                                    className={`${styles.middleLinks} ${styles.linkStyle}`}
                                >
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={PreviousPaperAnalysisIcon} alt="previousPaperAnalysisIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Previous paper analysis</span>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <div className={`${styles.middleLinks} ${styles.linkStyle}`} onClick={() => openModal()}>
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={DepartmentIcon} alt="departmentIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Change department</span>
                                        </Grid>
                                    </Grid>
                                </div>
                                {
                                    showLoginModal ?
                                        <Login
                                            open={showLoginModal}
                                            handleClose={handleLoginModalClose}
                                            openSignupModal={openSignupModal}
                                            openForgotPassModal={openForgotPassModal}
                                        />
                                    : null
                                }
                                {
                                    showForgotPassModal ?
                                        <ForgotPassword
                                            open={showForgotPassModal}
                                            handleClose={handleForgotPassModalClose}
                                            openResetPassModal={openResetPassModal}
                                            handleBackClick={handleForgotPassModalBackClick}
                                        />
                                    : null
                                }
                                {
                                    showResetPassModal ?
                                        <ResetPassword
                                            email={email}
                                            open={showResetPassModal}
                                            handleClose={handleResetPassModalClose}
                                        />
                                    : null
                                }
                                {
                                    showSignupModal ?
                                        <Signup
                                            open={showSignupModal}
                                            handleClose={handleSignupModalClose}
                                            openLoginModal={openLoginModal}
                                        />
                                    : null
                                }
                                {
                                    showDepartmentModal ?
                                        <SelectDepartment
                                            open={showDepartmentModal}
                                            handleClose={handleSelectDepartmentModalClose}
                                            session={session}
                                        />
                                    : null
                                }
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <div className={`${styles.middleLinks} ${styles.linkStyle}`} onClick={() => openModal()}>
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={ExamIcon} alt="examIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Change exam</span>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Link href={"/"} target="_blank" className={`${styles.lastLink} ${styles.linkStyle}`}>
                                    <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.iconContainer}>
                                            <Image src={StoreIcon} alt="storeIcon" />
                                        </Grid>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                                            <span>Store</span>
                                        </Grid>
                                    </Grid>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default LinkSection;