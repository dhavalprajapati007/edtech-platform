import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import styles from "../styles/TestMode.module.css";
import { formatTime } from '../helpers/helper';

function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
}

const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const CountdownTimer = ({ countdownTime, handleTimeChange }) => {
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        const encryptedData = sessionStorage.getItem('countdownTimer');
        if(encryptedData) {
            const decryptedData = decryptData(encryptedData);
            setRemainingTime(decryptedData.remainingTime);
            handleTimeChange(decryptedData.remainingTime);
        }else {
            setRemainingTime(countdownTime*60);
            handleTimeChange(countdownTime*60);
        }
    }, []);

    useEffect(() => {
        if(remainingTime === null) {
            return; // don't save to sessionStorage until remainingTime is set
        }
        sessionStorage.setItem('countdownTimer', encryptData({ remainingTime }));
    }, [remainingTime]);

    useEffect(() => {
        if(remainingTime === null) {
            return; // don't start interval until remainingTime is set
        };

        const intervalId = setInterval(() => {
            setRemainingTime((prevTime) => {
                if(prevTime <= 0) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prevTime - 1;
            });
            handleTimeChange(remainingTime)
        }, 1000);
        return () => clearInterval(intervalId);
    }, [remainingTime]);

    if(remainingTime === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <span className={styles.timerText}>Time Left: <span className={styles.timeValue}>{formatTime(remainingTime)}</span></span>
        </div>
    );
}

export default CountdownTimer;