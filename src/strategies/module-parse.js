
'use strict'

const ModuleMetadata = require( './module-metadata' )

const metadata = {
    dependencies: '@inject',
    type:         '@type'
}

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

exports = module.exports = class {
    constructor( factory ) {
        if( ! ( typeof factory === 'function' ) ) {
            throw( 'factory must be a function' )
        }

        this.factory = factory
        
        this._dependencies = null
        this._type         = null
    }

    get dependencies( ) {
        if( this._dependencies ) {
            return this._dependencies
        }

        return this._dependencies = parse( this.factory )
    }

    get type( ) {
        if( this._type ) {
            return this._type
        }

        return this._type = this.factory[ metadata.type ]
    }
}
