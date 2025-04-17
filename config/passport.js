import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
import PersonalUser from '../models/PersonalUser.js';
import Role from '../models/Role.js';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.CVW_GOOGLE_CLIENT_ID,
  clientSecret: process.env.CVW_GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const userEmail = profile.emails[0].value;
  const avatarUrl = profile.photos[0].value;
  const googleId = profile.id;

  try {
    let user = await User.findOne({
      where: { email: userEmail },
      include: [Role]
    });

    if (!user) {
      user = await User.create({
        email: userEmail,
        typeAccount: 'GOOGLE',
      });

      const role = await Role.findOne({ where: { name: 'candidate' } });
      await user.setRole(role);
    }

    let personalUser = await PersonalUser.findOne({ where: { userId: user.id } });

    if (!personalUser) {
      personalUser = await PersonalUser.create({
        googleId: googleId,
        name: profile.displayName,
        email: userEmail,
        userId: user.id,
        avatarUrl: avatarUrl,
      });
    } else {
      if (!personalUser.googleId) {
        personalUser.googleId = googleId;
        await personalUser.save();
      }
    }

    done(null, user);
  } catch (error) {
    console.error('Lỗi trong quá trình xác thực:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});