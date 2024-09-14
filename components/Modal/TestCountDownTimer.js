import { Box, Grid, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from "../../styles/TestCountDownTimer.module.css";
import { formatTime } from '../../helpers/helper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    justifyContent : "center",
    display: "flex",
};

const TestCountDownTimer = ({ open, redirect }) => {
    const [remainingTime, setRemainingTime] = useState(4);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime((prevTime) => {
                if(prevTime === 1) {
                    redirect();
                };
                if(prevTime <= 0) {
                    clearInterval(intervalId);
                    return 0;
                };
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [remainingTime]);

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalWidth}>
                    <Grid container>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.textCenter}>
                            <h5>You&apos;ll be redirected to test page within</h5>
                        </Grid>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.textCenter}>
                            <h5><span className={styles.timeInSeconds}>{formatTime(remainingTime)}</span> seconds</h5>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default TestCountDownTimer;