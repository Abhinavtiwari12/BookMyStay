import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { findUser, registerUser } from "../service/user.service.js";
import { Booking } from "../models/booking.model.js";
import { searchQuery } from "../queries/hotel.queries.js";
import { Owner } from "../models/owner.model.js";




const generateAccessAndRefereshTokens = async(userId) => {
   try {
     const user = await User.findById(userId)
       if (!user) {
    throw new Error("User not found while generating tokens");
  }
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
 
     user.refreshToken = refreshToken
     await user.save({ validateBeforeSave: false })
 
     return {accessToken, refreshToken}
   } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and refresh token!!")
   }
}


const createUser = asyncHandler(async (req, res) => {
    const  { fullName, password, email, userName,phoneNumber } =req.body

    if (
        [fullName, userName, password, email, phoneNumber].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are require")
    }

    const checkExistedUser = {
        userName,
        email
    }
    const existedUser = await findUser(checkExistedUser)

    const createUser = {
        fullName,
        email,
        password,
        phoneNumber,
        userName: userName.toLowerCase()
    }

    const registeredUser = await registerUser(createUser)

    return res.status(201).json(
        new apiResponse(201, registeredUser.data, registeredUser.message)
    )
})


const userlogin = asyncHandler(async (req, res) => {

    const {email, userName, password} = req.body

    if (!userName && !email) {
        throw new ApiError(401, "Username or email is require.")
    }

    const query = email ? { email } : { userName };

    const user = await User.findOne(query)

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken}, "user loggedIn successfull."))
})


const userlogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
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


const userProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};


const bookHotel = asyncHandler(async (req,res)=>{

    const {hotelId, checkInDate, checkOutDate, numberOfRooms} = req.body

    if(!hotelId || !checkInDate || !checkOutDate || !numberOfRooms){
        throw new ApiError(400,"All fields are required")
    }

    const hotel = await Owner.findById(hotelId)

    if(!hotel){
        throw new ApiError(404,"Hotel not found")
    }

    if(hotel.availableRooms < numberOfRooms){
        throw new ApiError(400,"Rooms not available")
    }

    // calculate total price
    const days = Math.ceil(
        (new Date(checkOutDate) - new Date(checkInDate)) /
        (1000 * 60 * 60 * 24)
    )

    const totalPrice = days * hotel.pricePerNight * numberOfRooms

    const booking = await Booking.create({
        user:req.user._id,
        hotel:hotelId,
        checkInDate,
        checkOutDate,
        numberOfRooms,
        totalPrice
    })

    // update available rooms
    hotel.availableRooms -= numberOfRooms
    await hotel.save()

    return res.status(201).json(
        new apiResponse(201, booking, "Hotel booked successfully")
    )

})

const getMyBookings = asyncHandler(async (req,res)=>{

    const bookings = await Booking.find({user:req.user._id})
    .populate("hotel","hotelName address pricePerNight")

    return res.status(200).json(
        new apiResponse(200, bookings,"User bookings fetched successfully")
    )

})

const cancelBooking = asyncHandler(async (req,res)=>{

    const {bookingId} = req.params

    const booking = await Booking.findById(bookingId)

    if(!booking){
        throw new ApiError(404,"Booking not found")
    }

    if(booking.bookingStatus === "cancelled"){
        throw new ApiError(400,"Booking already cancelled")
    }

    booking.bookingStatus = "cancelled"
    await booking.save()

    const hotel = await Owner.findById(booking.hotel)

    hotel.availableRooms += booking.numberOfRooms
    await hotel.save()

    return res.status(200).json(
        new apiResponse(200, booking,"Booking cancelled successfully")
    )

})


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
const searchHotels = asyncHandler(async (req,res)=>{

    const {city, hotelName} = req.query

    let filter = {}

    if(city){
        filter.city = { $regex: city, $options: "i" }
    }

    if(hotelName){
        filter.hotelName = { $regex: hotelName, $options: "i" }
    }

    const hotels = await Owner.find(filter)

    return res.status(200).json(
        new apiResponse(200, hotels, "Hotels fetched successfully")
    )

})

const getMyBookingHistory = asyncHandler(async (req,res)=>{

    const userId = req.user._id
    const {status, page = 1, limit = 10} = req.query

    let filter = { user: userId }

    if(status){
        filter.bookingStatus = status
    }

    const skip = (page - 1) * limit

    const bookings = await Booking.find(filter)
        .populate("hotel", "hotelName address city pricePerNight")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))

    const total = await Booking.countDocuments(filter)

    return res.status(200).json(
        new apiResponse(200, {
            total,
            page: Number(page),
            bookings
        }, "User booking history fetched successfully")
    )

})



export { 
    createUser, 
    userlogin, 
    userlogout, 
    userProfile, 
    bookHotel, 
    getMyBookings, 
    cancelBooking,
    checkIn, 
    checkOut,
    searchHotels,
    getMyBookingHistory
}