import { createClient } from 'redis';
import { REDIS_URL } from '../config/env.config';

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err:any) => {
  console.error('Redis Client Error:', err);
});

redisClient.connect()
  .then(() => console.log('🟢 Connected to Redis successfully'))
  .catch((err:any) => console.error('🔴 Redis connection failed:', err));

export { redisClient };
