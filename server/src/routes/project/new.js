import { getDebugger } from "../../utils/debugutil"
import { getAuthorizedRouter } from "../../utils/routerutil"
import crypto from "crypto"
import { mysql } from "../../data/database"

const debug = getDebugger("project:new")
const router = getAuthorizedRouter(true)

router.post("/", (req, res) => {
    const name = req.query.name
    const description = req.query.description

    if (!name || !description) {
        res.status(400).send("Invalid data.")
    } else {
        const hash = crypto.createHash("sha1").update(Date.now().toString() + Math.random()).digest("hex")
        mysql.query(
            `INSERT INTO projects (hash, owner, name, description) VALUES (?,?,?,?)`,
            [hash, req.session.user.id, name, description],
            (err, result) => {
                if (err) {
                    debug("Couldn't create project!", err)
                    res.status(500).send()
                } else {
                    req.session.projects.push({ hash, name, description })
                    res.status(200).send(hash)
                }
            }
        )
    }
})

export default router