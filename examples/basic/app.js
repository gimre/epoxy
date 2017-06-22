// ./app.js

exports = module.exports = (
    http,
    router = 'handlers/router'
) => {
    return http.createServer( router )
}