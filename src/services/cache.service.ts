import { redisUtils } from '../utils/redisUtils.js';

export class CacheService {
  private defaultTTL: number;

  constructor(defaultTTL = 3600) {
    this.defaultTTL = defaultTTL;
  }

  // ========================
  // USER CACHE (using email)
  // ========================

  async cacheUser(email: string, userData: any, ttl?: number): Promise<void> {
    const key = `user:${email}`;
    await redisUtils.setJSON(key, userData, ttl || this.defaultTTL);
  }

  async getCachedUser(email: string): Promise<any | null> {
    const key = `user:${email}`;
    return await redisUtils.getJSON(key);
  }

  async invalidateUser(email: string): Promise<void> {
    const key = `user:${email}`;
    await redisUtils.del(key);
  }

  // ===================================
  // Caching for all pages/queries
  // ===================================

  async cacheQuery(queryKey: string, data: any, ttl?: number): Promise<void> {
    const key = `query:${queryKey}`;
    await redisUtils.setJSON(key, data, ttl || this.defaultTTL);
  }

  async getCachedQuery<T>(queryKey: string): Promise<T | null> {
    const key = `query:${queryKey}`;
    return await redisUtils.getJSON<T>(key);
  }

  // =====================================
  // SESSIONS
  // =====================================

  async createSession(sessionId: string, userId: string, ttl = 86400): Promise<void> {
    const key = `session:${sessionId}`;
    await redisUtils.setJSON(key, { userId, createdAt: Date.now() }, ttl);
  }

  async getSession(sessionId: string) {
    const key = `session:${sessionId}`;
    return await redisUtils.getJSON(key);
  }

  async deleteSession(sessionId: string) {
    await redisUtils.del(`session:${sessionId}`);
  }

  // ======================================
  // RATE LIMIT
  // ======================================

  async incrementRateLimit(identifier: string, windowMs: number): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const count = await redisUtils.incr(key);

    if (count === 1) {
      await redisUtils.expire(key, Math.ceil(windowMs / 1000));
    }

    return count;
  }

  async getRateLimitCount(identifier: string) {
    const key = `ratelimit:${identifier}`;
    const value = await redisUtils.get(key);
    return value ? parseInt(value) : 0;
  }

  // ======================================
  // TOKEN BLACKLIST
  // ======================================

  async blacklistToken(token: string, expiresIn: number) {
    await redisUtils.setEx(`blacklist:${token}`, '1', expiresIn);
  }

  async isTokenBlacklisted(token: string) {
    return await redisUtils.exists(`blacklist:${token}`);
  }

  // Generic helpers
  async set(key: string, value: any, ttl?: number) {
    await redisUtils.setJSON(key, value, ttl || this.defaultTTL);
  }

  async get<T>(key: string) {
    return await redisUtils.getJSON<T>(key);
  }

  async delete(key: string) {
    await redisUtils.del(key);
  }

  async deleteByPattern(pattern: string) {
    return await redisUtils.deleteByPattern(pattern);
  }

  async exists(key: string) {
    return await redisUtils.exists(key);
  }

  async warmCache(key: string, fetchFn: () => Promise<any>, ttl?: number): Promise<any> {
    const cached = await this.get(key);
    if (cached) return cached;

    const data = await fetchFn();
    await this.set(key, data, ttl);

    return data;
  }
}

export const cacheService = new CacheService(parseInt(process.env.REDIS_TTL || '3600'));
