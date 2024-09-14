import React from 'react';
import styles from "../styles/GooglePlayButton.module.css"
import propTypes from "prop-types";
import Link from 'next/link';

function GooglePlayButton({ color, background, boxShadow }) {
    return (
        <div>
            <Link 
                className={styles.btn}
                target="_blank"
                href="https://play.google.com/store/apps/details?id=in.set2score.set2score"
                title="Google Play"
                style={{ background : background, color : color, boxShadow : boxShadow ? boxShadow : '' }}
            >
                Google Play
            </Link>
        </div>
    )
}

export default GooglePlayButton

// proptypes check
GooglePlayButton.propTypes = {
    color: propTypes.string,
    background: propTypes.string
};
