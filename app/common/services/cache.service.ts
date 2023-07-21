import Redis from 'ioredis';
import config from '@common/utils/redis';

export const cache = new Redis(config);