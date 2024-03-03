import { logIn,signUp,logout,save_data} from "./login.js"
import "@babel/polyfill"
// import { updateUser, updatePassword, forgetPassword,resetPassword} from "./updateUser"
// import { showAlert } from "./alert"
// import {editReview,addReview} from "./review"

let form = document.querySelector("#form")
console.log(form)
if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        console.log("hello");
        logIn(email, password)
    }) 
}
const lgnoutbtn = document.querySelector(".nav__el--logout")
console.log(lgnoutbtn)
if (lgnoutbtn) {
    lgnoutbtn.addEventListener("click", () => {
        logout();
    }) 
}
const updateForm = document.getElementById("updateform")
if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const form = new FormData()
        let email = document.getElementById("email").value
        let name = document.getElementById("name").value
        let photo = document.getElementById("photo").files[0]
        form.append("email", email)
        form.append("name", name)
        form.append("photo", photo)
        updateUser(form)
    })
}
const passwordForm = document.getElementById('password-form')
if (passwordForm) {
    // console.log("hello")
    passwordForm.addEventListener("submit", (e) => {

        e.preventDefault()

        const currentPassword = document.getElementById("password-current")
        const Password = document.getElementById("password")
        const confirmPassword = document.getElementById("password-confirm")
        updatePassword(currentPassword, Password, confirmPassword)
    })
}
const bookBtn = document.getElementById("booktour");
if (bookBtn) {
    bookBtn.addEventListener("click", async (e) => {
        e.target.innerText = "Processing..."
        await bookTour(e.target.dataset.tourId)
        e.target.innerText = "Book Tour Now!"
    })
}
const signUpForm = document.getElementById("signform")
if (signUpForm) {
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        console.log("hello")
        const name = document.getElementById("name").value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("passwordConfirm").value
        const email = document.getElementById("email").value
        const phone =document.getElementById('phone').value
        const role = document.getElementById('role').value
        await signUp({ name, password, passwordConfirm, email,phone,role })
    })
}

const Filled_data = document.getElementById("filled_data")
if (Filled_data) {
    Filled_data.addEventListener("submit", async (e) => {
        e.preventDefault()
        // console.log("hello")
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const phone =document.getElementById('phone').value
        const description = document.getElementById('description').value
        // const doctor =Filled_data.dataset.id;
        await  save_data({name, email,phone,description })
    })
}



const forgetPassForm =document.getElementById("forgetPassForm")
// console.log(forgetPassForm)
if(forgetPassForm){
    // console.log('hello')
     let email = document.getElementById("email")
     forgetPassForm.addEventListener("submit", async(e)=>{
        e.preventDefault()
        email=email.value
        
        await forgetPassword(email)
     })
}
const resetPasswordForm =document.getElementById("resetPasswordForm")
if(resetPasswordForm){
  resetPasswordForm.addEventListener("submit",async(e)=>{
       e.preventDefault()
       const password= document.getElementById("password").value
       const passwordConfirm= document.getElementById("confirmPassword").value
       const token= e.target.dataset.token
    //    console.log(password,passwordConfirm)
       await resetPassword({password,passwordConfirm},token)
    })
}


