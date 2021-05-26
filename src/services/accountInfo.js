import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getAccountInfo() {

    if(localStorage.getItem('isLoggedIn') == true ){

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
        return 1;
    }
   
}

async function updateUser(id, firstName, lastName, currentPassword){

    
    if( id == "" || firstName == "" || lastName == "" || currentPassword == "" ){
        console.error("needs all Parameters");
        toast.error("Failed to update info");
        return 1;
    }else{

        let stringBuild= "do=gquser.update&id=:ID:&first_name=:FN:&last_name=:LN:&curr_password=:CP:&format=json";
        
        stringBuild.replace(":ID:", id);
        stringBuild.replace(":FN:", firstName);
        stringBuild.replace(":ID:", lastName);
        stringBuild.replace(":ID:", currentPassword);

        let url= stringBuild;

        update(url);
    }
}

async function updatePass(id, newPassword1, newPassword2, currentPassword){
    
    if( id == "" || newPassword1 == "" || newPassword2 == "" || currentPassword == "" ){
        console.error("needs all Parameters");
        toast.error("Failed to update password");
        return 1;
    }else{

        let stringBuild= "do=gquser.update&id=:ID:&password1=:P1:&user_password_again=:P2:&curr_password=:CP:&format=json";
        
        stringBuild.replace(":ID:", id);
        stringBuild.replace(":P1:", newPassword1);
        stringBuild.replace(":P2:", newPassword2);
        stringBuild.replace(":CP:", currentPassword);

        let url= stringBuild;

        update(url);
    }

}

async function update(url) {

    if(localStorage.getItem('isLoggedIn') == true && url != "" ){

        try {
            return await get(url)
            .then((response) => {
                
                console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                toast.error('Failed to change password');
                console.log("error::", error);

            });
        } catch (error) {
            console.error(error);
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