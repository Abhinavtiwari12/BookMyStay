import { Router } from "express";
import { bookHotel, cancelBooking, checkIn, checkOut, createUser, getMyBookings, userlogin, userlogout, userProfile } from "../controller/user.controller";
import { verifyUserjwt } from "../middleware/autho.middleware";




const router = Router()


router.route('/createUser').post(createUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserjwt, userlogout)
router.route('/userProfile').get(verifyUserjwt, userProfile)
router.route('/bookHotel').post(verifyUserjwt, bookHotel)
router.route('/getMyBookings').get(verifyUserjwt,getMyBookings)
router.route('/cancelBooking/:bookingId').post(verifyUserjwt, cancelBooking)
router.route('/checkIn/:bookingId').post(verifyUserjwt,checkIn)
router.route('/checkOut/:bookingId').post(verifyUserjwt,checkOut)
// router.route('/searchHotels')




export default router