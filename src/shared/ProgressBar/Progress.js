import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HomeService from '../../services/home'

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
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
        border:'2px solid #008EC5 !important',
    },
    barColorPrimary: {
        backgroundColor: '#008EC5',
    }
});

export default function ProgressBar({datas,getStatus}) {
    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);
    const [showProgress, setShowProgress] = React.useState(true);
    const [status, setStatus] = React.useState('');
    const [progressComplete, setProgressComplete] = React.useState(true);
    console.log(datas,'datas');
    console.log(getStatus,'getStatus');
    React.useEffect(async () => {
        // console.log(props.datas.id,'props');
        const result = await HomeService.getSearchResultsStatus(datas.id);
        setProgressData(result);
        
        const timer = setInterval(async () => {
            // setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
            const result = await HomeService.getSearchResultsStatus(datas.id);
            // console.log(result,'resultresult');
            setProgressData(result);
            
        }, 10000);

        // return () => {
        //     clearInterval(timer);
        // };
    }, []);
    function setProgressData(result){
        if(result && result.response_content)
        {
            if(result.response_content.status == 'STILL_RUNNING')
            {
                let progress = parseInt(result.response_content.progress.trim());
                setProgress(progress);
                setShowProgress(true);
            }else {
                setStatus(result.response_content.results);
                setShowProgress(false);
                setProgressComplete(true);
                getStatus(progressComplete);
            }
        }
    }
    return (
        <div className={classes.root}>
            <div className={(showProgress ? 'd-block':'d-none')}>
                <LinearProgressWithLabel  value={progress} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} className="align-left" />
            </div>
            <div className={(showProgress ? 'd-none':'d-block')}>
                <p>{status}</p>
            </div>
        </div>
    );
}
