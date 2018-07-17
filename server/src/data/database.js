import MySQLCache from "mysql-cache"
import { config } from "../server"
import { getDebugger } from "../utils/debugutil"
import { readdirSync, readFileSync } from "fs"

export let mysql

const debug = getDebugger("database")

export function setupDatabase() {
    mysql = new MySQLCache(config.mysql)

    mysql.connect(err => {
        if (err) debug("Couldn't connect!", err)
        else debug("Connected to database.")
    })

    const directory = __dirname + "/tables"
    const files = readdirSync(directory)
    files.forEach(file => {
        const contents = readFileSync(directory + "/" + file, "utf8")
        debug("Attempting creation of table", contents)
        mysql.query(contents, (err, res) => {
            if (err) debug("Couldn't create table!", err)
        })
    })
}