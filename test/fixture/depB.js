
exports = module.exports = ( c ) => ( {
    value: 3 - c.value
} )

exports[ '@inject' ] = [
    'depC'
]