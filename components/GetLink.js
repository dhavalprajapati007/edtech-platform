import { Button, CircularProgress, FormControl, Grid, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import styles from '../styles/GetLink.module.css';
import { toastAlert } from '../helpers/toastAlert';

const GetLink = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const sendAppLink = async() => {
        try {
            setLoading(true);

            let URL = `/api/sms/send-sms`;

            let body = {
                mobileNumber: parseInt(contactNumber),
            };
            
            let reqObj = {
                method: "POST",
                body: JSON.stringify(body)
            };

            let data = await requestAPI(URL,reqObj);

            if(data && data?.statusCode == 200) {
                setLoading(false);
                toastAlert(data.message,"success");
            } else {
                setLoading(false);
                toastAlert(data.message,"error");
                console.log(data.message,"errorInSendAppLink");
            }
        } catch(e) {
            setLoading(false);
            toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
            console.log(e,"errorInCatchBlock");
        }
    }

    return (
        <Grid container>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Grid container>
                    <Grid item xl={2} lg={2} md={3} sm={4} xs={4}>
                        <FormControl className={styles.inputField}>
                            <OutlinedInput
                                className={styles.countryIsoCode}
                                type="text"
                                disabled={true}
                                name="countryCode"
                                value={'+91'}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xl={7} lg={8} md={9} sm={8} xs={8}>
                        <FormControl className={styles.inputField}>
                            <OutlinedInput
                                className={styles.contactNumberField}
                                placeholder="Enter your 10 digit mobile number"
                                onChange={(evt) => setContactNumber(evt.target.value)}
                                type="number"
                                name="contactNumber"
                                value={contactNumber}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xl={3} lg={2} md={12} sm={12} xs={12}>
                        <Button
                            className={styles.getTheAppLinkBtn}
                            onClick={() => sendAppLink()}
                        >
                            {loading ?
                                <CircularProgress
                                    sx={{ color: 'var(--white)' }}
                                    size={20}
                                /> : 'Get Link'
                            }
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default GetLink;