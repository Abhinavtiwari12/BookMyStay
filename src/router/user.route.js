import { Router } from "express";
import { createUser, userlogin, userlogout } from "../controller/user.controller";
import { verifyUserjwt } from "../middleware/autho.middleware";




const router = Router()


router.route('/createUser').post(createUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserjwt, userlogout)




export default router