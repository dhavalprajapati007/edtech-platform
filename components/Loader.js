import { CircularProgress } from '@mui/material';
import React from 'react';

const Loader = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <CircularProgress
                sx={{ color: 'var(--thm-color)'}}
                size={60}
            />
        </div>
    )
};

export default Loader;