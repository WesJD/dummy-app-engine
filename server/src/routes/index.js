import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/home")
    else res.redirect("/auth/google")
})

export default router