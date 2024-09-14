import { Button, CircularProgress, FormControl, Grid, InputAdornment, OutlinedInput } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from "../styles/ResetPassword.module.css";
import LogoWithoutText from "../public/assets/images/LogoWithoutText.png";
import showImg from "../public/assets/images/Show.png";
import hideImg from "../public/assets/images/Hide.png";
import Image from 'next/image';
import Link from 'next/link';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("Dhawal@2023");
    const [confirmPassword, setConfirmPassword] = useState("Dhawal@2023");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const resetPassword = async () => {
        alert("resetPassCalled");
    }

    return (
        <>
            <Head>
                <title>Set2Score-ResetPassword</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="GATE, Set2Score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Grid container spacing={1} className={styles.resetPasswordSection}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.imageAndLinkSection}>
                            <Image src={LogoWithoutText} alt="appLogo"/>
                            <Link href="/" className={styles.backHomeLink}>BACK HOME</Link>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container className={styles.resetPasswordForm}>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.resetPasswordFormTextSection}>
                                    <h1>Reset Password</h1>
                                    <p>change your password</p>
                                </Grid>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <form>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <FormControl>
                                                <OutlinedInput
                                                    placeholder="Password"
                                                    onChange={(evt) => setPassword(evt.target.value)}
                                                    name="password"
                                                    type={showPass ? 'text' : 'password'}
                                                    value={password}
                                                    autoComplete="on"
                                                    endAdornment={
                                                        <InputAdornment position="start">
                                                        {
                                                            showPass ? 
                                                                <Image 
                                                                    src={showImg}
                                                                    alt="showPassword"
                                                                    className={styles.togglePassword}
                                                                    onClick={() => setShowPass(!showPass)}
                                                                />
                                                            :
                                                                <Image 
                                                                    src={hideImg}
                                                                    alt="hidePassword"
                                                                    className={styles.togglePassword}
                                                                    onClick={() => setShowPass(!showPass)}
                                                                />
                                                        }
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <FormControl>
                                                <OutlinedInput
                                                    placeholder="Confirm Password"
                                                    onChange={(evt) => setConfirmPassword(evt.target.value)}
                                                    name="password"
                                                    type={showConfirmPass ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    autoComplete="on"
                                                    endAdornment={
                                                        <InputAdornment position="start">
                                                        {
                                                            showConfirmPass ? 
                                                                <Image 
                                                                    src={showImg}
                                                                    alt="showPassword"
                                                                    className={styles.togglePassword}
                                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                                />
                                                            :
                                                                <Image 
                                                                    src={hideImg}
                                                                    alt="hidePassword"
                                                                    className={styles.togglePassword}
                                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                                />
                                                        }
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <Button
                                                className={styles.resetPasswordBtn}
                                                onClick={() => resetPassword()}
                                            >
                                                {loading ?
                                                    <CircularProgress
                                                        sx={{ color: 'var(--white)' }}
                                                        size={20}
                                                    /> : 'Reset Password'
                                                }
                                            </Button>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default ResetPassword;