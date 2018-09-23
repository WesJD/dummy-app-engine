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
        req.project = project
        if (req.method == "PUT") next()
        else {
            const screen = project.screens.find(screen => screen.hash == req.query.screen)
            if (screen) {
                req.screen = screen
                next()
            } else res.status(400).send()
        }
    } else res.status(403).send()
})

router.post("/", (req, res) => {
    const element = createNewElement(req.screen, req.query.type)
    const rendered = pug.renderFile(server.get("views") + "/server/element.pug", { element })
    res.json({ hash: element.hash, rendered }).status(200).send()
})

router.put("/", (req, res) => {
    req.body.changes.forEach(change => {
        const screen = req.project.screens.find(screen => screen.hash == change.screenHash)
        if (screen) {
            const element = screen.elements.find(element => element.hash == change.elementHash)
            if (element) {
                switch (change.action) {
                    case "background":
                        element.background = change.background
                        mysql.query(
                            `UPDATE elements SET background = ? WHERE hash = ?`,
                            [change.background, element.hash],
                            err => {
                                if (err) debug("Couldn't update background for element", err)
                            }
                        )
                        break
                    case "resize":
                        element.height = change.height
                        element.width = change.width
                        mysql.query(
                            `UPDATE elements SET height = ?, width = ? WHERE hash = ?`,
                            [element.height, element.width, element.hash],
                            err => {
                                if (err) debug("Couldn't resize element!", err)
                            }
                        )
                        break
                    case "position":
                        element.x = change.x
                        element.y = change.y
                        mysql.query(
                            `UPDATE elements SET x = ?, y = ? WHERE hash = ?`,
                            [change.x, change.y, element.hash],
                            err => {
                                if (err) debug("Couldn't change position of element!", err)
                            }
                        )
                        break
                    default:
                        res.status(403).send()
                        break
                }
            } else res.status(400).send()
        } else res.status(400).send()
    })
    res.status(200).send()
    req.session.save()
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