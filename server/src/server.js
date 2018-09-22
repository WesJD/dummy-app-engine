import express from "express"
import { getDebugger } from "./utils/debugutil"
import passport from "passport/lib"
import { setupDatabase } from "./data/database"
import { setupPassport } from "./passport"
import session from "express-session"
import routes from "./routes/registry"
import { urlencoded } from "body-parser"

export const config = require("../config.json")
const debug = getDebugger("server")
const clientDirectory = getViewsDirectory()

setupDatabase()
setupPassport()

export const server = express()

server.set("view engine", "pug")
server.set("views", clientDirectory)

server.use(express.static(clientDirectory))

server.use(urlencoded({ extended: false }))

server.use(session(config.session))

server.use(passport.initialize())
server.use(passport.session())

server.use(routes)

server.listen(config.port, () => debug("Started on port", config.port))

export function getViewsDirectory() {
    let base = __dirname + "/../../client/"
    if (process.env.NODE_ENV == "production") {
        base += "bin"
    } else {
        base += "src"
    }
    return base
}