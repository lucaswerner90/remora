module.exports = {
  publicRuntimeConfig: {
    api: process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? 'remora.app:8080' : 'localhost:8080'
  }
}