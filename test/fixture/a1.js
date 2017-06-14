
exports = module.exports = ( a, one = '1' ) => a + one

exports[ '@inject' ] = [
    'a',
    '1'
]