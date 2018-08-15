import { getAuthorizedRouter } from "../../../utils/routerutil"
import screen from "./screen"
import element from "./element"

const router = getAuthorizedRouter()

router.use("/screen", screen)
router.use("/element", element)

export default router