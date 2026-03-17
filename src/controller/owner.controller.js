import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Owner } from "../models/owner.model.js";
import { findUser, registerUser } from "../service/user.service.js";
import { findOwner, registerOwner } from "../service/owner.service.js";
import { Booking } from "../models/booking.model.js";




const generateAccessAndRefereshTokens = async(userId) => {
   try {
     const owner = await Owner.findById(userId)
       if (!owner) {
    throw new Error("User not found while generating tokens");
  }
     const accessToken = owner.generateAccessToken()
     const refreshToken = owner.generateRefreshToken()
 
     owner.refreshToken = refreshToken
     await owner.save({ validateBeforeSave: false })
 
     return {accessToken, refreshToken}
   } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and refresh token!!")
   }
}

const createOwner = asyncHandler(async (req, res) => {
    const  { hotelName, password, email, ownerName, phoneNumber, address, availableRooms } =req.body

    if (
        [hotelName, password, email, phoneNumber, address, ownerName, availableRooms ].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are require")
    }

    const checkExistedOwner = {
        email,
        phoneNumber
    }
    const existedUser = await findOwner(checkExistedOwner)

    const createUser = {
        hotelName,
        email,
        password,
        phoneNumber,
        ownerName,
        address,
        availableRooms
    }

    const registeredOwner = await registerOwner(createUser)

    return res.status(201).json(
        new apiResponse(201, registeredOwner.data, registeredOwner.message)
    )
})

const ownerlogin = asyncHandler(async (req, res) => {

    const {email, userName, password} = req.body

    if (!userName && !email) {
        throw new ApiError(401, "Username or email is require.")
    }

    const query = email ? { email } : { userName };

    const user = await Owner.findOne(query)

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await Owner.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken}, "user loggedIn successfull."))
})


const ownerlogout = asyncHandler(async (req, res) => {
    await Owner.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200,{}, "User logout success."))

})


const ownerProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};


const checkIn = asyncHandler(async (req,res)=>{

    const {bookingId} = req.params

    const booking = await Booking.findById(bookingId)

    if(!booking){
        throw new ApiError(404,"Booking not found")
    }

    if(booking.bookingStatus !== "confirmed"){
        throw new ApiError(400,"Booking cannot be checked in")
    }

    booking.bookingStatus = "checked-in"

    await booking.save()

    return res.status(200).json(
        new apiResponse(200, booking,"Check-in successful")
    )

})

const checkOut = asyncHandler(async (req,res)=>{

    const {bookingId} = req.params

    const booking = await Booking.findById(bookingId)

    if(!booking){
        throw new ApiError(404,"Booking not found")
    }

    if(booking.bookingStatus !== "checked-in"){
        throw new ApiError(400,"User has not checked-in")
    }

    booking.bookingStatus = "completed"

    await booking.save()

    const hotel = await Owner.findById(booking.hotel)

    hotel.availableRooms += booking.numberOfRooms

    await hotel.save()

    return res.status(200).json(
        new apiResponse(200, booking,"Check-out successful")
    )

})

const seeBookings = asyncHandler(async (req,res)=>{

    const ownerId = req.user._id

    const bookings = await Booking.find({ hotel: ownerId })
        .populate("user", "fullName email phoneNumber")
        .sort({ createdAt: -1 })

    if(!bookings.length){
        return res.status(200).json(
            new apiResponse(200, [], "No bookings found")
        )
    }

    return res.status(200).json(
        new apiResponse(200, bookings, "Bookings fetched successfully")
    )

})

const seeUserDetails = asyncHandler(async (req,res)=>{

    const {bookingId} = req.params

    const booking = await Booking.findById(bookingId)
        .populate("user", "fullName email phoneNumber")
        .populate("hotel")

    if(!booking){
        throw new ApiError(404,"Booking not found")
    }

    return res.status(200).json(
        new apiResponse(200, booking.user, "User details fetched successfully")
    )

})


export { 
    createOwner, 
    ownerlogin, 
    ownerlogout, 
    ownerProfile, 
    checkIn, 
    checkOut,
    seeBookings,
    seeUserDetails
}