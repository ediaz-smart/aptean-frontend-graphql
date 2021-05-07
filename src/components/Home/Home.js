import MostUsedPanel from './MostUsedPanel';
import ApplicationPanel  from "./ApplicationPanel";
import RecentResults from "./RecentResults";
import { Fragment } from 'react';

function Home() {
    return(
    <Fragment>
    <MostUsedPanel />
    <ApplicationPanel />
    <RecentResults />
    </Fragment>
    )
}

export default Home;