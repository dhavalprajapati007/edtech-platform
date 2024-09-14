import { Box, Modal } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import styles from "../../styles/Feed.module.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    justifyContent : "center",
    display: "flex",
};

const ImagePopup = ({ open, handleClose, image }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.modalWidth}>
                    <Image
                        src={image}
                        alt="feedImage"
                        className={styles.modalImageDimension}
                        width={1000}
                        height={700}
                    />
                </Box>
            </Modal>
        </div>
    )
};

export default ImagePopup;