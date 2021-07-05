import CryptoJS from 'crypto-js';
import { config } from '../config';
// import {toastr} from '../services/toastr.service.js'


export function isAdminLogin() {
	let user = '';
	if (localStorage.getItem('user')) {
		user = localStorage.getItem('user');
		var bytes = CryptoJS.AES.decrypt(user.toString(), 'GenomeQuest');
		user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	}

	if (user && user.data && user.data.sessionData && user.data.sessionData.token && user.data ) {

		return user.data
	} else {
		return false
	}
}















