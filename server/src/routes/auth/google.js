import { Router } from "express"
import passport from "passport"

const router = Router()

router.get("/", passport.authenticate("google", { scope: ["profile"] }))

router.get(
    "/callback",
    passport.authenticate("google", { failureRedirect: "/auth/google" }),
    (req, res) => res.redirect("/home")
)

export default router