import { Box, Divider, Grid, Modal } from '@mui/material';
import React from 'react';
import Question from '../Question';

const QuestionPaper = ({ open, handleClose, data, mode, title }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '5px',
        boxShadow: 24,
        p: 4,
        width: "55%",
        height: "80%",
        overflowY: 'scroll',
    };
    
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <Box sx={style}>
                    <Grid container>
                        {
                            mode === "subject" ?
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <h3
                                        style={{ color : "var(--thm-color)", margin : "40px 0px"}}
                                    >
                                        {title}
                                    </h3>
                                    {
                                        data?.map((question, i) => (
                                            <div key={i}>
                                                <>
                                                    <Question
                                                        key={i}
                                                        question={question}
                                                        index={i}
                                                    />
                                                    <Divider/>
                                                </>
                                            </div>
                                        ))
                                    }
                                </Grid>
                            :
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    {
                                        data?.map((section, id) => (
                                            <div key={id}>
                                                <h3
                                                    style={{ color : "var(--thm-color)", margin : "40px 0px"}}
                                                >
                                                    {section?.name}
                                                </h3>
                                                {
                                                    section?.questions?.map((question, i) => (
                                                        <div key={i}>
                                                            <Question
                                                                key={i}
                                                                question={question}
                                                                index={i}
                                                            />
                                                            <Divider/>
                                                        </div>
                                                ))}
                                            </div>
                                    ))}
                                </Grid>
                        }
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default QuestionPaper;