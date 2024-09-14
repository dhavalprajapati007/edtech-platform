import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/FeatureSlider.module.css";
import { Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import DynamicCardWithPrice from './DynamicCardWithPrice';

const FeatureSlider = ({ type, data }) => {
    const router = useRouter();
    const arr = [
        {   exam: "GATE",
            department: "Aerospace Engineering",
            users: "3k+",
            id: "63da9453776659555ccdfae6",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Agricultural Engineering",
            id: "63da9495776659555ccdfaea",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam:"GATE",
            department: "Architecture and Planning",
            id: "63da94c2776659555ccdfaee",
            users: "150k",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Biomedical Engineering",
            id: "63da9507776659555ccdfaf2",
            users: "150k",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam:"GATE",
            department: "Biotechnology",
            id: "63da9535776659555ccdfaf6",
            users: "5k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Chemical Engineering",
            id: "63da9563776659555ccdfafa",
            users: "15k+",
            features: [
                "30+ years previous papers with solutions.",
                "Subject-wise previous year paper available",
                "6000+ Practice questions",
                "General Aptitude & Engineering mathematics +4 Free mock tests.",
                "Full length & subjectwise test series available"
            ],
        },
        {
            exam:"GATE",
            department: "Chemistry",
            id: "63da957d776659555ccdfafe",
            users: "10k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "4000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Civil Engineering",
            id: "63da95ac776659555ccdfb02",
            users: "15k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "3000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Computer Science and Information Technology",
            id: "63da95c7776659555ccdfb06",
            users: "15k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam:"GATE",
            department: "Ecology and Evolution",
            id: "63da95e8776659555ccdfb0a",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Electrical Engineering",
            id: "63da9609776659555ccdfb0e",
            users: "25k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "5000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Electronics and Communication Engineering",
            id: "63da962a776659555ccdfb12",
            users: "10k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "3000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Engineering Science",
            id: "63da964c776659555ccdfb16",
            users: "5k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2500+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Environment Science & Engineering",
            id: "63da966d776659555ccdfb1a",
            users: "2k",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Geomatics Engineering",
            id: "63da9696776659555ccdfb1e",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Geology and Geophysics",
            id: "63da96d1776659555ccdfb22",
            users: "3k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Humanities & Social Science",
            id: "63da975a776659555ccdfb2a",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Instrumentation Engineering",
            id: "63da978d776659555ccdfb2e",
            users: "5k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Life Sciences",
            id: "63dab007776659555ccdfb40",
            users: "5k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Chemistry Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Mathematics",
            id: "63dab05f776659555ccdfb44",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Mechanical Engineering",
            id: "63dab079776659555ccdfb48",
            users: "20k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "8000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests.",
                "10 Full-length & 3 each Subject test series available"
            ]
        },
        {
            exam: "GATE",
            department: "Metallurgical Engineering",
            id: "63dab097776659555ccdfb4c",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Mining Engineering",
            id: "63dab0b3776659555ccdfb50",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Naval Architecture and marine Engineering",
            id: "63dab0ff776659555ccdfb54",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Petroleum Engineering",
            id: "63dab15d776659555ccdfb58",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Physics",
            id: "63dab314776659555ccdfb5c",
            users: "5k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Production and Industrial Engineering",
            id: "63dab86e776659555ccdfb60",
            users: "2k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "2000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Statics",
            id: "63dab8a0776659555ccdfb64",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Textile Engineering and Fibre Science",
            id: "63dab8bf776659555ccdfb68",
            users: "1k+",
            features: [
                "All Previous years papers with solutions.",
                "All previous years papers available in subjectwise",
                "1000+ Practice questions",
                "General Aptitude & Engineering mathematics Free mock tests."
            ]
        },
        {
            exam: "GATE",
            department: "Textile Engineering and Fibre Science",
            id: "63dab8bf776659555ccdfb68",
            users: "1k+",
            features: [
                "2000-2022 past years papers with solutions.",
                "More than 10,000+ practice questions.",
                "Best quality Test series questions.",
                "Free mock tests."
            ]
        },
    ];

    const redirectToHome = (id) => {
        router.push({
            pathname: '/home',
            query: { id }
        })
    }

    let settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: type === "store" ? data && data?.length > 4 ? 4 : data?.length : arr?.length > 4 ? 4 : arr?.length,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1420,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 725,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Slider {...settings}>
            {type !== "store" ? 
                arr?.map((elem, i) => (
                    <div className={styles.sliderCard} key={i}>
                        <div className={styles.cardDiv}>
                            <Grid className={styles.reviewSection}>
                                <Grid container className={styles.departmentTitleSection}>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.userCountSection}>
                                        <div className={styles.userText}>
                                            {elem.users} Users
                                        </div>
                                    </Grid>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <h6 title={elem.department}>
                                            {elem.department?.length > 20 ? elem.department.substr(0,20) + '...' : elem.department}
                                        </h6>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeDepartmentTitleSection}>
                                        <span className={styles.departmentText}>Exam : {elem.exam}</span>
                                    </Grid>
                                </Grid>
                                <Grid container className={styles.featuresSection}>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <ul>
                                            {elem.features?.map((feature,i) => (
                                                <li className={styles.featureContent} key={i}>{feature}</li>
                                            ))}
                                        </ul>
                                    </Grid>
                                </Grid>
                                <Grid container className={styles.buttonSection}>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Button
                                            className={styles.getStartedButton}
                                            onClick={() => redirectToHome(elem.id)}
                                        >
                                            Get Started
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                ))
            :
                data?.length ?
                    data?.map((value, index) => (
                        <React.Fragment key={index}>
                            <DynamicCardWithPrice
                                data={value}
                                idx={index}
                            />
                        </React.Fragment>
                        // <div className={styles.storeSliderCard} key={i}>
                        //     <div className={styles.storeCardDiv}>
                        //         <Grid className={styles.reviewSection}>
                        //             <Grid container className={styles.storeDepartmentUpperSection}>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.userCountSection}>
                        //                     <div className={styles.userText}>
                        //                         150k Users
                        //                     </div>
                        //                 </Grid>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        //                     <h6 title={elem?.title}>{elem?.title?.length > 20 ? elem?.title.substr(0,20) + '...' : elem?.title}</h6>
                        //                 </Grid>
                        //             </Grid>
                        //             <Grid container>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.storeDepartmentTitleSection}>
                        //                     <span className={styles.departmentText}>Department : {elem.department?.title}</span>
                        //                 </Grid>
                        //             </Grid>
                        //             <Grid container className={styles.featuresSection}>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        //                     <ul>
                        //                         {JSON.parse(elem.description)?.map((desc,i) => (
                        //                             <li className={styles.featureContent} key={i}>{desc}</li>
                        //                         ))}
                        //                     </ul>
                        //                 </Grid>
                        //             </Grid>
                        //             <Grid container>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.priceSection}>
                        //                     <span>Rs. {elem.actualPrice}</span>
                        //                 </Grid>
                        //             </Grid>
                        //             <Grid container className={styles.buttonSection}>
                        //                 <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        //                     <Button className={styles.previewButton}>Preview</Button>
                        //                     <Button className={styles.subscribeButton}>Subscribe</Button>
                        //                 </Grid>
                        //             </Grid>
                        //         </Grid>
                        //     </div>
                        // </div>
                    ))
                :
                    <p>Data Not Found</p>
        }
        </Slider>
    )
}

export default FeatureSlider;