module.exports = {
  exportPathMap: function () {
    return {
      '/dashboard': { page: '/dashboard' },
      '/login': { page: '/login' },
      '/signin': { page: '/signin' },
    }
  },
  publicRuntimeConfig: { // Will be available on both server and client
    api: '178.62.121.203:8080'
  }
}