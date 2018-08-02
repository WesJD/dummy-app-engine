import passport from "passport/lib"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth/lib"
import { mysql } from "./data/database"
import { getDebugger } from "./utils/debugutil"
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
                    } else done(null, profile)
                }
            )
        })
    }))

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((id, done) => done(null, id))
}