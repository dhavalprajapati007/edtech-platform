import { Button, CircularProgress, Grid } from '@mui/material';
import React from 'react';
import LatexMarkup from './LatexMarkup';
import styles from "../styles/Question.module.css";
import Image from 'next/image';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const Question = ({ question, index, bookmarkLoading, bookmarked, manageBookmark, mode }) => {
  return (
    <Grid container>
      <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
        <Grid container className={styles.questionDetails}>
          <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
            <Grid container>
              <Grid item xl={6} lg={6} sm={6} md={6} xs={6}>
                <p className={styles.questionIndex}>Question: {index+1}</p>
              </Grid>
              <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.quesTypeContainer}>
                <p className={styles.questionTypeText}>Type : {question?.mode?.toUpperCase()}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={6} lg={6} sm={6} md={5} xs={6}>
            <Grid container>
              {
                mode && (mode === 'full' || mode === 'testSeries' || mode === 'bookmark' || mode === 'response' || mode === 'discussion') ?
                  <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.reportIconContainer}>
                    <Button
                      className={styles.bookmarkBtn}
                      onClick={() => manageBookmark(question)}
                    >
                      {
                        bookmarkLoading ?
                          <CircularProgress
                              sx={{ color: '#A3A3A3' }}
                              size={20}
                          />
                        :
                          bookmarked ?
                            <BookmarkIcon
                              style={{ color : '#A3A3A3'}}
                            />
                          :
                            <BookmarkBorderIcon
                              style={{ color : '#A3A3A3'}}
                            />
                      }
                    </Button>
                  </Grid>
                : null
              }
              <Grid item xl={6} lg={6} sm={6} md={6} xs={6} className={styles.quesMarkGrid}>
                <Grid container>
                  <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                    {
                      typeof question?.department === 'object' && Object.keys(question?.department)?.length ?
                        <Grid container>
                          <Grid item xl={10} lg={10} sm={10} md={10} xs={10}>
                            <span className={styles.positiveMark}><span className={styles.markText}> Marks : </span> +{Number(question?.markingRule?.positive)?.toFixed(2)}</span>
                            <span className={styles.negativeMark}>-{Number(question?.markingRule?.negative)?.toFixed(2)}</span>
                          </Grid>
                          <Grid item xl={2} lg={2} sm={2} md={2} xs={2}>
                            <span
                              className={styles.deptText}
                            >
                              {question?.department?.code}
                            </span>
                          </Grid>
                        </Grid>
                      :
                        <Grid container>
                          <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
                            <span className={styles.positiveMark}><span className={styles.markText}> Marks : </span> +{Number(question?.markingRule?.positive)?.toFixed(2)}</span>
                            <span className={styles.negativeMark}>-{Number(question?.markingRule?.negative)?.toFixed(2)}</span>
                          </Grid>
                        </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xl={12} lg={12} sm={12} md={12} xs={12}>
            {
              question?.images?.length ?
                  question?.images?.map((image,i) => (
                    <div key={i}>
                      <Image
                        src={image}
                        alt="question-image"
                        width={400}
                        height={250}
                        className={styles.imageAutoStyle}
                      />
                    </div>
                  ))
              : null
            }
          </Grid>
          <Grid item xl={11} lg={11} sm={12} md={12} xs={12}>
            <LatexMarkup
              // className="mb-0"
              latex={question?.text?.en ?? question?.text?.en }
              suppressHydrationWarning
              className={styles.textSize}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Question;