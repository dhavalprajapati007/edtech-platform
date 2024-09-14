import React from 'react';
import instaIcon from "../public/assets/images/InstaIcon.png";
import fbIcon from "../public/assets/images/FbIcon.png";
import ytIcon from "../public/assets/images/YtIcon.png";
import ldIcon from "../public/assets/images/LdIcon.png";
import twIcon from "../public/assets/images/TwitIcon.png";
import { Grid, Link } from '@mui/material';
import Image from 'next/image';

const SocialMediaIcons = () => {
    return (
        <Grid container spacing={1}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link href="https://www.facebook.com/Set2Score" target="_blank">
                    <Image src={fbIcon} alt="facebookIcon"/>
                </Link>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link href="https://www.instagram.com/set2score/" target="_blank">
                    <Image src={instaIcon} alt="instagramIcon"/>
                </Link>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link href="https://www.linkedin.com/company/set2score" target="_blank">
                    <Image src={ldIcon} alt="linkedInIcon"/>
                </Link>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link href="https://www.youtube.com/@set2score659" target="_blank">
                    <Image src={ytIcon} alt="youTubeIcon"/>
                </Link>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link href="https://twitter.com/Set2Score" target="_blank">
                    <Image src={twIcon} alt="twitterIcon" height={32} width={32}/>
                </Link>
            </Grid>
        </Grid>
    )
}

export default SocialMediaIcons;