import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  private client: RedisClientType | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      console.log('⚡ Redis already connected');
      return;
    }

    try {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
        },
        password: process.env.REDIS_PASSWORD?.trim() ? process.env.REDIS_PASSWORD : undefined,
      });

      this.client.on('connect', () => console.log('🔄 Redis connecting...'));
      this.client.on('ready', () => {
        this.isConnected = true;
        console.log('✅ Redis connected successfully');
      });
      this.client.on('error', (err) => {
        this.isConnected = false;
        console.error('❌ Redis Client Error:', err);
      });
      this.client.on('reconnecting', () => {
        this.isConnected = false;
        console.log('🔄 Redis reconnecting...');
      });

      await this.client.connect();
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  getClient(): RedisClientType {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      console.log('👋 Redis disconnected');
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }

  // Add methods needed for testing
  async select(db: number): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    await this.client.select(db);
  }

  async flushDb(): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    await this.client.flushDb();
  }

  isOpen(): boolean {
    return this.isConnected && this.client !== null;
  }
}

export const redisClient = new RedisClient();
