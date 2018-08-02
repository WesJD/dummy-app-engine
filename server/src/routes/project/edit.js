import { getAuthorizedRouter } from "../../utils/routerutil"

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    res.render("edit")
})

export default router