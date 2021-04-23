import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '../src/store/index';
import { Provider } from 'react-redux'
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import en from "./translations/en.json";
import { ToastContainer, toast,Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

i18next.init({
	interpolation: { escapeValue: false },  // React already does escaping
	lng: 'en',                              // language to use
	resources: {
		en: {
			common: en               // 'common' is our custom namespace
		}
	},
});


ReactDOM.render(
	// <React.StrictMode>
	//   <App />
	// </React.StrictMode>,
	<Provider store={store}>
		<I18nextProvider i18n={i18next}>
			<ToastContainer autoClose={3000} hideProgressBar={true} transition={Bounce}/>
			<App />
		</I18nextProvider>
	</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
