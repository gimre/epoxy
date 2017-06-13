
exports = module.exports = ( a, b ) => {
    return a.value + b.value
}

exports[ '@inject' ] = [
    'depA',
    'depB'
]