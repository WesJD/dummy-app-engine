import { getAuthorizedRouter } from "../../utils/routerutil"

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    const hash = req.query.hash
    if (req.session.projects.some(project => project.hash == hash)) {
        res.render("edit")
    } else res.redirect("/projects")
})

export default router