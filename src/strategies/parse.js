
'use strict'

const Exports = require( './exports' )

const parse = ( fn ) => {
    const [ match, dependencyString ] = fn
        .toString( )
        .match( /(?:function|)\s*\(([^\)]*)\)/ ) || [ ]

    if( ! match ) {
        return [ ]
    }

    return dependencyString
    .split( ',' )
    .map( d => d.trim( ) )
    .filter( Boolean )
    .map( d => {
        const [ match, dependency ] = d
        .match( /=\s*["'`]([^"'`]+)["'`]/ ) || [ ]

        if( match ) {
            return dependency
        }
        return d
    } )
}

exports = module.exports = {
    getMetadata( factory ) {
        return {
            dependencies: this.getDependencies( factory ),
            type:         this.getType( factory )
        }
    },

    getDependencies( factory ) {
        return parse( factory )
    },

    getType( factory ) {
        return Exports.getType( factory )
    }
}
