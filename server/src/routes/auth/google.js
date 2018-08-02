import { Router } from "express"
import passport from "passport"
import { getDebugger } from "../../utils/debugutil"
import { mysql } from "../../data/database"

const debug = getDebugger("authentication:google")
const router = Router()

router.get("/", passport.authenticate("google", { scope: ["profile"] }))

router.get(
    "/callback",
    passport.authenticate("google", { failureRedirect: "/auth/google" }),
    (req, res) => {
        req.session.user = req.user
        req.session.projects = []

        mysql.query(
            "SELECT hash, name, description FROM projects WHERE owner = ?",
            [req.session.user.id],
            (err, result) => {
                if (err) {
                    debug("Couldn't get user data!", err)
                    res.redirect("/")
                } else {
                    req.session.projects = result
                    res.redirect("/projects")
                }
            }
        )
    }
)

export default router