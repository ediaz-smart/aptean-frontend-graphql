import { environment } from '../config';
import axios from 'axios';
// import loginError from '../tests/login-error.txt';
// import loginSuccess from '../tests/login-success.txt';
// import seqSearchInit from '../tests/seqSearchInit.txt';
// import seqSearchInitRedo from '../tests/seqSearchInit-redo.txt';
// import searchResultsData from '../tests/searchResults.txt';
// import searchResultsStatusData from '../tests/searchResultsStatus.txt';
// import history from '../helpers/history';
// import createBrowserHistory from 'history/createBrowserHistory';

// const history = createBrowserHistory({forceRefresh:true});

let baseUrl = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true
const transport = axios.create({
    withCredentials: true
  });
  
// import { Auth } from "../helpers/Auth";
// import { environment } from "../helpers/config";
// import PubSub from 'pubsub-js';
// export const fetchServicesMethods = {};
// fetchServicesMethods.get = get;
// fetchServicesMethods.post = post;
// fetchServicesMethods.delete = remove;
// let token =  Auth.token();
// Post Method
// let token = localStorage.getItem('token');
// function get(url){
// PubSub.publish('msg', true);
//  const requestOptions = { 
//      headers: { 
//           'type':'web',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer '+token
//      },
//      method: 'GET', 
// }; 
// return fetch(environment.baseUrl+url, requestOptions)
//  .then(handleResponse);
// }
// // Post Method
// function post(url , data){
//     PubSub.publish('msg', true);
//     const requestOptions = { 
//         headers: { 
//             'type':'web',
//              'Authorization': 'Bearer '+token, 
//         },
//         method: 'POST', 
//         body: data
//    }; 
//     return fetch(environment.baseUrl+url, requestOptions)
//     .then(handleResponse)
// }
// // Delete Method
// function remove(url){
//     const requestOptions = { 
//         headers: { 
//             'type':'web',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer '+token, 
//         },
//         method: 'DELETE', 
//    }; 
//     return fetch(url, requestOptions)
//     .then(response => response.json())
// }
function HandleResponse(response,history) {
    const contentType = response.headers["content-type"];
    if (contentType && contentType.indexOf("application/json") !== -1) {
        if(response.status == 200)
        {
            if(response.data.response_status == 1)
            {
                let getMsg = response.data.response_content.message;
                if(getMsg == 'REQUIRED_LOGIN' || getMsg == 'SESSION_EXPIRED'){
                    // var link=document.createElement("a");
                    // link.href="/";
                    // link.click();
                    localStorage.clear();
                    history.push("/");
                }
            }
            return response.data;
        }else {
            if (response.status === 401) {
                // logout();
            }
            if (response.status === 503) {
                // history.push('/maintenanceMode')
            }
            const error = response.data;
            // PubSub.publish('msg', false);
            return Promise.reject(error);
        }
    }else if (contentType && contentType.indexOf("text/html") !== -1) {
        return response.data;
    }
}

export function post(url, postdata,history) {
    console.log('setSubmit', url, postdata)
    // if (window.location.hostname == 'localhost') {
    //     let file;
    //     if (url.includes('gquser.login')) {
    //         file = loginSuccess;
    //     } else if (url.includes('gqft.launch_seq_search')) {
    //         file = seqSearchInit;
    //     }
    //     return fetch(file).then(r => r.text())
    //         .then(text => {
    //             console.log('text decoded:', text);
    //             return JSON.parse(text);
    //         });
    // } else {
    
    return axios.post(baseUrl + url, postdata,{
        // method: 'post',
        // headers: {
        //     //'Content-Type': 'application/json; charset=utf-8;application/x-www-form-urlencoded',
        //     //'Access-Control-Allow-Origin': '*',
        //     // 'Accept': 'application/x-www-form-urlencoded'
        // },
        withCredentials: true,
        // body: postdata
        //body: JSON.stringify(data)
    })
    .then(resp => {
        return HandleResponse(resp,history)
        // return resp
    });
    
    // }

    // .then(json)
    // .then(function (data) {
    //     console.log('Request succeeded with JSON response', data);
    //     return data;
    // })
    // .catch(function (error) {
    //     console.log('Request failed', error);
    // });
}


// axios get
export function get(url, history) {
    try {
        console.log('getttt', url)
        // if (window.location.hostname == 'localhost') {
        //     let file;
        //     if (url.includes('mygq.get_welcome_page_v2')) {
        //         file = searchResultsData;
        //     }
        //     else if (url.includes('gqworkflow.get_status')) {
        //         file = searchResultsStatusData;
        //     }
        //     return fetch(file).then(r => r.text())
        //         .then(text => {
        //             console.log('text decoded:', text);
        //             return JSON.parse(text);
        //         });
        // } else {
            const headers = {
                // 'Accept': 'application/json',
                // 'Cookie': 'PHPSESSID=ou3h9cqpcdm0sh3tq4adb5ipq2'
            };
            return axios.get(baseUrl + url, { headers })
                .then(resp => {
                    return HandleResponse(resp,history)
                    // return resp
                });
        // }
    } catch (error) {
        console.error(error);
    }

}

export function getFile(url, history,type) {
    try {
        // if (window.location.hostname == 'localhost') {
        //     let file;
        //     if (url.includes('mygq.get_welcome_page_v2')) {
        //         file = searchResultsData;
        //     }
        //     else if (url.includes('gqworkflow.get_status')) {
        //         file = searchResultsStatusData;
        //     }
        //     return fetch(file).then(r => r.text())
        //         .then(text => {
        //             console.log('text decoded:', text);
        //             return JSON.parse(text);
        //         });
        // } else {
            const headers = {
                // 'Content-Length': 0,
                // 'Content-Type': 'text/plain'
            };
            
            return axios.get(
                baseUrl + url, { headers }
                )
                .then(resp => {
                    const url = window.URL.createObjectURL(new Blob([resp.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    if(type == "querySeq")
                    {
                        link.setAttribute('download', 'queries.fasta.txt'); //or any other extension
                    }else {
                        link.setAttribute('download', 'techLog.txt'); //or any other extension
                    }
                    
                    document.body.appendChild(link);
                    link.click();
                    return HandleResponse(resp,history)
                    // return resp
                });
        // }
    } catch (error) {
        console.error(error);
    }

}
