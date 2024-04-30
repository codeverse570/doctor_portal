import axios from "axios"
import { showAlert } from "./alert"
export const logIn = async (email, password) => {
  
    try {
        console.log("sourabh");
        const res = await axios({
            method: "Post",
            url: "/api/user/login",
            data: {
                email,
                password
            } 
        })
        console.log(res);
        if (res.data.message === "success") {
            showAlert(res.data.message, "logged in successfully")
            window.location.assign('/')
        }
    }
    catch (err) {
        console.log(err)
        //  console.log(err.response.data)
        showAlert("error", err.response.data.message)
    }

}
export const logout = async () => {
   
    try { 
        let res = await axios({
            method: "GET",
            url: "/api/user/logout"

        })
        if (res.data.status == 'success') {
            showAlert(res.data.status, 'logout')
            window.location.reload(true)
        }
    }
    catch (err) {
        console.log(err)
        showAlert("error", err.response.data.message)
    }
}
export const signUp= async(user)=>{
    try {
        console.log('sign')
        const res = await axios({
            method: "Post",
            url: "/api/user/signup",
            data: user
        })
        if (res.data.message === "success") {
            showAlert(res.data.message, "Account Created!")
            window.location.assign('/')
        }
    }
    catch (err) {
        console.log(err)
        showAlert("error", err.response.data.message)
    }
}


export const save_data = async(data1)=>{
    try {
        console.log('sign')
        const res = await axios({
            method: "Post",
            url: "/api/user/postData",
            data: data1
        })
        if (res.data.message === "success") {
            showAlert(res.data.message, "Data Saved")
            window.location.assign('/')
        }
    }
    catch (err) {
        console.log(err)
        showAlert("error", err.response.data.message)
    }
}

export const save_data2 = async(data2) => {
    try {
        const res = await axios({
            method: "Post",
            url: "/api/user/postData2",
            data: data2
        });
        if (res.data.message === "success") {
            showAlert(res.data.message, "Data Saved");
            window.location.assign('/');
        }
    } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message);
    }
};

