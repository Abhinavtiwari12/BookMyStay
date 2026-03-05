import express from "express";
import mongoose, { Schema } from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const ownerSchema = new Schema ({
    hotelName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        minlength: 10,
        maxLength: 13
    },
    email: {
        type: String,
        required :true,
        unique: true,
        lowercase: true,
        trim: true,
        validate:{
            validator: validator.isEmail,
            message: "Invilade email"
        }
    },
    password:{
        type: String,
        required: true
    },
    availableRooms: {
        type: Number,
        required :true,
        default: 0
    },
    refreshToken:{
        type: String
    }
},{timestamps: true}
)



ownerSchema.pre("save", async function () {
    if (!this.isModified("password")) return; 

    this.password = await bcrypt.hash(this.password, 15)
})

ownerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


ownerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

ownerSchema.methods.generateRefreshToken = function () {
    return jwt.sign( {
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {

        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const  Owner = new mongoose.model("Owner", ownerSchema)