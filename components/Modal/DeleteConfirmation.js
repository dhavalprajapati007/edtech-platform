import React from 'react';
import { Modal, Box, Grid, Button } from '@mui/material';
import styles from "../../styles/SubmiTestConfirmation.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

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

const DeleteConfirmation = ({ open, handleClose, handleDelete }) => {
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
                            <p className={styles.confirmationText}>
                                Are you sure you want to delete this?
                            </p>
                        </Grid>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.contentCenter}>
                            <Grid container>
                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.deleteBtnGrid}>
                                    <Button
                                        onClick={handleDelete}
                                        className={styles.submitBtn}
                                    >
                                        Delete
                                        <DeleteIcon/>
                                    </Button>
                                </Grid>
                                <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.cancelBtnGrid}>
                                    <Button
                                        onClick={handleClose}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                        <CancelIcon/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default DeleteConfirmation;