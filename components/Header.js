import React, { useEffect, useState } from "react";
import { Button, Grid, ListItemIcon, Menu, MenuItem } from "@mui/material";
import styles from "../styles/Home.module.css"
import Image from "next/image";
import appLogo from "../public/assets/images/Set2ScoreLogo.png"
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import { Logout, Person } from "@mui/icons-material";
import Login from "./Modal/Login";
import ForgotPassword from "./Modal/ForgotPassword";
import ResetPassword from "./Modal/ResetPassword";
import Signup from "./Modal/Signup";
import { useRouter } from 'next/router';

const Header = () => {
    const { data: session, status } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showForgotPassModal, setShowForgotPassModal] = useState(false);
    const [showResetPassModal, setShowResetPassModal] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();
    let excludeLoginPopup = ['/home','/','/aboutUs','/privacy','/termsAndConditions'];
    const { pathname } = router;

    let name = session?.studentData?.name;
    let displayName = name && name?.length ? name?.match(/\b(\w)/g).join('') : "";

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if(session == null && !excludeLoginPopup?.includes(pathname)) {
            // show login modal popup
            handleLoginButtonClick();
        }
    }, [session,pathname]);

    const redirectToLandingPage = () => {
        setShowLoginModal(false);
        setShowSignupModal(false);
        setShowForgotPassModal(false);
        setShowResetPassModal(false);
        router.push({
            pathname: '/'
        })
    }

    let handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    let handleClose = () => {
        setAnchorEl(null);
    };

    const handleLoginButtonClick = () => {
        setShowLoginModal(true);
    };

    const handleSignupButtonClick = () => {
        setShowSignupModal(true);
    }

    const handleLoginModalClose = () => {
        console.log(session,status, "---------------------sessionStatus--------------");
        setShowLoginModal(false);
    }

    const handleSignupModalClose = () => {
        setShowSignupModal(false);
    }

    const handleForgotPassModalClose = () => {
        setShowForgotPassModal(false);
    }

    const handleForgotPassModalBackClick = () => {
        setShowForgotPassModal(false);
        setShowLoginModal(true);
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

    const handleResetPassModalClose = () => {
        setShowResetPassModal(false);
    }

    return (
        <header className={styles.headerStyle}>
            {/* <Grid container spacing={0}> */}
                <Grid container spacing={0} className={styles.headerMainSection}>
                    <Grid item lg={6} md={6} sm={12} xs={6} xl={6} className={styles.headerImageSection}>
                        <Image src={appLogo} width={150} height={25} alt="appLogo"/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={6} xl={6}>
                        {
                            !session ?
                                <Grid container>
                                    <Grid item lg={4} md={0} sm={0} xs={0} xl={6}></Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={6} xl={3} className={styles.textAlignRight}>
                                        <Button className={styles.signUpButton} onClick={handleSignupButtonClick}>
                                            Sign up
                                        </Button>
                                        {
                                            showSignupModal ?
                                                <Signup
                                                    open={showSignupModal}
                                                    handleClose={handleSignupModalClose}
                                                    openLoginModal={openLoginModal}
                                                />
                                            : null
                                        }
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={6} xl={3} className={styles.textAlignRight}>
                                        <Button className={styles.loginButton} onClick={handleLoginButtonClick}>
                                            Login
                                        </Button>
                                        {
                                            showLoginModal ?
                                                <Login
                                                    open={showLoginModal}
                                                    handleClose={session ? handleLoginModalClose : redirectToLandingPage}
                                                    openSignupModal={openSignupModal}
                                                    openForgotPassModal={openForgotPassModal}
                                                />
                                            : null
                                        }
                                        {
                                            showForgotPassModal ?
                                                <ForgotPassword
                                                    open={showForgotPassModal}
                                                    handleClose={session ? handleForgotPassModalClose : redirectToLandingPage}
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
                                                    handleClose={session ? handleResetPassModalClose : redirectToLandingPage}
                                                />
                                            : null
                                        }
                                    </Grid>
                                </Grid>
                            :
                                <div className={styles.profileIconSection}>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        className={styles.profileActionBtn}
                                    >
                                        {displayName}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                        style={{ paddingRight : "0px !important"}}
                                    >
                                        <MenuItem
                                            className={styles.profileActionMenu}
                                        >
                                            <ListItemIcon>
                                                <Person fontSize="small" className={styles.menuIcon}/>
                                            </ListItemIcon>
                                            Profile
                                        </MenuItem>
                                        <MenuItem
                                            className={styles.profileActionMenu}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                signOut();
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Logout fontSize="small" className={styles.menuIcon}/>
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                        }
                    </Grid>
                </Grid>
            {/* </Grid> */}
        </header>
    );
}

export default Header;