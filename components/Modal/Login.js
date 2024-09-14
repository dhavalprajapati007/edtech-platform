import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputAdornment, OutlinedInput } from '@mui/material';
import styles from "../../styles/Login.module.css"
import { useRouter } from 'next/router';
import showImg from "../../public/assets/images/Show.png";
import hideImg from "../../public/assets/images/Hide.png";
import GoogleLogo from "../../public/assets/images/GoogleLogo.png";
import Image from 'next/image';
import { loginUserValidation } from '../../validations/auth.validation';
import { signIn, useSession } from 'next-auth/react';
import { toastAlert } from '../../helpers/toastAlert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const Login = ({ open, handleClose, openSignupModal, openForgotPassModal }) => {
    const [email, setEmail] = React.useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [googleSignInLoader, setGoogleSignInLoader] = useState(false);
    const router = useRouter();
    const { pathname } = router;
    const { data: session, status } = useSession();

    // Google Handler function
    const handleGoogleSignin = async () => {
        setGoogleSignInLoader(true);
        await signIn('google', { callbackUrl : process.env.NEXTAUTH_URL });
        setGoogleSignInLoader(false);
    }

    const onSubmit = async(e) => {
        try {
            e.preventDefault();
            setLoading(true);

            let body = {
                email,
                password
            }

            // fields check
            let validationMessage = await loginUserValidation(body);
            if(validationMessage) {
                toastAlert(validationMessage,"error");
                setLoading(false);
                return;
            }

            const status = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
                callbackUrl: "/",
            })

            if(status?.ok) {
                setLoading(false);
                handleClose();
                console.log(status,"loginStatusResponse");
                toastAlert("Student Login Successfully","success");
                router.push(status.url)
            }else {
                setLoading(false);
                console.log(status,"errorInLoginUsingCredentials");
                toastAlert(status?.error,"error");
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"error");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalBoxWidth}>
                    <Grid container spacing={1} className={styles.loginSection}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container className={styles.loginForm}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.loginFormTextSection}>
                                            <h1>Login</h1>
                                            {
                                                session == null && pathname !== '/home' && pathname !== '/' ?
                                                    <>
                                                        <span>Please, don&apos;t close this</span>
                                                        <span>sign in to get the exclusive content</span>
                                                    </>
                                                :
                                                    <p>sign in to continue</p>
                                            }
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <form>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
                                                        <OutlinedInput
                                                            placeholder="Email address"
                                                            onChange={(evt) => setEmail(evt.target.value)}
                                                            type="email"
                                                            name="email"
                                                            value={email}
                                                            // startAdornment={
                                                            //     <InputAdornment position="start">
                                                            //         <PersonIcon style={{ color: "#a6a4b0" }} />
                                                            //     </InputAdornment>
                                                            // }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
                                                        <OutlinedInput
                                                            placeholder="Password"
                                                            onChange={(evt) => setPassword(evt.target.value)}
                                                            name="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={password}
                                                            autoComplete="on"
                                                            // startAdornment={
                                                            //     <InputAdornment position="start">
                                                            //         <LockIcon style={{ color: "#a6a4b0" }} />
                                                            //     </InputAdornment>
                                                            // }
                                                            endAdornment={
                                                                <InputAdornment position="start">
                                                                {
                                                                    showPassword ? 
                                                                        <Image
                                                                            src={showImg}
                                                                            alt="showPassword"
                                                                            className={styles.togglePassword}
                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                        />
                                                                    :
                                                                        <Image 
                                                                            src={hideImg}
                                                                            alt="hidePassword"
                                                                            className={styles.togglePassword}
                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                        />
                                                                }
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.checkBoxAndBtnSection}>
                                                    <FormControlLabel
                                                        label="Remember me"
                                                        control={
                                                            <Checkbox
                                                                className={styles.rememberMecheckbox}
                                                                checked={checked}
                                                                sx={{
                                                                    color: "var(--thm-color)",
                                                                    '&.Mui-checked': {
                                                                        color: "var(--thm-color)",
                                                                    },
                                                                }}
                                                                onChange={(e) => setChecked(e.target.checked)}
                                                            />
                                                        }
                                                    />
                                                    <span
                                                        className={styles.forgetPasswordLink}
                                                        onClick={openForgotPassModal}
                                                    >
                                                        Forget password?
                                                    </span>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Button 
                                                        className={styles.loginBtn}
                                                        // onClick={(e) => loginUsingEmail(e)}
                                                        onClick={(e) => onSubmit(e)}
                                                    >
                                                        {loading ?
                                                            <CircularProgress
                                                                sx={{ color: 'var(--white)' }}
                                                                size={20}
                                                            /> : 'Login'
                                                        }
                                                    </Button>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.lastRow}>
                                                    <span className={styles.accountSection}>Don’t have an account?</span>
                                                    <span className={styles.signUpLink} onClick={openSignupModal}>Sign up?</span>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Button
                                                        className={styles.socialSignInButton}
                                                        onClick={handleGoogleSignin}
                                                    >
                                                        {googleSignInLoader ?
                                                            <CircularProgress
                                                                sx={{ color: 'var(--white)' }}
                                                                size={20}
                                                            /> 
                                                        :
                                                            <>
                                                                <span className={styles.signInText}>Sign In With Google</span>
                                                                <Image 
                                                                    src={GoogleLogo}
                                                                    height={20}
                                                                    width={20}
                                                                    alt="googleLogo"
                                                                />
                                                            </>
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
                </Box>
            </Modal>
        </div>
    );
}

export default Login;