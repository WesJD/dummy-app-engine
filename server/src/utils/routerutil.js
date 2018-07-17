import { Router } from "express"

export function getAuthorizedRouter() {
    const router = Router()
    router.use(authorizeMiddleware)
    return router
}

function authorizeMiddleware(req, res, next) {
    if (req.isAuthenticated()) next()
    else res.redirect("/")
}