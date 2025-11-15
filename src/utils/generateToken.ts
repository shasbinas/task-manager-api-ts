import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: number; // FIXED (was string)
  email: string; // FIXED (your loginUser sends email)
  role: string; // FIXED (your loginUser sends role)
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not set in environment');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  });
};
