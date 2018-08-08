import { Router } from "express"
import newRoute from "./new"
import editor from "./editor"
import modify from "./modify/route"

const router = Router()

router.use("/new", newRoute)
router.use("/editor", editor)
router.use("/modify", modify)

export default router