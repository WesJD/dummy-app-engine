import { getAuthorizedRouter } from "../../../utils/routerutil"
import pug from "pug"
import { mysql } from "../../../data/database"
import { getDebugger } from "../../../utils/debugutil"
import crypto from "crypto"
import { server } from "../../../server";

const router = getAuthorizedRouter(true)
const debug = getDebugger("screen")

router.post("/", (req, res) => {
    const project = req.session.projects.find(project => project.hash == req.query.hash)
    const locals = createNewScreen(project)

    const screenview = pug.renderFile(server.get("views") + "/server/screenview.pug", locals)
    const editarea = pug.renderFile(server.get("views") + "/server/editarea.pug", locals)
    res.json({ screenview, editarea }).status(200).send()
})

router.delete("/", (req, res) => {

})

export function createNewScreen(project) {
    const hash = crypto.createHash("sha1").update(Date.now().toString() + Math.random()).digest("hex")
    const screen = {
        hash,
        elements: [
            {
                type: "background",
                color: "lightgrey"
            }
        ]
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

    return { screen, index }
}

export default router