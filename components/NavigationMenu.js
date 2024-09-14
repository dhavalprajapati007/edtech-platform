import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { navLinks } from "../utils/data";
import styles from "../styles/Home.module.css";
import { Grid } from '@mui/material';

const NavigationMenu = () => {
    const router = useRouter();

    return (
        <Grid item lg={12} sm={12} md={12} xs={12} xl={12} className={styles.navigationSection}>
            <nav className={styles.mainnav}>
                {
                    <ul>
                        {
                            navLinks.map((link, index) => {
                                return (
                                    <li key={index}>
                                        <Link
                                            key={index}
                                            href={link.path}
                                            className={router.pathname === link.path || router.pathname?.includes(link.path) ? styles.active : ""}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                }
            </nav>
        </Grid>
    )
}

export default NavigationMenu;