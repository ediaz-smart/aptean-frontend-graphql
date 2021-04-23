import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import GQLogo from '../../assets/image/GQLogo.png';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    backgroundColor: '#ffffff'
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
  menuButton: {
    marginRight: theme.spacing(3),
    borderColor: theme.palette.success.main,
    color: theme.palette.success.main
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
          <img src={GQLogo} alt="GQLogo" />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
          </Typography>
          <AccountCircle  className={classes.menuButton} > Admin </AccountCircle>


            <Button className={classes.menuButton} > Logout </Button>
            <br></br>
            <br></br>
            <Button className={classes.menuButton} > Document </Button>
       
   
           
         
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;