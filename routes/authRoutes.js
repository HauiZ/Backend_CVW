import express from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false})
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

export default router;
