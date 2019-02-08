module.exports = {
  publicRuntimeConfig: {
    api: process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? 'https://remora.app:8080' : 'http://localhost:8080',
    apiPort: 8080
  }
}