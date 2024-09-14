import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Modal } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import styles from "../../styles/SelectSubject.module.css"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    background: '#E6ECE7',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

const SelectSubject = ({ open, handleClose, data, handleSectionSelect, selectedSections, totalSelectSection, renderModal }) => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.popupModalWidth}>
                    <Grid container>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <p className={styles.selectSubTitle}>{`Select ${totalSelectSection} of your subject`}</p>
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.subjectListOption}>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                            {
                                                data?.map((value,idx) => (
                                                    <FormControlLabel
                                                        key={idx}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedSections.some((sub) => sub._id === value._id) || value.compulsory === 'Yes'}
                                                                disabled={value.compulsory === 'Yes'}
                                                                onChange={() => handleSectionSelect(value)}
                                                            />
                                                        }
                                                        label={value.name}
                                                    />
                                                ))
                                            }
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.btnContainer}>
                                    <Button
                                        disabled={totalSelectSection !== selectedSections.length}
                                        className={totalSelectSection !== selectedSections.length ? styles.startTestBtnDisabled : styles.startTestBtn}
                                        onClick={() => renderModal()}
                                    >
                                        Start test
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

export default SelectSubject;