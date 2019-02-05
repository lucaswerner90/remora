module.exports = {
  publicRuntimeConfig: {
    api: process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? '178.62.121.203:8080' : 'localhost:8080'
  }
}