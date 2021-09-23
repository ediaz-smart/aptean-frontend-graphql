import MostUsedPanel from './MostUsedPanel';
import ApplicationPanel from "./ApplicationPanel";
import RecentResults from "./RecentResults";
import { Fragment } from 'react';

const homeContentStyle = {
    maxWidth: '1000px'
}
const homeContainer = {
    display: 'flex',
    justifyContent: 'center'
}
function Home() {
    return (
        <div style={homeContainer}>
            <div style={homeContentStyle}>
                <MostUsedPanel />
                <ApplicationPanel />
                <RecentResults />
            </div>
        </div>
    )
}

export default Home;