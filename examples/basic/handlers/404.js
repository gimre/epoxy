
exports = module.exports = ( ) => ( req, res ) => {
    res.statusCode = 404
    res.end( 'You can\'t do that' )
}