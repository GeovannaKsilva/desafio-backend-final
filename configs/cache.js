const NodeCache = require('node-cache');


const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 30,
  checkperiod: 35,
  useClones: false
});

// Logs de eventos do cache
cache.on('set', (key, value) => {
  console.log(`📝 Cache SET: ${key}`);
});

cache.on('get', (key, value) => {
  console.log(`📖 Cache GET: ${key}`);
});

cache.on('del', (key) => {
  console.log(`🗑️ Cache DELETE: ${key}`);
});

cache.on('expired', (key, value) => {
  console.log(`⏰ Cache EXPIRED: ${key}`);
});


const cacheUtils = {
  // Obter dados do cache
  get: (key) => {
    const value = cache.get(key);
    if (value !== undefined) {
      console.log(`✅ Cache HIT: ${key}`);
      return value;
    }
    console.log(`❌ Cache MISS: ${key}`);
    return null;
  },

  // Armazenar dados no cache
  set: (key, value, ttl = null) => {
    const success = cache.set(key, value, ttl);
    if (success) {
      console.log(`💾 Cache armazenado: ${key}`);
    }
    return success;
  },

  // Remover dados do cache
  del: (key) => {
    const success = cache.del(key);
    if (success) {
      console.log(`🗑️ Cache removido: ${key}`);
    }
    return success;
  },

  // Limpar todo o cache
  flush: () => {
    cache.flushAll();
    console.log('🧹 Cache completamente limpo');
  },

  // Obter estatísticas do cache
  getStats: () => {
    return cache.getStats();
  },

  // Invalidar cache de clientes
  invalidateClientsCache: () => {
    const keys = cache.keys();
    const clientKeys = keys.filter(key => key.startsWith('clientes_'));
    
    clientKeys.forEach(key => {
      cache.del(key);
    });
    
    
    cache.del('clientes_all');
    
    console.log(`🔄 Cache de clientes invalidado: ${clientKeys.length} chaves removidas`);
  }
};

module.exports = {
  cache,
  cacheUtils
};