
import React, { useEffect } from 'react';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import ResponsiveCardContainer from '../ResponsiveCardContainer';
import useAudio from '../../hooks/useAudio';
import useAxios from 'axios-hooks';
import { CircularProgress, makeStyles, Theme } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { useHistory, useParams } from 'react-router-dom';
import routes from '../../routes/routes.enum';
import AlertError from '@material-ui/icons/Error';
const Zoom = require('react-reveal/Zoom');

interface ResponseData {
    status: string;
    doc: {
        data: string[];
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    cardActions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "&:hover": {
            opacity: 1
        }
    },
    controls: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: theme.spacing(2),
    },
    recordButton: {
        background: red[500],
        color: "#fff"
    },
    stopButton: {
        background: "#fff",
        border: "2px solid " + red[500],
        color: red[500],
        animation: `$pulse 0.5s ${theme.transitions.easing.easeOut} infinite alternate`,
    },
    "@keyframes pulse": {
        "0%": {
            transform: "scale(1)",
            opacity: 1
        },
        "100%": {
            transform: "scale(1.1)",
            opacity: 0.5,
            filter: "blur(0.5px)"
        }
    }
}))

const TextCard = ({ text }: { text: string }) => {

    return (
        <Zoom bottom key={text}>
            <Typography variant="h3">
                {text}
            </Typography>
        </Zoom>
    )
}

export default function ReadingCard() {
    const history = useHistory();
    const params = useParams<{ age: string, pincode: string }>()
    const [index, setIndex] = React.useState(0);
    const [{ loading, error, data }] = useAxios<ResponseData>('/default/test-func/testapi/sentences');
    const [{ loading: submissionLoading, error: submissionError, data: submissionData }, postData] = useAxios<ResponseData>(
        {
            url: "/default/test-func/testapi/upload",
            method: "POST",
        }, { manual: true }
    );
    const recordingData = (blob: any) => {
        const reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
            postData({
                data: {
                    audio: base64data,
                    ext: "ogg",
                    pincode: params.pincode,
                    age_b: params.age
                }
            })
            return;
        }
    };
    const { startRecorder, stopRecorder, recordingState } = useAudio((data: Blob) => { console.log(data); recordingData(data) });
    const classes = useStyles();

    useEffect(() => {
        if (!loading && !submissionLoading && submissionData) {
            history.push(routes.POSTSUBMIT);
        }
    })

    const texts = (!loading && !submissionLoading && data) ? data.doc.data as string[] : [];

    const handleNext = (_: any) => {
        if (texts.length - 1 >= index + 1)
            setIndex(index + 1);
        else stopRecorder();
    }

    const handlePrevious = (_: any) => {
        if (index - 1 >= 0)
            setIndex(index - 1);
    }

    const Controls = () => {
        switch (recordingState) {
            case "inactive":
                return (
                    <IconButton size="medium" className={classes.recordButton} color="default" onClick={startRecorder}>
                        <MicIcon />
                    </IconButton>
                )
            case "recording":
                return (
                    <IconButton size="medium" className={classes.stopButton} color="default" onClick={stopRecorder}>
                        <StopIcon />
                    </IconButton>
                )
            case "stopped":
                return (
                    <IconButton size="medium" className={classes.stopButton} color="default" >
                        <CloudUploadTwoToneIcon />
                    </IconButton>
                )
        }
    }

    if (error) return (
        <div style={{ textAlign: "center" }}>
            <AlertError /> <br />
            {"Oops! something went wrong while getting the sentences"}
        </div>
    )

    if (submissionError) return (
        <div style={{ textAlign: "center" }}>
            <AlertError /> <br />
            {"Oops! something went wrong while submitting you recording"}
        </div>
    )

    return (
        <ResponsiveCardContainer>
            <CardContent>
                {loading || submissionLoading
                    ? <div style={{ textAlign: "center" }}>
                        <CircularProgress /><br />
                        {submissionLoading && "You did it! Now give us a moment to measure your reading-age!"}
                    </div>
                    : data &&
                        recordingState === "inactive"
                        ? <Typography gutterBottom color="textSecondary" style={{ textAlign: "center" }} component="div">
                            Please start recoding
                            </Typography>
                        : <>
                            <Typography gutterBottom color="textSecondary" variant="h6" component="h2">
                                Read the text below
                            </Typography>
                            <TextCard text={texts[index]} />
                        </>
                }
            </CardContent>
            <CardActions className={classes.controls}>
                {!loading && !submissionLoading && data &&
                    (<>
                        <IconButton disabled={recordingState === "inactive" || recordingState === "stopped"} color="secondary" onClick={handlePrevious}><KeyboardArrowLeftIcon /></IconButton>
                        {Controls()}
                        <IconButton disabled={recordingState === "inactive" || recordingState === "stopped"} color="primary" onClick={handleNext}><KeyboardArrowRightIcon /></IconButton>
                    </>)
                }
            </CardActions>
        </ResponsiveCardContainer>
    );
}


