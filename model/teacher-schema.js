import mongoose from 'mongoose';

const teacherSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    token:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    profileImage:{
        type:String,
        // required:true
    },
    dob:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        required:true,
        trim:true
    },
    experience:{
        type:String,
        required:true,
        trim:true
    },
    qualification:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    aadharcardno:{
        type:Number,
        trim:true,
        required:true
    },
    pancardno:{
        type:String,
        trim:true,
        required:true
    },
    watsappcontact:{
        type:Number,
        trim:true,
        required:true
    },
    normalcontact:{
        type:Number,
        trim:true,
        required:true
    }

});


const Teacher=mongoose.model('teacher',teacherSchema);

export default Teacher;