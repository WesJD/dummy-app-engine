import { getAuthorizedRouter } from "../../utils/routerutil"
import { readdirSyncRecursive } from "../../utils/fileutil"
import { getDebugger } from "../../utils/debugutil"
import { getViewsDirectory } from "../../server"

const UPDATE_INTERVAL = 1000 * 2
export const HEIGHT = 16 * 40
export const WIDTH = 9 * 40

const scriptList = getScripts()
const router = getAuthorizedRouter()
const debug = getDebugger("editor")

router.get("/", (req, res) => {
    const hash = req.query.hash
    const project = req.session.projects.find(p => p.hash == hash)
    if (project) {
        const scripts = process.env.NODE_ENV == "production" ? scriptList : getScripts()
        res.render("editor", {
            project,
            updateInterval: UPDATE_INTERVAL,
            scripts,
            viewport: {
                height: HEIGHT,
                width: WIDTH
            }
        })
    } else res.redirect("/projects")
})

function getScripts() {
    const clientSource = getViewsDirectory()
    let paths = readdirSyncRecursive(clientSource + "/scripts/editor")
    paths = paths.map(path => path.substring(clientSource.length))
    return paths
}

export default router