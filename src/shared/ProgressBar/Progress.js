import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HomeService from '../../services/home'
import ProgressBars from 'react-bootstrap/ProgressBar';
function LinearProgressWithLabel(props) {

    const progressColor = {
        margin: '1px',
        backgroundColor: '#008EC5',
        border: '2px solid #008EC5 !important',
    }
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                {/* <LinearProgress variant="determinate" {...props} /> */}
                {/* <ProgressBars  now={props.value} label={`${props.value}%`} style={{minWidth: 30}} /> */}
                <div className="progressBar">
                    <ProgressBars now={props.value < 22 ? '22' : props.value} label={`${props.value}%`} />
                </div>
            </Box>
            {/* <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box> */}
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    colorPrimary: {
        backgroundColor: '#fff',
        height: '17px',
        border: '2px solid #008EC5 !important',
    },
    barColorPrimary: {
        backgroundColor: '#008EC5',
        border: '2px solid #008EC5 !important',
    }
});
export default function ProgressBar({ datas, getStatus }) {
    const classes = useStyles();
    const [progress, setProgress] = React.useState(10);
    const [showProgress, setShowProgress] = React.useState(true);
    const [status, setStatus] = React.useState(datas.status);
    const [initialData, setInitialData] = React.useState(true);

    React.useEffect(async () => {
        if (datas.status == 'STILL_RUNNING' || datas.status == 'UNKNOWN') {
            const initialsres = await HomeService.getSearchResultsStatus(datas.id);
            progressData(initialsres);
        }

        const timer = setInterval(async () => {
            // setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));

            // updateProgressValue();
            if (status == 'STILL_RUNNING') {
                let progressres = await HomeService.getSearchResultsStatus(datas.id);

                setInitialData(false);
                progressData(progressres);
                if (progressres && progressres.response_content.status !== 'STILL_RUNNING') {
                    setInitialData(false);
                    setShowProgress(false);
                    setStatus(progressres.response_content.status);
                    getStatus(true);
                    clearInterval(timer)
                }
            } else {
                setStatus(datas.status);
            }
        }, 10000);

        // return () => {
        //     clearInterval(timer);
        // };
    }, [initialData]);

    function progressData(result) {
        if (result && result.response_content) {
            if (result.response_content.status == ('STILL_RUNNING' || 'UNKNOWN')) {
                let progress = result.response_content.progress ? parseInt(result.response_content.progress) : 0;
                if (progress <= 15) {
                    setProgress(15);
                } else {
                    setProgress(progress);
                }

                setShowProgress(true);
            }
            // else {
            //     setStatus(result.response_content.status);
            //     setShowProgress(false);
            //     setProgressComplete(true);
            // }
        }
    }
    return (
        <div className={classes.root}>
            <div className={(showProgress ? 'd-block' : 'd-none')}>
                <LinearProgressWithLabel now={progress} value={progress} classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }} className="align-left" />
            </div>
            {/* <div className={(showProgress ? 'd-none':'d-block')}>
                <p>{status}</p>
            </div> */}
        </div>
    );
}
