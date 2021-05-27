import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getAccountInfo() {
    if(localStorage.getItem('isLoggedIn')){
        try {
            return await get(url.accountInfo)
            .then((response) => {
                
                console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                toast.error('Failed to retrieve Account Info');
                console.log("error::", error);

            });
        } catch (error) {
            console.error(error);
        }

    }else{
        return "arun";
    }
   
}

async function updateUser(id, firstName, lastName, currentPassword){

    if( id == "" || firstName == "" || lastName == "" || currentPassword == "" ){
        console.error("needs all Parameters");
        toast.error("Failed to update info");
        return 1;
    }else{

        let stringBuild= "do=gquser.update&id="+id+"&first_name="+firstName+"&last_name="+lastName+"&curr_password="+currentPassword+"&format=json";
  
        let url= stringBuild;
        const responseData = await update(url);
        return responseData;

    }
}

async function updatePass(id, newPassword1, newPassword2, currentPassword){
    
    if( id == "" || newPassword1 == "" || newPassword2 == "" || currentPassword == "" ){
        console.error("needs all Parameters");
        toast.error("Failed to update password");
        return 1;
    }else{

        let stringBuild= "do=gquser.update&id="+id+"&password1="+newPassword1+"&user_password_again="+newPassword2+"&curr_password="+currentPassword+"&format=json";

        let url= stringBuild;

        const responseData = await update(url);
        return responseData;
    }

}

async function update(url) {

    if(localStorage.getItem('isLoggedIn') && url != "" ){

        try {
            return await get(url)
            .then((response) => {
                
                console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                toast.error('Failed to change password');
                console.log("error::", error);

            });
        } catch (error) {
            toast.error(error.response_content.message);
            console.error(error,"errors");
        }

    } else {
        return 1;
    }
   
}

const AccountInfo = {
    getAccountInfo,
    updateUser,
    updatePass
};

export default AccountInfo;