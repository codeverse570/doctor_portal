class appError extends Error{
     constructor(errStatus,message){
          super(message)
          this.errStatus=errStatus
          this.statusCode=404
          this.isOperational=true
     }
}
module.exports=appError;