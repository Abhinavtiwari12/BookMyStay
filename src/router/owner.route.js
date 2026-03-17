import { Router } from "express";
import { createOwner, ownerlogin, ownerlogout } from "../controller/owner.controller";
import { verifyOwnerjwt } from "../middleware/autho.middleware";




const router = Router()


router.route('/createOwner').post(createOwner)
router.route('/ownerlogin').post(ownerlogin)
router.route('/ownerlogout').post(verifyOwnerjwt,ownerlogout)




export default router