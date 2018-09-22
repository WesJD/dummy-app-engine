import { getAuthorizedRouter } from "../../../utils/routerutil"
import pug from "pug"
import { mysql } from "../../../data/database"
import { getDebugger } from "../../../utils/debugutil"
import { server } from "../../../server"
import { newUniqueHash } from "../../../utils/hashutil"
import { createNewElement } from "./element"
import { HEIGHT, WIDTH } from "../editor"

const router = getAuthorizedRouter(true)
const debug = getDebugger("screen")

router.post("/", (req, res) => {
    const project = req.session.projects.find(project => project.hash == req.query.hash)
    if (project) {
        const locals = createNewScreen(project)
        locals.viewport = {
            height: HEIGHT,
            width: WIDTH
        }

        const screenview = pug.renderFile(server.get("views") + "/server/screenview.pug", locals)
        const editarea = pug.renderFile(server.get("views") + "/server/editarea.pug", locals)
        res.json({ hash: locals.hash, screenview, editarea }).status(200).send()
    } else res.status(403)
})

router.delete("/", (req, res) => {

})

export function createNewScreen(project) {
    const hash = newUniqueHash()
    const screen = {
        hash,
        elements: []
    }
    const index = screen.place = project.screens.push(screen) - 1

    mysql.query(
        `
        INSERT INTO screens (hash, project, place) VALUES (?,?,?)
        `,
        [hash, project.hash, index],
        err => {
            if (err) debug("Couldn't create new screen", err)
        }
    )

    createNewElement(screen, "background")

    return { hash, screen, index }
}

export default router