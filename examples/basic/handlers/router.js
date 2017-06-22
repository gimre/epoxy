// ./handlers/router

exports = module.exports = (
    index    = 'handlers/index',
    notFound = 'handlers/404'
) => ( req, res ) => {
    switch( req.url ) {
        case '/':
        case '/index':
            return index( req, res )
        default:
            return notFound( req, res )
    }
}
