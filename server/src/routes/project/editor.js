import { getAuthorizedRouter } from "../../utils/routerutil"

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    const hash = req.query.hash
    const project = req.session.projects.find(p => p.hash == hash)
    if (project) res.render("editor", { project })
    else res.redirect("/projects")
})

export default router