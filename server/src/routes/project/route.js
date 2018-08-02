import { Router } from "express"
import newRoute from "./new"
import edit from "./edit"

const router = Router()

router.use("/new", newRoute)
router.use("/edit", edit)

export default router