const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const crypto=require("crypto")
const validator=require("validator")
const userSchema =new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    photo:{
        type:String,
        default:"default.jpg"
    }
    ,
    password:{
        type:String,
        required:true,
        select:false
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[validator.isEmail,"Wrong Email format"]
    },
    role:{
        type:String,
        enum:["admin","user","lead-guide","guide"],
        default:"user"
    },
    passwordConfirm:{
        type:String,
        required:true,
        validate:{
            validator: function(el){
                return this.password===el
            },
            message:"passwords are not same"
        }
    },
    resetPasswordToken:{
        type: String
    },
    resetTokenExpiresAt: Date,
    passwordChangedAt: Date,
    active:{
        type:Boolean,
        default:true
    },
    phone:{
        type:Number,
        required:true
    }

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
userSchema.methods.correctPassword=function (userPassword,inputPassword) {
    return bcrypt.compare(inputPassword,userPassword)
}
userSchema.methods.generateResetPasswordToken= function(){
    const token= crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken=crypto.createHash('sha256').update(token).digest("hex")
    this.resetTokenExpiresAt= Date.now()+ 60*10*1000
    return token
}
userSchema.methods.isPassUpdate= function (jwtid){
    if(!this.passwordChangedAt){
         return false
    }
    else{
        let time= parseInt(this.passwordChangedAt.getTime()/1000,10)
         return jwtid < time
    }
}
userSchema.pre('find',function(next){
     this.find({active:{'$ne':false}})
     next()
})
userSchema.pre('save',function(next){

     if(!this.isModified('password')||(this.isNew)) return next()
      this.passwordChangedAt=Date.now()
      next()
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    console.log("hello")
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
    next()
 })
const User= new mongoose.model('user',userSchema)
module.exports.User=User