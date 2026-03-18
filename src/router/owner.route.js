import { Router } from "express";
import { checkIn, checkOut, createOwner, ownerlogin, ownerlogout, ownerProfile, seeBookings, seeUserDetails } from "../controller/owner.controller";
import { verifyOwnerjwt } from "../middleware/autho.middleware";




const router = Router()


router.route('/createOwner').post(createOwner)
router.route('/ownerlogin').post(ownerlogin)
router.route('/ownerlogout').post(verifyOwnerjwt,ownerlogout)
router.route('/ownerProfile/:bookingId').post(verifyOwnerjwt,ownerProfile)
router.route('/checkIn/:bookingId').post(verifyOwnerjwt,checkIn)
router.route('/checkOut/:bookingId').post(verifyOwnerjwt,checkOut)
router.route('/seeBookings').post(verifyOwnerjwt,seeBookings)
router.route('/seeUserDetails/:bookingId').post(verifyOwnerjwt,seeUserDetails)




export default router