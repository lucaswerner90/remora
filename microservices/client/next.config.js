module.exports = {
  exportPathMap: function () {
    return {
      '/dashboard': { page: '/dashboard' }
    }
  },
  publicRuntimeConfig: { // Will be available on both server and client
    backend: process.env.NODE_ENV === 'production' ? '178.62.121.203' : 'localhost:8080',
  }
}