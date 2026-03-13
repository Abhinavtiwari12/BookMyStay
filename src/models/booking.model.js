import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    hotel:{
        type:Schema.Types.ObjectId,
        ref:"Owner",
        required:true
    },

    checkInDate:{
        type:Date,
        required:true
    },

    checkOutDate:{
        type:Date,
        required:true
    },

    numberOfRooms:{
        type:Number,
        required:true
    },

    totalPrice:{
        type:Number
    },

    bookingStatus:{
        type:String,
        enum:["confirmed","cancelled","completed"],
        default:"confirmed"
    }

},{timestamps:true})