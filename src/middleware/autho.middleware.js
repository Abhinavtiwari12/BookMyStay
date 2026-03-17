import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Owner } from "../models/owner.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"



 const verifyUserjwt = asyncHandler( async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unathorized access")
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "invilad access token.")
        }

        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(400, "invilad token access.")
    }
})


 const verifyOwnerjwt = asyncHandler( async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unathorized access")
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const owner = await Owner.findById(decodedToken?._id).select("-password -refreshToken")

        if (!owner) {
            throw new ApiError(401, "invilad access token.")
        }

        req.user = owner;
        next()

    } catch (error) {
        throw new ApiError(400, "invilad token access.")
    }
})


export { verifyUserjwt, verifyOwnerjwt }