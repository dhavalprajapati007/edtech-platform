import { Autocomplete, Box, Button, CircularProgress, FormControl, Grid, Modal, OutlinedInput, TextField } from '@mui/material';
import React, { useState } from 'react';
import styles from "../../styles/Report.module.css";
import { useSession } from 'next-auth/react';
import { submitReportValidation } from '../../validations/report.validation';
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
    alignItems: "center",
    justifyContent : "center",
    display: "flex",
};

const Report = ({ open, handleClose, type, referenceId }) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState({});
    const { data: session } = useSession();

    const questionReportType = [
        {
            title: 'Problem in question',
            value: 'problem in question'
        },
        {
            title: 'Problem in solution',
            value: 'problem in solution'
        }
    ];

    const forumReportType = [
        {
            title: 'Inappropriate',
            value: 'inappropriate'
        },
        {
            title: 'Unrelated',
            value: 'unrelated'
        }
    ]

    const handleReportSubmit = async () => {
        try {
            setLoading(true);

            let body = {
                reference: type,
                type: reportType.value ? reportType.value : '',
                comment,
                referenceId
            };

            // fields check
            let validationMessage = await submitReportValidation(body);
            if(validationMessage) {
                setLoading(false);
                return;
            };

            let URL = '/api/reports/submit-report';
            
            let reqObj = {
                method: "POST",
                body : JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                handleClose();
                toastAlert(data.message,"success");
            } else {
                setLoading(false);
                handleClose();
                toastAlert(data.message,"error");
                console.log(data.message,"errorInForgotPassword");
            }
        } catch(e) {
            setLoading(false);
            handleClose();
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
                    <Grid container>
                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <h5>Report</h5>
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Autocomplete
                                        className={styles.autocompleteField}
                                        name="type"
                                        value={reportType}
                                        options={type === 'question' ? questionReportType : forumReportType}
                                        autoHighlight
                                        onChange={(e, val) => setReportType(val)}
                                        getOptionLabel={(option) => option.title ? option.title : ""}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li"
                                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                {...props}
                                            >
                                                {option.title}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className="department-dropdown"
                                                {...params}
                                                label="Type"
                                                placeholder="Select type"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: "off",
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <FormControl className={styles.inputField}>
                                        <OutlinedInput
                                            placeholder="comment"
                                            onChange={(evt) => setComment(evt.target.value)}
                                            type="text"
                                            name="comment"
                                            value={comment}
                                            multiline
                                            className={styles.questionInput}
                                            // style={{ borderRadius: '30px' }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Button
                                        onClick={() => handleReportSubmit()}
                                        className={styles.reportSubmitBtn}
                                    >
                                        {
                                            loading ?
                                                <CircularProgress
                                                    sx={{ color: 'var(--white)'}}
                                                    size={20}
                                                />
                                            : 
                                                "Submit"
                                        }
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

export default Report;