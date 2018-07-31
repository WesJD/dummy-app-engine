import { getAuthorizedRouter } from "../utils/routerutil"

const router = getAuthorizedRouter()

router.get("/", (req, res) => {
    res.render("home", {
        projects: [
            {
                name: "My Project",
                description: "This project is really great and I am making it for class."
            },
            {
                name: "My Project",
                description: "This project is really great and I am making it for class. hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello "
            },
            {
                name: "My Project",
                description: "This project is really great"
            },
            {
                name: "My Project",
                description: "This "
            },
        ]
    })
})

export default router 