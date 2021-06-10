import React,{useEffect} from "react";
import PropTypes from "prop-types";
import { Route, Redirect,useHistory } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import store from '../store/index.js'

export default function Router({
	component: Component,
	title,
	...rest
}) {
	const signed = true;
	const { user } = store.getState();
	const history = useHistory();
	// const isLoginStatus = user.isLoggedIn;
	const isUserLogin = localStorage.getItem('isLoggedIn');
	
	
	// useEffect(() => {
    //     //dispatch(userActions.logout()); 
        
	// 	if(isUserLogin == null || isUserLogin == undefined || isUserLogin == false){
	// 		history.push('/login');
	// 	}
    // }, []);
	// console.log(isUserLogin,'isUserLoginisUserLogin');
	/**
	 * Redirect user to SignIn page if he tries to access a private route
	 * without authentication.
	 */
	//   if (isPrivate && !signed) {
	//     return <Redirect to="/" />;
	//   }

	/**
	 * Redirect user to Main page if he tries to access a non private route
	 * (SignIn or SignUp) after being authenticated.
	 */
	//   if (!isPrivate && signed) {
	//     return <Redirect to="/dashboard" />;
	//   }

	//   const Layout = signed ? AuthLayout : DefaultLayout;
	
	/**
	 * If not included on both previous cases, redirect user to the desired route.
	 */

	if (isUserLogin == null || !isUserLogin) {
		return (
			
			<Route
				{...rest}
				render={props => (
					<Component {...props} />

				)}
			/>
		);
	} else {
		return (
			<Route
				{...rest}
				render={props => (
					<Layout title={title}>
						<Component {...props} />
					</Layout>

				)}
			/>
		);
	}
}


