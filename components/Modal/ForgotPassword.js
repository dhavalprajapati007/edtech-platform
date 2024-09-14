import { Box, Button, CircularProgress, FormControl, Grid, Modal, OutlinedInput } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from "../../styles/ForgotPassword.module.css";
import LogoWithoutText from "../../public/assets/images/LogoWithoutText.png";
import { forgotPasswordValidation } from '../../validations/auth.validation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

const ForgotPassword = ({ open, handleClose, openResetPassModal, handleBackClick }) => {
    const [email, setEmail] = useState("");
    const [sendLoader, setSendLoader] = useState(false);
    const [error, setError] = useState("");

    const sendToken = async () => {
        try {
            setError('');
            setSendLoader(true);

            let body = {
                email
            };

            // fields check
            let validationMessage = await forgotPasswordValidation(body);
            if(validationMessage) {
                setError(validationMessage);
                setSendLoader(false);
                return;
            };

            let URL = '/api/auth/forgot-password';

            let reqObj = {
                method: "POST",
                body : JSON.stringify(body)
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200 && data.data.status) {
                setSendLoader(false);
                toastAlert(data.message,"success");
                openResetPassModal(email);
            } else {
                setSendLoader(false);
                toastAlert(data.message,"error");
                console.log(data.message,"errorInForgotPassword");
            }
        } catch(e) {
            setSendLoader(false);
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
                    <Grid container spacing={1} className={styles.forgotPasswordSection}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container className={styles.forgotPasswordForm}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.backBtnGrid}>
                                            <Button
                                                className={styles.backToLoginBtn}
                                                onClick={() => handleBackClick()}
                                            >
                                                <ArrowBackIcon
                                                    className={styles.backIcon}
                                                />
                                                Back
                                            </Button>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.forgotPasswordFormTextSection}>
                                            <Image src={LogoWithoutText} alt="appLogo"/>
                                            <h1>Forgot Password</h1>
                                            <p>send reset token</p>
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
                                                        {
                                                            error?.length ?
                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                    <span className={styles.errorMessage}>{error}</span>
                                                                </Grid>
                                                            : null
                                                        }
                                                    </FormControl>
                                                </Grid>
                                                
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.btnSection}>
                                                    <Button
                                                        className={styles.sendAndVerifyTokenBtn}
                                                        onClick={() => sendToken()}
                                                    >
                                                        {sendLoader ?
                                                            <CircularProgress
                                                                sx={{ color: 'var(--white)' }}
                                                                size={20}
                                                            /> : 'Send'
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

export default ForgotPassword;