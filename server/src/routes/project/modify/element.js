import { getAuthorizedRouter } from "../../../utils/routerutil"
import { newUniqueHash } from "../../../utils/hashutil"
import { mysql } from "../../../data/database"
import { getDebugger } from "../../../utils/debugutil"
import pug from "pug"
import { server } from "../../../server"
import express from "express"
import { HEIGHT, WIDTH } from "../editor"

const CENTER_Y = HEIGHT / 2
const CENTER_X = WIDTH / 2

const router = getAuthorizedRouter(true)
const debug = getDebugger("element")

router.use(express.json())
router.use((req, res, next) => {
    const project = req.session.projects.find(project => project.hash == req.query.project)
    if (project) {
        const screen = project.screens.find(screen => screen.hash == req.query.screen)
        if (screen) {
            req.screen = screen
            req.project = project
            next()
        } else res.status(400)
    } else res.status(403)
})

router.post("/", (req, res) => {
    const element = createNewElement(req.screen, req.query.type)
    const rendered = pug.renderFile(server.get("views") + "/server/element.pug", { element })
    res.json({ hash: element.hash, rendered }).status(200).send()
})

router.put("/", (req, res) => {
    req.body.changes.forEach(change => {

    })
})

router.delete("/", (req, res) => {
    const hash = req.query.element
    req.screen.elements.splice(req.screen.elements.findIndex(element => element.hash == hash), 1)
    req.session.save() //sessions annoy :(
    mysql.query(
        `DELETE FROM elements WHERE hash = ?`,
        [hash],
        err => {
            if (err) debug("Couldn't delete element!", err)
        }
    )
})

export function createNewElement(screen, type) {
    const hash = newUniqueHash()

    let background = "transparent"
    let width
    let height
    switch (type) {
        case "background":
            background = "grey"
        default:
            width = 100
            height = 100
            break
    }

    const x = Math.floor(CENTER_X - (width / 2))
    const y = Math.floor(CENTER_Y - (height / 2))

    mysql.query(
        `INSERT INTO elements (hash, screen, type, x, y, width, height, background) VALUES (?,?,?,?,?,?,?,?)`,
        [hash, screen.hash, type, x, y, width, height, background],
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