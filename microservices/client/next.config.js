

module.exports = {
  exportPathMap: function () {
    return {
      '/dashboard': { page: '/dashboard' },
      '/login': { page: '/login' },
      '/signin': { page: '/signin' },
    }
  },
  publicRuntimeConfig: { // Will be available on both server and client
    api: process.env.NODE_ENV === 'prod' ? '178.62.121.203:8080' : 'localhost:8080'
  }
}