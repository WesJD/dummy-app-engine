import { Router } from "express"

export function getAuthorizedRouter(noRedirect) {
    const router = Router()
    router.use((req, res, next) => {
        if (req.session.user) next()
        else if (noRedirect) res.status(401).send("Unauthorized.")
        else res.redirect("/")
    })
    return router
}