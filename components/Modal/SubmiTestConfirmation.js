import React from 'react';
import { Modal, Box, Grid, Button } from '@mui/material';
import { formatTime } from '../../helpers/helper';
import styles from "../../styles/SubmiTestConfirmation.module.css";

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

const SubmiTestConfirmation = ({ open, handleClose, remainingTime, handleSubmit }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalWidth}>
                    <Grid container>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.contentCenter}>
                            <h4>Time Left {formatTime(remainingTime)}</h4>
                            <p className={styles.confirmationText}>Do you want to submit test?</p>
                        </Grid>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.contentCenter}>
                            <Button
                                onClick={handleSubmit}
                                className={styles.submitBtn}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default SubmiTestConfirmation;