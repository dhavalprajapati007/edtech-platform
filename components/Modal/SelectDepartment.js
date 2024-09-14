import { Autocomplete, Box, Button, CircularProgress, Grid, Modal, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from "../../styles/SelectDepartment.module.css";
import LogoWithoutText from "../../public/assets/images/LogoWithoutText.png";
import Image from 'next/image';
import { saveDepartmentValidation } from '../../validations/department.validation';
import { toastAlert } from '../../helpers/toastAlert';
import { getSession } from 'next-auth/react';
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

const SelectDepartment = ({ open, handleClose, session }) => {
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState({});
    const [departmentData, setdepartmentData] = useState([]);
    const [exam, setExam] = useState({});
    const [examData, setExamData] = useState([]);
    const [isDisable, setIsDisable] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let URL = '/api/exams/get-all-exams';

                let reqObj = {
                    method: "GET",
                    headers: { 'Authorization': session?.studentData?.accessToken }
                };

                let data = await requestAPI(URL,reqObj);

                if(data && data?.statusCode == 200) {
                    setExamData(data?.data?.length ? data?.data : []);
                } else {
                    if(data.statusCode == 401) {
                        handleLogout(router);
                    }
                    toastAlert(data.message,"error");
                    console.log(data.message,"error");              
                }
            } catch (e) {
                toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
                console.log(e,"error");
            }
        };
        fetchData();
    },[]);

    const fetchDepartments = async (id) => {
        try {
            let body = { id };

            let URL = '/api/departments/get-exam-departments';

            let reqObj = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Authorization': session?.studentData?.accessToken }
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setdepartmentData(data?.data?.length && data?.data[0]?.departments && data?.data[0]?.departments?.length ? data?.data[0]?.departments : []);
                setIsDisable(false);
            } else {
                console.log(data.message,"error");
                toastAlert(data.message,"error");
            }
        } catch (e) {
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"error");
        }
    }

    const setExamAndFetchDepartments = async (val) => {
        setExam(val);
        setdepartmentData([]);
        setDepartment({});
        if(val) {
            fetchDepartments(val._id);
        }
    }

    const saveDepartments = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        let body = {
            exam: exam?._id,
            department: department?._id
        }

        // field validation check
        let validationMessage = await saveDepartmentValidation(body);

        if(validationMessage) {
            setError(validationMessage);
            setLoading(false);
            return;
        };

        let URL = '/api/students/update-student';
            
        let reqObj = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Authorization': session?.studentData?.accessToken }
        };

        let res = await requestAPI(URL,reqObj);

        if(res && res?.statusCode == 200) {
            setLoading(false);
            handleClose();
            router.push({
                pathname : '/home'
            })
        }else {
            console.log('error while login : ', res, res.message);
            setLoading(false);
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
                    <Grid container spacing={1} className={styles.selectDeptSection}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.imageAndLinkSection}>
                                    <Image src={LogoWithoutText} alt="appLogo"/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container className={styles.selectDeptForm}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.selectDeptFormTextSection}>
                                            <h1>Student</h1>
                                            <p>Select Exam and Department</p>
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <form>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Autocomplete
                                                        className={styles.autocompleteField}
                                                        name="exam"
                                                        value={exam}
                                                        options={examData}
                                                        autoHighlight
                                                        onChange={(e, val) => setExamAndFetchDepartments(val)}
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
                                                                label="Exam"
                                                                placeholder="Select Exam"
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    autoComplete: "off",
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Autocomplete
                                                        className={styles.autocompleteField}
                                                        name="department"
                                                        disabled={isDisable}
                                                        value={department}
                                                        options={departmentData}
                                                        autoHighlight
                                                        onChange={(e, val) => setDepartment(val)}
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
                                                                label="Department"
                                                                placeholder="Select Department"
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    autoComplete: "off",
                                                                }}
                                                            />
                                                        )}
                                                    />
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
                                                        className={styles.saveInfoBtn}
                                                        onClick={(e) => saveDepartments(e)}
                                                    >
                                                        {loading ?
                                                            <CircularProgress
                                                                sx={{ color: 'var(--white)' }}
                                                                size={20}
                                                            /> : 'Save'
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

export default SelectDepartment;