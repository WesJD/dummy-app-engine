import { Router } from "express"
import auth from "./auth/route"
import index from "./index"
import projects from "./projects"
import project from "./project/route"

const router = Router()

router.use("/", index)
router.use("/projects", projects)
router.use("/auth", auth)
router.use("/project", project)

export default router