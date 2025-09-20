// lib/kv.js
const store = new Map();

module.exports = {
  async get(key) {
    return store.get(key);
  },
  async set(key, value, options = {}) {
    store.set(key, value);
    if (options.ex) {
      setTimeout(() => store.delete(key), options.ex * 1000);
    }
    return 'OK';
  },
  async incr(key) {
    const current = parseInt(await this.get(key)) || 0;
    await this.set(key, current + 1);
    return current + 1;
  },
  async expire(key, seconds) {
    if (store.has(key)) {
      setTimeout(() => store.delete(key), seconds * 1000);
      return 1;
    }
    return 0;
  }
};