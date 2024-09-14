import { Box, Modal } from '@mui/material';
import React from 'react';
import LatexMarkup from '../LatexMarkup';
import styles from '../../styles/Instruction.module.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    height: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const Instruction = ({ open, handleClose, instruction }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.verticalOverflowProp}>
                    <LatexMarkup
                        latex={instruction ?? instruction }
                        suppressHydrationWarning
                    />
                </Box>
            </Modal>
        </div>
    )
}

export default Instruction