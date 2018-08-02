import { getAuthorizedRouter } from "../utils/routerutil"
import { getDebugger } from "../utils/debugutil"

const debug = getDebugger("projects")
const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    debug("projects", req.session.projects)
    res.render("projects", { projects: req.session.projects })
})

export default router 