import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import store from '../store/index.js'

export default function Router({
	component: Component,
	...rest
}) {
	const signed = true;
	const { user } = store.getState();
	const isLoginStatus = user.isLoggedIn;
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
	if (isLoginStatus) {
		return (
			<Route
				{...rest}
				render={props => (
					<Layout>
						<Component {...props} />
					</Layout>

				)}
			/>
		);
	} else {
		return (
			<Route
				{...rest}
				render={props => (
					<Component {...props} />

				)}
			/>
		);
	}
}


