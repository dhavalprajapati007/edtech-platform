import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { Autocomplete, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import styles from "../styles/Home.module.css";
import scrollBarStyles from '../styles/Scrollbar.module.css';
import GooglePlayButton from '../components/GooglePlayButton';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FolderIcon from '@mui/icons-material/Folder';
import MinorEllipse from "../public/assets/images/MinorEllipse.png"
import MajorEllipse from "../public/assets/images/MajorEllipse.png"
import SkyBlueRectangle from "../public/assets/images/SkyBlueRectangle.png"
import RectangleShape from '../public/assets/images/RectangleShape.png'
import OrangeCircle from "../public/assets/images/OrangeCircle.png"
import SliderRightVector from "../public/assets/images/SliderRightVector.png"
import ReviewSlider from '../components/ReviewSlider';
import { Box } from '@mui/system';
import FeatureSlider from '../components/FeatureSlider';
import GetTheApp from '../components/GetTheApp';
import { getSession } from 'next-auth/react';
import SocialMediaIcons from '../components/SocialMediaIcons';
import { useRouter } from 'next/router';
import { handleLogout } from '../utils/logout';
import Loader from '../components/Loader';
import { toastAlert } from '../helpers/toastAlert';
import GetLink from '../components/GetLink';
import DynamicCard from '../components/DynamicCard';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const Index = () => {
  const [department, setDepartment] = useState({});
  const [departmentData, setDepartmentData] = useState([]);
  const [popularDepartmentData, setpopularDepartmentData] = useState([
    {
      label: "Chemical Engineering",
      code: "CH",
      id: "63da9563776659555ccdfafa"
    },
    {
      label: "Chemistry",
      code: "CY",
      id: "63da957d776659555ccdfafe"
    },
    {
      label: "Civil Engineering",
      code: "CE",
      id: "63da95ac776659555ccdfb02"
    },
    {
      label: "Computer science Engineering",
      code: "CS",
      id: "63da95c7776659555ccdfb06"
    },
    {
      label: "Electrical Engineering",
      code: "EE",
      id: "63da9609776659555ccdfb0e"
    },
    {
      label: "Electronics and Communication Engineering",
      code: "EC",
      id: "63da962a776659555ccdfb12"
    },
    {
      label: "Engineering Science",
      code: "XE",
      id: "63da964c776659555ccdfb16"
    },
    {
      label: "Life Science",
      code : "XL",
      id: "63dab007776659555ccdfb40"
    },
    { 
      label: "Instrumentation Engineering",
      code : "IN",
      id: "63da978d776659555ccdfb2e"
    },
    { 
      label: "Mechanical Engineering",
      code : "ME",
      id: "63dab079776659555ccdfb48"
    },
    { 
      label: "Metallurgical Engineering",
      code : "MT",
      id: "63dab097776659555ccdfb4c"
    },
    { 
      label: "Petroleum Engineering",
      code : "PE",
      id: "63dab15d776659555ccdfb58"
    },
    {
      label: "Physics",
      code : "PH",
      id: "63dab314776659555ccdfb5c"
    },
    {
      label: "Production Engineering",  
      code : "PI",
      id: "63dab86e776659555ccdfb60"
    },
    { 
      label: "Textile Engineering and Fibre Science",
      code : "TF",
      id: "63dab8bf776659555ccdfb68"
    }
  ]);
  const [popularDepartment, setPopularDepartment] = useState([]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  const departmentDetails = [
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

  useEffect(() => {
    const randomSix = popularDepartmentData.sort(() => 0.5 - Math.random()).slice(0, 6);
    setPopularDepartment(randomSix);
  },[]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchRandomReviews();

    // attach the event listener to
    // the document object
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    
    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  },[]);

  const fetchData = async () => {
    try {
      let URL = '/api/departments/get-all-departments';

      let reqObj = {
        method: "GET",
      };

      let data = await requestAPI(URL,reqObj);

      if(data && data?.statusCode == 200) {
        setDepartmentData(data?.data?.length ? data?.data : []);
        setLoading(false);
      } else {
        if(data.statusCode == 401) {
          handleLogout(router);
        }
        setLoading(false);
        toastAlert(data.message,"error");
        console.log(data.message,"error");              
      }
    } catch (e) {
      setLoading(false);
      toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
      console.log(e,"error");
    }
  };

  const fetchRandomReviews = async() => {
    try {
      let URL = "/api/reviews/get-random-reviews";

      let reqObj = {
        method: "GET",
      };

      let data = await requestAPI(URL,reqObj);
      console.log('data fetched randmon api ', data);
      if(data && data?.statusCode == 200) {
        setLoading(false);
        setReviewData(data?.data?.length ? data?.data : []);
      }else {
        if(data.statusCode == 401) {
          handleLogout(router);
        }
        setLoading(false);
        console.log(data.message,"error");
        toastAlert(data.message,"error");
      }
    } catch (e) {
      setLoading(false);
      console.log(e,"error");
      toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
    }
  };

  const redirectToHome = (id) => {
    router.push({
      pathname: '/home',
      query: { id }
    })
  }

  const redirectToHomeFromAutocompleteOption = (val) => {
    let id = val?._id;
    router.push({
      pathname: '/home',
      query: { id }
    })
  }

  return (
    <>
      <Head>
        <title>Set2Score-Home</title>
        <meta name="description" content="Skyrocket your presentation for gate exam" />
        <meta name="keywords" content="gate, set2score, engineering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <section>
        {
          loading ?
            <Grid container className={styles.mainContainer}>
              <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.marginSpace}>
                  <Loader/>
              </Grid>
            </Grid>
          :
            <Grid container className={styles.landingPageSection}>
              {/* INTRO_SECTION: START */}
              <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.marginSpace}>
                <Grid container spacing={2}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={11} className={styles.introLeftSection}>
                    <Grid container spacing={1}>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>  
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <h1>Your exam <span className={styles.successTxt}>success</span> is our priority</h1>
                          </Grid>
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <p className={styles.introDescription}>We are committed to helping our learners achieve their goals on their exams. This can include providing high-quality educational resources, such as practice exams, study guides, and personalized feedback, that are designed to help learners improve their knowledge and test-taking skills.</p>
                          </Grid>
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            {/* <h4>Start your preparation for free!</h4>
                            <Grid container spacing={1}>
                              <Grid item xl={3} lg={3} md={6} sm={5} xs={5}>
                                <p>Download here</p>
                              </Grid>
                              <Grid item xl={2} lg={2} md={4} sm={6} xs={6}>
                              </Grid>
                            </Grid> */}
                            <Grid container>
                              <Grid item lg={12} md={12} sm={12} xs={12}>
                                <p>Revolutionize your learning experience with our app - download it now!</p>
                              </Grid>
                              {/* <Grid item xl={7} lg={8} md={10} sm={12} xs={12}>
                                <GetLink/>
                              </Grid> */}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>  
                        <Grid container className={styles.departmentMain}>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container className={styles.departmentSection}>
                              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <h2>GATE Exam</h2>
                                  </Grid>
                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Autocomplete
                                        className={styles.departmentAutocomplete}
                                        name="department"
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
                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign:"center" }}>
                                    <Button
                                      className={styles.getStartedButton}
                                      onClick={() => redirectToHomeFromAutocompleteOption(department)}
                                    >
                                      Get Started
                                    </Button>
                                  </Grid>
                                  {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <p>Frequently visited departments</p>
                                    <Grid container>
                                      {popularDepartment?.map((dept,i) => (
                                        <>
                                          {(i % 3 === 0) && (
                                            <Grid container className={styles.popularDeptEmptyContainer} key={i}>
                                            </Grid>
                                          )}
                                          <Grid item xl={4} lg={4} md={4} sm={4} xs={4} className={styles.departmentContainer}>
                                            <Button
                                              className={styles.departmentButton}
                                              key={i}
                                              onClick={() => redirectToHome(dept.id)}
                                              style={{ color : i % 2 === 0 ? "#ffffff" : "#CCCC00"}}
                                              title={dept.label}
                                            >
                                              {dept?.code}
                                            </Button>
                                          </Grid>
                                        </>
                                      ))}
                                    </Grid>
                                  </Grid> */}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container className={styles.googlePlayButtonSection}>
                              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <Grid container className={styles.textAndComponentContainer}>    
                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <p>Start your preparation for free!</p>
                                  </Grid>
                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <GooglePlayButton
                                      background={"#024F10"}
                                      color={"#FFFFFF"}
                                      boxShadow={'0px 25px 47px #D2D5EB'}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* INTRO_SECTION: START */}

              {/* FEATURE_SECTION: START */}
              {/* <Grid container spacing={1}>
                <Grid item xl={2} lg={2} md={1} sm={0} xs={0}></Grid>
                <Grid item xl={8} lg={8} md={10} sm={12} xs={12} className={styles.FeatureSliderSection}>
                  <Grid container spacing={2}>
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}></Grid>
                      <Grid item xl={4} lg={4} md={5} sm={12} xs={12} className={styles.featureHeader}>
                        <h1>What you’ll get in Set2Score?</h1>
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={12} xs={12}></Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <FeatureSlider/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xl={2} lg={2} md={1} sm={12} xs={12} className={styles.socialMediaSectionContainer}>
                  <Grid container spacing={1} className={styles.socialMediaIconSection}>
                    <SocialMediaIcons />
                  </Grid>
                </Grid>
              </Grid> */}

              <Grid container className={`${styles.marginSpace} ${styles.quickLinksMainContainer}`}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Grid container className={styles.quickLinkInnerContainer}>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Grid container>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              <Grid container>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                  <span className={styles.GATEHEader}>GATE</span>
                                  <span className={styles.quickLinksText}>Quick Links</span>
                                </Grid>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.linkTextGrid}>
                                  <span className={styles.linkText}>Previous papers with solutions available for more than 20+ departments</span>
                                </Grid>
                              </Grid>
                            </Grid>                            
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={`${styles.verticalSliderMainSection} ${scrollBarStyles.myCustomScrollbar1}`}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Grid container spacing={1}>
                                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                  <Grid container>
                                    {
                                      departmentDetails?.map((departmentData,i) => (
                                        <React.Fragment key={i}>
                                          {
                                            i%2 === 1 ?
                                              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <DynamicCard
                                                  data={departmentData}
                                                  idx={i}
                                                />
                                              </Grid>
                                            : null
                                          }
                                        </React.Fragment>
                                      ))
                                    }
                                  </Grid>
                                </Grid>
                                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                  <Grid container>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                      {
                                        departmentDetails?.map((departmentData,i) =>
                                          <Grid container key={i}>
                                            {
                                              i%2 === 0 ?
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                  <DynamicCard
                                                    data={departmentData}
                                                    idx={i}
                                                  />
                                                </Grid>
                                              :
                                                null
                                            }
                                          </Grid>
                                        )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* FEATURE_SECTION: END */}

              {/* WHY_SET2SCORE_SECTION: START */}
              <Grid container className={styles.whySet2ScoreSection}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.cardMainGrid}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Grid container className={styles.cardSection}>  
                        <Grid item xl={2} lg={2} md={0} sm={0} xs={6} className={styles.vectorSectionLeft}>
                          <Image src={MinorEllipse} width={60} height={100} alt="minorEllipseVector" className={styles.minorEllipse}/>
                          <Image src={MajorEllipse} width={100} height={180} alt="majorEllipseVector" className={styles.majorEllipse}/>
                        </Grid>
                        <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Grid container>
                                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                  <Grid container>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                      <Grid container>
                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6} className={styles.leftHexaGoneMainGrid}>
                                          <Grid container>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.hexaGoneMainGrid}>
                                              <div className={styles.hexaGonalShape}>
                                                <Grid container className={styles.iconAndTextContainer}>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <BusinessCenterIcon className={styles.whyCardIcon}/>
                                                  </Grid>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <p>Available for 15+ departments</p>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                          <Grid container>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                              <div className={styles.hexaGonalShape}>
                                                <Grid container className={styles.iconAndTextContainer}>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <QuestionAnswerIcon className={styles.whyCardIcon}/>
                                                  </Grid>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <p>Discussion forum for doubt solving.</p>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                            </Grid>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.lowerHexagoneGrid}>
                                              <div className={styles.hexaGonalShape}>
                                                <Grid container className={styles.iconAndTextContainer}>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FolderIcon className={styles.whyCardIcon}/>
                                                  </Grid>
                                                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <p>12+ years of previous papers with solution.</p>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                  <Grid container>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                      <Grid container>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                                        </Grid>
                                        <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                                          <Grid container className={styles.rightSideContentContainer}>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                              <h1 className={styles.whyHeader}>Why Set2Score?</h1>
                                            </Grid>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                              <p>India’s top rated mobile application with 30k+ trusted users</p>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={2} lg={2} md={0} sm={0} xs={6} className={styles.rightVectorSection}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.rectangleVectorSection}>
                              <Image src={SkyBlueRectangle} width={50} height={100} alt="SkyBlueRectangleVector"/>
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.circleVectorSection}>
                              <Image src={OrangeCircle} width={100} height={100} alt="OrangeCircleVector"/>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* WHY_SET2SCORE_SECTION: END */}

              {/* GET_THE_APP_SECTION: START */}
              <Grid container>
                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                  <GetTheApp/>
                </Grid>
              </Grid>
              {/* GET_THE_APP_SECTION: END */}

              {/* SLIDER: START */}
              <Grid container spacing={1} className={styles.reviewSliderContainer}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Grid container>  
                    <Grid item xl={2} lg={2} md={1} sm={0} xs={0} className={styles.leftVectorSliderSection}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={0} xs={0} className={styles.parentRectangleSliderSection}>
                          <Image src={RectangleShape} width={200} height={200} alt="SkyBlueRectangleVector"/>
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={0} xs={0} className={styles.rectangleVectorSliderSection}>
                          <Image src={SkyBlueRectangle} width={100} height={100} alt="SkyBlueRectangleVector"/>
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={0} xs={0} className={styles.circleVectorSliderSection}>
                          <Image src={OrangeCircle} width={100} height={100} alt="OrangeCircleVector"/>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={8} lg={8} md={10} sm={12} xs={12} className={styles.sliderSection}>
                      <Grid container spacing={2}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <h1>What our students are saying</h1>
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <ReviewSlider
                            reviews={reviewData.length ? reviewData.sort(() => 0.5 - Math.random()).slice(0, 10) : []}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={2} lg={2} md={1} sm={12} xs={0} className={styles.rightVectorSliderSection}>
                      <Grid container spacing={1}>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={styles.combinedVector}>
                          <Image src={SliderRightVector} width={200} height={200} alt="SkyBlueRectangleVector"/>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* SLIDER: END */}
              
              {/* FOOTER_SECTION: START */}
              <Grid item xl={12} lg={12} sm={12} md={12} xs={12} className={styles.footerSection}>
                <section id="contact">
                  <Footer />
                </section>
              </Grid>
              {/* FOOTER_SECTION: END */}
            </Grid>
        }
      </section>
    </>
  )
}

export default Index;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  // change this condition to !session later
  if(session) {
    return {
      redirect: { destination: "/home" },
    };
  }

  return {
    props: {
      session: session
    },
  };
}