import './App.css';
import React, { useState, useEffect } from 'react';

import Routes from './routes/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "react-loader-spinner";
import PubSub from 'pubsub-js';
import { makeStyles } from "@material-ui/core/styles";
import LoadingOverlay from 'react-loading-overlay';
import { useDispatch } from 'react-redux';
import { getUserServerInfo } from './reducers/slice/userServerDataSlice';
import { getPageCount } from './reducers/slice/comonSlice';
import 'reactjs-popup/dist/index.css';


const useStyles = makeStyles((theme) => ({
 
loaderHide: {
  display: 'none'
},

loader :{
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height:' 100%',
  zIndex: '999999',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'block',
  
  },
  loaderPosition:{
  marginLeft: '602px',
    marginTop: '300px',
  }

}));

function App() {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const isUserLogin = localStorage.getItem('isLoggedIn');
    if(isUserLogin) {
    dispatch(getUserServerInfo());
    dispatch(getPageCount());
    }
    async function fetchLoader() {
      const loaderResponse = await PubSub.subscribe('msg', (msg, data) => {
        setLoading(data)
      });
     
      
    }
    fetchLoader()
  }, [])
  return (
    <div> 
     <Routes />
    {loading ?
      <div className={classes.loader}>
      <div className={classes.loaderPosition}>
      <Loader
      
       type="Bars"
        color="#00BFFF"
        height={60}
        width={60}
        // timeout={3000} 
        //3 secs
      />
      </div>
      
      </div>
      :
      <div className={classes.loaderHide}>
      <div className={classes.loaderPosition}>
      <Loader
      
       type="Bars"
        color="#00BFFF"
        height={50}
        width={50}
        // timeout={3000} 
        //3 secs
      />
      </div>
      </div>
    }
    </div>
   
  );
}

export default App;