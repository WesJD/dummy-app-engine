import { getAuthorizedRouter } from "../utils/routerutil"

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    res.render("home")
})

export default router 