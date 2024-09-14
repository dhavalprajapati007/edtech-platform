import { Button, Grid } from '@mui/material';
import React from 'react';
import styles from '../styles/DynamicCard.module.css';
import { useRouter } from 'next/router';

const DynamicCard = ({ data, idx }) => {
    const router = useRouter();

    // redirect user to home page and passed department id as params 
    const redirectToHome = (id) => {
        router.push({
            pathname: '/home',
            query: { id }
        })
    }

    return (
        <Grid container className={idx%2 === 1 ? styles.oddParentContainer : styles.evenParentContainer}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.cardMainContainer}>
                <Grid container className={styles.departmentTitleSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.userCountSection}>
                        <div className={styles.userText}>
                            {data?.users} Users
                        </div>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <h6 title={data.department} className={styles.departmentText}>
                            {data.department}
                        </h6> 
                    </Grid>
                </Grid>
                {/* <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeDepartmentTitleSection}>
                        <span className={styles.departmentText}>Exam : {data.exam}</span>
                    </Grid>
                </Grid> */}
                <Grid container className={styles.featuresSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <ul>
                            {data.features?.map((feature,i) => (
                                <li className={styles.featureContent} key={i}>{feature}</li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
                <Grid container className={styles.buttonSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Button
                            className={styles.getStartedButton}
                            onClick={() => redirectToHome(data.id)}
                        >
                            Get Started
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DynamicCard;