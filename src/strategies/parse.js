
'use strict'

const Exports           = require( './exports' )
const { parseFunction } = require( '../helpers' )

exports = module.exports = Object.setPrototypeOf( {
    getDependencies( factory ) {
        return parseFunction( factory )
    }
}, Exports )
