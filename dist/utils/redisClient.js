"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const env_config_1 = require("../config/env.config");
const redisClient = (0, redis_1.createClient)({
    url: env_config_1.REDIS_URL,
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
redisClient.connect()
    .then(() => console.log('🟢 Connected to Redis successfully'))
    .catch((err) => console.error('🔴 Redis connection failed:', err));
