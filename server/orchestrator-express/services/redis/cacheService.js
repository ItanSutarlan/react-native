const Redis = require('ioredis');

class CacheService {
  constructor() {
    if (typeof CacheService.INSTANCE === 'object') {
      return CacheService.INSTANCE;
    }

    this._client = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });

    CacheService.INSTANCE = this;
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, 'EX', expirationInSecond);
  }

  async get(key) {
    const result = await this._client.get(key);

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
