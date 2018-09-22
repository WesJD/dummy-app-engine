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
            SELECT projects.hash, projects.name, projects.description, screens.hash AS screen_hash, screens.place,
                   elements.hash AS element_hash, elements.type, elements.x, elements.y, elements.width, elements.height,
                   elements.background, elements.text
            FROM projects
            LEFT JOIN screens ON screens.project = projects.hash
            LEFT JOIN elements ON elements.screen = screens.hash
            WHERE projects.owner = ?
            ORDER BY projects.hash, screens.place ASC
            `,
            [req.session.user.id],
            (err, results) => {
                if (err) {
                    debug("Couldn't get user data!", err)
                    res.redirect("/")
                } else {
                    debug("results", JSON.stringify(results))

                    for (let i = 0; i < results.length; i++) {
                        const result = results[i]
                        const project = {
                            hash: result.hash,
                            name: result.name,
                            description: result.description,
                            screens: []
                        }

                        function insertScreen(result, elements) {
                            project.screens.push({
                                hash: result.screen_hash,
                                place: result.place,
                                elements
                            })
                        }

                        let j
                        for (j = i; j < results.length; j++) {
                            const lowerResult = results[j]
                            if (lowerResult.hash != result.hash) {
                                j--
                                break
                            }

                            const elements = []
                            if (lowerResult.element_hash) {
                                for (let k = j; k < results.length; k++) {
                                    const evenLowerResult = results[k]
                                    if (evenLowerResult.screen_hash != lowerResult.screen_hash) {
                                        k--
                                        break
                                    }

                                    elements.push({
                                        hash: evenLowerResult.element_hash,
                                        type: evenLowerResult.type,
                                        x: evenLowerResult.x,
                                        y: evenLowerResult.y,
                                        width: evenLowerResult.width,
                                        height: evenLowerResult.height,
                                        background: evenLowerResult.background,
                                        text: evenLowerResult.text
                                    })

                                    j = k
                                }
                                debug("elements", JSON.stringify(elements))
                            }

                            insertScreen(lowerResult, elements)
                        }

                        projects.push(project)
                        i = j
                    }

                    res.redirect("/projects")
                }
            }
        )
    }
)

export default router