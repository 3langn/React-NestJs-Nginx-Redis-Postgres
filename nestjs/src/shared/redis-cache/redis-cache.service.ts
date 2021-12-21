import { Inject, Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';

import { PostEntity } from 'src/post/post';
import { gzip, unzipSync } from 'zlib';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  constructor(@Inject('CacheService') private cacheManager) {}

  async compressAndSetToRedis(key, data) {
    this.logger.debug('compress data');
    try {
      gzip(JSON.stringify(data), async (error, result) => {
        if (error) {
          throw error;
        }
        this.cacheManager.rpush(key, result);
      });
    } catch (error) {
      throw error;
    }
  }

  unzipFromRedis(data) {
    const unzip = unzipSync(data);
    return JSON.parse(unzip.toString());
  }

  async setOrGetCacheList(key, cb: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      let data = [];
      this.cacheManager.lrange(key, 0, -1, async (err, reply) => {
        if (err) {
          return reject(err);
        }
        if (reply.length > 0) {
          data = reply.map((item) => {
            const entity = this.unzipFromRedis(item);
            return entity;
          });
          return resolve(data);
        }
        const resultDB = await cb();
        this.cacheManager.expire(key, 3600);
        this.logger.debug(JSON.stringify(resultDB));

        resultDB.forEach((element) => {
          this.compressAndSetToRedis(key, element);
        });
        resolve(resultDB);
      });
    });
  }

  setOneToRedis = (key, data) => {
    const result = this.cacheManager.get(`${key}_${data._id}`);
    JSON.stringify(result);
  };

  getPostById = async (key, cb) => {
    return new Promise(async (resolve, reject) => {
      let result;
      this.cacheManager.get(key, async (err, data: string) => {
        if (err) reject(err);
        if (data) {
          result = JSON.parse(data);
        } else {
          result = await cb();
        }
        this.setOneToRedis(key, result);
        resolve(result);
      });
    });
  };

  async setToRedis(key, cb): Promise<any> {
    const data = await cb();
    this.logger.debug(' redis');

    return new Promise((resolve, reject) => {
      // nếu đã tồn tại key posts (Redis đã có dữ liệu) thì append vào list trong redis
      if (this.cacheManager.exists(key)) {
        this.logger.debug('get data from redis');
        this.compressAndSetToRedis(key, data);
      }
      this.logger.debug('set one data to redis');
      // set đơn để get bằng id
      this.setOneToRedis(key, data);
      resolve(data);
    });
  }

  findIndexItemInListRedis(item) {
    this.cacheManager;
  }
}
