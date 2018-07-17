import passport from "passport/lib"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth/lib"
import { mysql } from "./data/database"
import { getDebugger } from "./utils/debugutil"
import { User } from "./data/user"
import { config } from "./server"

const debug = getDebugger("passport")

export function setupPassport() {
    passport.use(new GoogleStrategy(config.passport.google, (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            mysql.query(
                `INSERT INTO accounts (id, name) VALUES (?,?) 
                ON DUPLICATE KEY UPDATE name = VALUES(name)`,
                [profile.id, profile.displayName],
                err => {
                    if (err) {
                        debug("Couldn't update profile information!", err)
                        done(err)
                    } else done(null, new User(profile.id, profile.displayName))
                }
            )
        })
    }))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        mysql.query(
            "SELECT name FROM accounts WHERE id = ?",
            [id],
            (err, res) => {
                if (err) {
                    debug("Couldn't get profile information!", err)
                    done(err)
                } else done(null, new User(id, res[0].name))
            }
        )
    })
}