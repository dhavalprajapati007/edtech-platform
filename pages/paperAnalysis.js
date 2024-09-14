import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Grid } from '@mui/material';
import styles from "../styles/Common.module.css";
import LatexMarkup from '../components/LatexMarkup';
import Loader from '../components/Loader';
import LinkSection from '../components/LinkSection';
import NavigationMenu from '../components/NavigationMenu';
import { toastAlert } from '../helpers/toastAlert';
import { handleContextMenu, handleKeyDown } from '../helpers/helper';
import { requestAPI } from '../helpers/apiHelper';

const PaperAnalysis = ({ session }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let body;
                if(session && Object.keys(session).length) {
                    body= {
                        department: session?.studentData?.department, 
                        exam: session.studentData?.exam
                    };
                }else {
                    body= {
                        department: id,
                    }
                };
                
                let URL = '/api/examAnalysis/get-exam-analysis';

                let reqObj = {
                    method: "POST",
                    body : JSON.stringify(body)
                };
            
                let data = await requestAPI(URL,reqObj);

                if(data && data?.statusCode == 200) {
                    setData(Object.keys(data?.data)?.length ? data?.data : {});
                    setLoading(false);
                } else {
                    setLoading(false);
                    console.log(data.message,"error");
                    toastAlert(data.message,"error");
                }
            } catch (e) {
                setLoading(false);
                toastAlert("Something Went Wrong, Please Try Again After Sometime","error");
                console.log(e,"error");
            }
        };
        setLoading(true);
        fetchData();

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
    },[session]);

    return (
        <div>
            <Head>
                <title>Set2Score-PaperAnalysis</title>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <section>
                <Grid container className={styles.mainContainer}>
                    {
                        loading ?
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <Loader/>
                                </Grid>
                            </Grid>
                        :
                            <Grid container>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <NavigationMenu />
                                </Grid>
                                <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                    <h3>{data.title}</h3>
                                </Grid>
                                <Grid item xl={9} lg={9} sm={12} md={12} xs={12}>
                                        <LatexMarkup
                                            latex={data?.description?.en ?? data?.description?.en }
                                            suppressHydrationWarning
                                        />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={12} md={12} xs={12}>
                                    <Grid container>
                                        <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                                            <LinkSection/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </section>
        </div>
    )
}

export default PaperAnalysis;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    // change this condition to !session later
    if(!session) {
        if(!context?.query?.id) {
            return {
                redirect: { destination: "/" },
            };
        }
    }
      
    return {
        props: {
            session
        }
    }
}