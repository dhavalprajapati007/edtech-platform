import { Button, Grid } from '@mui/material';
import React from 'react';
import styles from '../styles/DynamicCardWithPrice.module.css';

const DynamicCardWithPrice = ({ data }) => {
    return (
        <Grid container className={styles.parentContainer}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.cardMainGrid}>
                <Grid container className={styles.storeDepartmentUpperSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Grid container className={styles.userAndExamSection}>
                            <Grid item xl={9} lg={9} md={9} sm={9} xs={9} className={styles.examNameGrid}>
                                <span className={styles.examName}>Target: GATE 2024</span>
                            </Grid>
                            <Grid item xl={3} lg={3} md={3} sm={3} xs={3} className={styles.userCountGrid}>
                                <span className={styles.userCountText}>15k Users</span>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.deptTitleGrid}>
                        <span className={styles.departmentTitle}>{data.title}</span>
                    </Grid>
                </Grid>
                <Grid container className={styles.storeDepartmentTitleContainer}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeDepartmentTitleSection}>
                        <span className={styles.departmentText}>{data.department?.title}</span>
                    </Grid>
                </Grid>
                <Grid container className={styles.featuresSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <ul>
                            {JSON.parse(data.description)?.map((desc,i) => (
                                <li className={styles.featureContent} key={i}>{desc}</li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.subScriptionValidityGrid}>
                        <span className={styles.subScriptionValidity}>Subscription valid till : 15th Feb 2024</span>
                    </Grid>
                </Grid>
                <Grid container className={styles.discountMainContainer}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.discountContainer}>
                        <span>10% discount</span>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.costSection}>
                        <Grid container className={styles.costContainer}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={7} className={styles.costActual}>
                                <span>Cost: </span>
                                <span className={styles.actualPrice}>Rs. {data.actualPrice}</span>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={5} className={styles.costDiscount}>
                                <span className={styles.discountedPrice}>Rs. 50</span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={styles.buttonSection}>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Grid container>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Button className={styles.previewButton}>Preview</Button>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Button className={styles.subscribeButton}>Subscribe</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DynamicCardWithPrice;