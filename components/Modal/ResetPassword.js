import { Box, Button, CircularProgress, FormControl, Grid, InputAdornment, Modal, OutlinedInput } from '@mui/material';
import styles from "../../styles/ResetPassword.module.css";
import React, { useState } from 'react';
import Image from 'next/image';
import LogoWithoutText from "../../public/assets/images/LogoWithoutText.png";
import showImg from "../../public/assets/images/Show.png";
import hideImg from "../../public/assets/images/Hide.png";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { resetPasswordValidation } from '../../validations/auth.validation';
import { toastAlert } from '../../helpers/toastAlert';
import { requestAPI } from '../../helpers/apiHelper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const ResetPassword = ({ open, handleClose, email }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');

    const resetPassword = async () => {
        try {
            setError('');
            setLoading(true);

            let body = {
                email,
                token,
                password,
                confirmPassword
            };

            // fields check
            let validationMessage = await resetPasswordValidation(body);
            if(validationMessage) {
                setError(validationMessage);
                setLoading(false);
                return;
            };

            let URL = '/api/auth/reset-password';

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body)
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                toastAlert(data.message,"success");
                handleClose();
            } else {
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"errorInResetPassword");                  
            }
        } catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
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
                    <Grid container spacing={1}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container className={styles.resetPasswordForm}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.resetPasswordFormTextSection}>
                                            <Image src={LogoWithoutText} alt="appLogo"/>
                                            <h1>Reset Password</h1>
                                            <p>Verify token and change your password</p>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <form>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
                                                        <OutlinedInput
                                                            placeholder="Email address"
                                                            disabled={true}
                                                            type="email"
                                                            name="email"
                                                            value={email}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.tokenSection}>
                                                    <MuiOtpInput
                                                        length={6}
                                                        value={token}
                                                        onChange={(newValue) => setToken(newValue)}
                                                    />
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl className={styles.inputField}>
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
                                                    <FormControl className={styles.inputField}>
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
                                                {
                                                    error?.length ?
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <span className={styles.errorMessage}>{error}</span>
                                                        </Grid>
                                                    : null
                                                }
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
                </Box>
            </Modal>
        </div>
    )
}

export default ResetPassword;