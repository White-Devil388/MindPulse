// Ultra-lightweight in-memory cache with Time-To-Live (TTL)

class SimpleCache {
  constructor(defaultTTLSeconds = 300) {
    this.cache = new Map();
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttlSeconds) {
    const ttl = (ttlSeconds !== undefined ? ttlSeconds : this.defaultTTL / 1000) * 1000;
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const memoryCache = new SimpleCache(600); // 10 minutes default TTL

