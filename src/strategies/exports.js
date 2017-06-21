
'use strict'

const Abstract = require( './abstract' )

const metadata = {
    dependencies: '@inject',
    type:         '@type'
}

exports = module.exports = Object.setPrototypeOf( {
    getDependencies( factory ) {
        return factory[ metadata.dependencies ]
    },

    getType( factory ) {
        return factory[ metadata.type ]
    }
}, Abstract )