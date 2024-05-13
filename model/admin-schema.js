import mongoose from 'mongoose';

const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    token:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    }
});


const Admin=mongoose.model('admin',adminSchema);

export default Admin;