import { getAuthorizedRouter } from "../../utils/routerutil"

const UPDATE_INTERVAL = 1000 * 2
export const HEIGHT = 16 * 40
export const WIDTH = 9 * 40

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    const hash = req.query.hash
    const project = req.session.projects.find(p => p.hash == hash)
    if (project) {
        res.render("editor", {
            project,
            updateInterval: UPDATE_INTERVAL,
            viewport: {
                height: HEIGHT,
                width: WIDTH
            }
        })
    } else res.redirect("/projects")
})

export default router