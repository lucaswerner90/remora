module.exports = {
  exportPathMap: function () {
    return {
      '/dashboard': { page: '/dashboard' },
      '/signin': { page: '/signin' },
    }
  },
  publicRuntimeConfig: { // Will be available on both server and client
    backend: process.env.NODE_ENV === 'production' ? '/' : 'localhost:8080',
  }
}