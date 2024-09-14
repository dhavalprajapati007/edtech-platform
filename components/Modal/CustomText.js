import { Box, Modal } from '@mui/material';
import React from 'react';
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

const CustomText = ({ open, handleClose, text }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalWidth}>
                    <h3>{text}</h3>
                </Box>
            </Modal>
        </div>
    )
}

export default CustomText;