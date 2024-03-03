import axios from "axios"
import { showAlert } from "./alert"
export const logIn = async (email, password) => {
  
    try {
        const res = await axios({
            method: "Post",
            url: "api/user/login",
            data: {
                email,
                password
            } 
        })
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