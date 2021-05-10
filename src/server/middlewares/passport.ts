import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'

import { JWT_SECRET } from '../config'
import { JwtPayload } from '../common/types'
import User from '../models/User'

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) return done(null, false)

        const isPasswordValid = await user.verifyPassword(password)
        if (!isPasswordValid) return done(null, false)

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new JwtStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: (req) => req.cookies['x-auth'],
    },
    async (payload: JwtPayload, done) => {
      try {
        const user = await User.findById(payload.id)
        if (!user) return done(null, false)

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)
