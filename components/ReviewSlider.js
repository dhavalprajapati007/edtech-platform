import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar, Grid } from "@mui/material";
import styles from "../styles/ReviewSlider.module.css"
import doubleQuote from "../public/assets/images/doubleQuote.png"
import Image from "next/image";

const ReviewSlider = ({ reviews }) => {
    const [review, setReview] = useState([]);

    useEffect(() => {
        const updateReviews = async() => {
            let data = await reviews?.map(review => ({
                ...review,
                showFullReview: false
            }));

            if(data?.length) {
                setReview(data);
            }else {
                setReview([
                    {
                        photo: "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg",
                        username: "Priyanka Yadav",
                        designation: "Google Play Review",
                        comment: "So far the best app I discovered. Its very smooth to use,the categorization of questions on yearly basis in a simple manner makes it really easy to access unlike other apps. A request from a genuine user- please try to exapnd the base by including other subjects as well.",
                        department:"All",
                        showFullReview: false
                    },
                    {
                        photo: "https://t4.ftcdn.net/jpg/02/79/66/93/360_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg",
                        username: "Adarkhi Kalpana",
                        designation: "Google Play Review",
                        comment: "This is a very good app, if I want to prepare the gate in a short time, then there will be no better app than this, I like the subject wise question given in it and many more",
                        department: "Biomedical Engineering",
                        showFullReview: false
                    },
                    {
                        photo: "https://img.freepik.com/premium-vector/businessman-profile-cartoon_18591-58481.jpg",
                        username: "Madhur Saini",
                        designation: "Google Play Store",
                        comment: "One of the best free app for the gate preparation. It includes all previous year along with there solution. Highly recommend this app.",
                        department:"Aerospace Engineering",
                        showFullReview: false
                    },
                    {
                        photo: "https://i0.wp.com/moovmynt.com/wp-content/uploads/2021/09/Sunil-2.png?fit=538%2C608&ssl=1",
                        username: "Saurav Yadav",
                        designation: "Google Play Review",
                        comment: "This is exactly the app I was looking for GATE preparation. Makes life so so easy. The app lets me read all previous year papers on the go. The fonts & aesthetics of solution goes easy on my eyes and let me focus more on the solutions.",
                        department:"Chemical Engineering",
                        showFullReview: false
                    },
                    {
                        photo: "https://moovmynt.com/wp-content/uploads/2021/09/Sunny-2.png",
                        username: "Pradeep Reddy",
                        designation: "Google Play Review",
                        comment: "Very good and user friendly application. Electrical all solutions available with complete explanation. Thankyou.",
                        department:"Chemical Engineering",
                        showFullReview: false
                    },
                    {
                        photo: "https://i0.wp.com/moovmynt.com/wp-content/uploads/2021/09/Indy-2.png?fit=586%2C602&ssl=1",
                        username: "Ankit Sahu",
                        designation: "Google Play Review",
                        comment: "Very helpful for gate aspirants. Impressive test mode feature for solving previous year problems. Looking forward to your new product launches..",
                        department:"Electrical Engineering",
                        showFullReview: false
                    },
                    {
                        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNI3kQLeYMnpy05PhEiuzS1rtRmNVL7VKvwcE4ACmQSQT1rRmUO5mHLyjH-mGHq0ueUQY&usqp=CAU",
                        username: "Susmitha Sree Pilla",
                        designation: "Google Play Review",
                        comment: "Probably the best app for gate which I came across in recent times, making easy for gate aspirants to access previous year papers and test series",
                        department:"Electrical Engineering",
                        showFullReview: false
                    },
                ])
            }
        }
        updateReviews();
    }, [reviews]);

    let settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: review?.length > 3 ? 3 : review?.length,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1482,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1481,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
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
    
    const setShowFullReview = (val,i) => {
        const newReviewData = [...review];
        newReviewData[i].showFullReview = !val;
        setReview(newReviewData);
    }

    return (
        <Slider {...settings}>
            {review?.map((elem, i) => (
                <div className={styles.sliderCard} key={i}>
                    <Grid container className={styles.reviewSection}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container>
                                <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
                                    <Avatar src={elem.photo} alt="profileImage" className={styles.profileImage}/>
                                </Grid>
                                
                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                    <Image src={doubleQuote} width={25} height={35} alt="quotationMark"/>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    {elem.showFullReview ? 
                                        <p className={styles.review}>&quot;{elem.comment}&quot;</p> 
                                    :
                                        <p className={styles.review}>&quot;{elem?.comment.length > 150 ? elem?.comment?.substr(0, 150) + '...' : elem?.comment}&quot;</p>
                                    }
                                    {
                                        elem?.comment?.length > 150 && (
                                            <span
                                                style={{ cursor : "pointer"}}
                                                onClick={() => setShowFullReview(elem.showFullReview,i)}
                                            >
                                                {elem?.showFullReview ? 'Read Less' : 'Read More'}
                                            </span>
                                        )
                                    }
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container>
                                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10} className={styles.reviewInfoSection}>
                                            <Grid container spacing={1}>
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.reviewerInfo}>
                                                    <span className={styles.userName}>{elem.username}</span>
                                                    <span className={styles.designation}>{elem.designation}</span>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            ))}
        </Slider>
    );
}

export default ReviewSlider;