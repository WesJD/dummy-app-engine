import { getAuthorizedRouter } from "../../../utils/routerutil"
import { newUniqueHash } from "../../../utils/hashutil"
import { mysql } from "../../../data/database"
import { getDebugger } from "../../../utils/debugutil"
import pug from "pug"
import { server } from "../../../server";

const CENTER_X = 193.5
const CENTER_Y = 344

const router = getAuthorizedRouter(true)
const debug = getDebugger("element")

router.post("/", (req, res) => {
    const project = req.session.projects.find(project => project.hash == req.query.project)
    if (project) {
        const screen = project.screens.find(screen => screen.hash == req.query.screen)
        if (screen) {
            const element = createNewElement(screen, req.query.type)
            const rendered = pug.renderFile(server.get("views") + "/server/element.pug", { element })
            res.json({ rendered }).status(200).send()
        } else res.status(400)
    } else res.status(403)
})

router.delete("/", (req, res) => {

})

export function createNewElement(screen, type) {
    const hash = newUniqueHash()

    let width
    let height
    switch (type) {
        case "background":
            width = 100
            height = 100
            break
        default:
            throw new Error("Element type doesn't exist.")
    }

    const x = Math.floor(CENTER_X - (width / 2))
    const y = Math.floor(CENTER_Y - (height / 2))

    mysql.query(
        `INSERT INTO elements (hash, screen, type, x, y, width, height) VALUES (?,?,?,?,?,?,?)`,
        [hash, screen.hash, type, x, y, width, height],
        err => {
            if (err) debug("Couldn't insert element!", err)
        }
    )

    const obj = {
        hash,
        type,
        x,
        y,
        width,
        height
    }
    screen.elements.push(obj)

    return obj
}

export default router