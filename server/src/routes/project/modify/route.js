import { getAuthorizedRouter } from "../../../utils/routerutil"
import screen from "./screen"
import element from "./element"
import details from "./details"

const router = getAuthorizedRouter()

router.use("/screen", screen)
router.use("/element", element)
router.use("/details", details)

export default router