import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Box, CircularProgress, FormControl, Grid, InputAdornment, OutlinedInput } from '@mui/material';
import styles from "../../styles/Signup.module.css";
import Image from 'next/image';
import { useRouter } from 'next/router';
import showImg from "../../public/assets/images/Show.png";
import hideImg from "../../public/assets/images/Hide.png";
import GoogleLogo from "../../public/assets/images/GoogleLogo.png";
import { signupUserValidation } from '../../validations/auth.validation';
import { signIn } from 'next-auth/react';
import { toastAlert } from '../../helpers/toastAlert';
import { requestAPI } from '../../helpers/apiHelper';

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

const Signup = ({ open, handleClose, openLoginModal }) => {
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState();
    const [fullName, setFullName] = useState("");
    const [googleSignInLoader, setGoogleSignInLoader] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e) => {
        try {
            e.preventDefault();

            // set Loading to true
            setLoading(true);

            let body = {
                email,
                mobile,
                fullName,
                password
            }

            // fields check
            let validationMessage = await signupUserValidation(body);
            if(validationMessage) {
                setLoading(false);
                toastAlert(validationMessage,"error");
                return;
            };

            let URL = '/api/auth/signup';

            let reqObj = {
                method: 'POST',
                body: JSON.stringify(body)
            };

            // get the data
            let res = await requestAPI(URL,reqObj);

            if(res && res?.statusCode == 200) {
                setLoading(false);
                openLoginModal();
                toastAlert(res.message,"success");
            }else {
                console.log('error while signup : ', res, res.message);
                toastAlert(res.message,"error");
                setLoading(false);
            }
        } catch(e) {
            setLoading(false);
            console.log(e,"errorInCatchBlock");
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
        }
    };

    // Google Handler function
    const handleGoogleSignin = async () => {
        setGoogleSignInLoader(true);
        await signIn('google', { callbackUrl : process.env.NEXTAUTH_URL });
        setGoogleSignInLoader(false);
    }
    
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalBoxWidth}>
                    <Grid container spacing={1} className={styles.signUpSection}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container className={styles.signUpForm}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.signUpFormTextSection}>
                                            <h1>Getting Started</h1>
                                            <p>Create an account to continue</p>
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
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
                                                        <OutlinedInput
                                                            placeholder="Full Name"
                                                            onChange={(evt) => setFullName(evt.target.value)}
                                                            type="text"
                                                            name="fullName"
                                                            value={fullName}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
                                                        <OutlinedInput
                                                            placeholder="Phone number"
                                                            onChange={(evt) => setMobile(evt.target.value)}
                                                            type="tel"
                                                            name="phoneNumber"
                                                            value={mobile}
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
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Button 
                                                        className={styles.signUpBtn}
                                                        onClick={(e) => handleSignUp(e)}
                                                    >
                                                        {loading ?
                                                            <CircularProgress
                                                                sx={{ color: 'var(--white)' }}
                                                                size={20}
                                                            /> : 'Sign up'
                                                        }
                                                    </Button>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.lastRow}>
                                                    <span className={styles.accountSection}>Already have an account?</span>
                                                    <span className={styles.loginLink} onClick={openLoginModal}>Sign in?</span>
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

export default Signup;