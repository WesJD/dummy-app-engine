import { getAuthorizedRouter } from "../../../utils/routerutil"
import screen from "./screen"

const router = getAuthorizedRouter()

router.use("/screen", screen)

export default router