import { Router } from "express"
import auth from "./auth/route"
import index from "./index"
import home from "./home"

const router = Router()

router.use("/", index)
router.use("/home", home)
router.use("/auth", auth)

export default router