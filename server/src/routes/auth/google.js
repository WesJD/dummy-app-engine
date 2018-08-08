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
        const projects = req.session.projects = []

        mysql.query(
            `
            SELECT projects.hash, projects.name, projects.description, screens.hash AS screen_hash, screens.place 
            FROM projects 
            LEFT JOIN screens 
            ON screens.project = projects.hash 
            WHERE projects.owner = ?
            ORDER BY screens.place ASC
            `,
            [req.session.user.id],
            (err, results) => {
                if (err) {
                    debug("Couldn't get user data!", err)
                    res.redirect("/")
                } else {
                    debug("results", JSON.stringify(results))

                    outer:
                    for (let i = 0; i < results.length; i++) {
                        const result = results[i]
                        const project = {
                            hash: result.hash,
                            name: result.name,
                            description: result.description,
                            screens: []
                        }

                        function insertScreen(result) {
                            project.screens.push({
                                hash: result.hash,
                                place: result.place
                            })
                        }

                        insertScreen(result)
                        for (let j = i; j < results.length; j++) {
                            const lowerResult = results[j]
                            if (lowerResult.hash != result.hash) continue outer;
                            insertScreen(lowerResult)
                        }
                    }

                    res.redirect("/projects")
                }
            }
        )
    }
)

export default router