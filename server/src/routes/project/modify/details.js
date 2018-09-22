import { getAuthorizedRouter } from "../../../utils/routerutil"
import express from "express"
import { mysql } from "../../../data/database"
import { getDebugger } from "../../../utils/debugutil"

const debug = getDebugger("modify:details")
const router = getAuthorizedRouter(true)

router.use(express.json())

router.post("/", (req, res) => {
    const project = req.session.projects.find(proj => proj.hash == req.query.project)
    if (project) {
        debug("name", req.body.name)
        const newName = req.body.name
        const newDescription = req.body.description
        if (newName && newDescription) {
            project.name = newName
            project.description = newDescription
            req.session.save()

            mysql.query(
                `UPDATE projects SET name = ?, description = ? WHERE hash = ?`,
                [newName, newDescription, req.query.project],
                err => {
                    if (err) debug("Couldn't update details!", err)
                }
            )
        } else res.status(400)
    } else res.status(403)
})

export default router