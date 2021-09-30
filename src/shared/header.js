import React, { useState, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import { Link, useHistory } from 'react-router-dom';
import GQLogoComponent from '../shared/components/GQLogoComponent'
import LogoutModal from './Modal/LogoutModal';
import LogoutService from '../services/logout';
import AccountService from '../services/accountInfo';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        // marginRight: theme.spacing(2),
        '& img': {
            height: '50px'
        },
        '&:hover': {
            backgroundColor: 'transparent',

        },
        // color: 'white',
    },
    inputRoot: {
        color: 'inherit',
    },
    sectionDesktop: {
        display: 'flex',
        // [theme.breakpoints.up('md')]: {
        //     display: 'flex',
        // },
        span: {
            'font-weight': '400'
        }
    },
    sectionMobile: {
        display: 'none',
        // [theme.breakpoints.up('md')]: {
        //     display: 'none',
        // },
    },
    profileText: {
        marginLeft: '5px',
        color: '#5A6868'
    },
    headerNav: {
        padding: '10px 15px 0px',
        left: 0,
        paddingLeft: '0',
        backgroundColor: '#fff !important',
        boxShadow: 'none !important',
        color: '#0C90C6 !important',
        margin: 'auto',
        width: '96% !important',
        zIndex: 999,
        borderBottom: '1px solid #cec7c7',
        position: 'unset'

    },
    headerLink: {
        // alignItems: 'left',
        pointerEvents: 'none',
        backgroundColor: 'transparent'
        // opacity:' 0.5'

    },
    headerPipe: {
        display: 'block',
        margin: '5px 0'
    },
    // '@media (min-width: 780px)': {
    //     headerPipe: {
    //         display: 'block'
    //     }
    // }
}));

export default function Header(props) {
    const { page } = props;
    const history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { t, i18n } = useTranslation('common');
    // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [modalShow, setModalShow] = React.useState(false);
    const [accountInfo, setAccountInfo] = useState([]);
    const isMenuOpen = Boolean(anchorEl);
    // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [userName, setUserName] = React.useState(null);;

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // const handleMobileMenuClose = () => {
    //     setMobileMoreAnchorEl(null);
    // };

    const handleMenuClose = () => {
        setAnchorEl(null);
        // handleMobileMenuClose();
    };
    const logout = () => {
        localStorage.clear();
        LogoutService.logout();
        history.push('/login')
    };

    // const handleMobileMenuOpen = (event) => {
    //     setMobileMoreAnchorEl(event.currentTarget);
    // };


    // const routeToDocLink = () => {
    //     console.log("SDAASDADSADSDAS");
    //     window.location.assign('http://github.com');
    // };

    useEffect(() => {
        (async () => {
            const isUserLogin = localStorage.getItem('isLoggedIn');
            const result = await AccountService.getAccountInfo(history);
            result && result.response_content ? setAccountInfo(result.response_content) : setAccountInfo({});
            if (isUserLogin) {
                setUserName(localStorage.getItem('userName'));
            }
        })();
    }, []);
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
            <MenuItem onClick={handleMenuClose}>
                <Link to="/accountinfo" className={classes.anchorTag}>{t('myAccount')}</Link>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    // const renderMobileMenu = (
    //     <Menu
    //         anchorEl={mobileMoreAnchorEl}
    //         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //         id={mobileMenuId}
    //         keepMounted
    //         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    //         open={isMobileMenuOpen}
    //         onClose={handleMobileMenuClose}
    //     >
    //         <MenuItem>
    //             <Button
    //                 edge="end"
    //                 aria-label="account of current user"
    //                 aria-controls={menuId}
    //                 aria-haspopup="true"
    //                 //   onClick={handleProfileMenuOpen}
    //                 color="inherit"
    //             >
    //                 <AccountCircle />
    //                 <span className={'text-capitalize appTextFont ' + classes.profileText} >{userName}</span>
    //             </Button>
    //         </MenuItem>
    //         <MenuItem onClick={() => setModalShow(true)}>
    //             <Button color="inherit"><span className="appLink text-initial appTextFont" >{t('logout')}</span></Button>
    //         </MenuItem>
    //         <MenuItem >

    //             {/* <a href='https://docs.genomequestlive.com/' className="appLink text-capitalize appTextFont"> {t('documentation')}</a> */}
    //             <Button color="inherit">
    //                 <a href="https://docs.genomequestlive.com/" className="appLink text-capitalize appTextFont" target="_blank" rel="noreferrer" >{t('documentation')}</a>
    //             </Button>
    //         </MenuItem>
    //     </Menu>
    // );
    // https://docs.genomequestlive.com/
    return (

        <div className={classes.grow}>
            <AppBar className={classes.headerNav}>
                <Toolbar>
                    <GQLogoComponent />
                    {/* <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    // disableRipple ='true'
                    > 
                     <Link to="/home" ><img src={GQLogo} alt="GQLogo" className="w-75" /></Link> 
                     </IconButton>  */}
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Button
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                            <span className={'text-capitalize appTextFont ' + classes.profileText} >{accountInfo.first_name} {accountInfo.last_name}</span>
                        </Button>
                        <span className={classes.headerPipe}>|</span>
                        {/* <Button color="inherit" ><span className="appLink text-initial appTextFont" >{t('logout')}</span></Button> */}
                        <Button color="inherit" onClick={() => setModalShow(true)}><span className="appLink text-initial appTextFont" >{t('logout')}</span></Button>

                        {/* <PromptModal
                            show={modalShow}
                            hideModal={() => setModalShow(false)}
                            modalCallback={logout}
                        /> */}
                        <LogoutModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            tryAgain={() => logout()}
                        // onMessage={errorMessage}
                        />
                        <span className={classes.headerPipe}>|</span>
                        <Button color="inherit">
                            <a href="https://docs.genomequestlive.com/" target="_blank" className="appLink text-capitalize appTextFont" rel="noreferrer" >{t('documentation')}</a>

                            {/* <span className="appLink text-capitalize appTextFont" >{t('documentation')}</span> */}
                        </Button>

                    </div>
                    {/* <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div> */}
                </Toolbar>
                <br />
                <h5 className={"text-right pageTitle " + (props.title != '' ? 'p-0' : 'p-2')}><b>{t(props.title)}</b></h5>
            </AppBar>

            {/* {renderMobileMenu} */}
            {renderMenu}
        </div>
    );
}
