
exports = module.exports = ( c ) => ( {
    value: 2 * c.value
} )

exports[ '@inject' ] = [
    'depC'
]