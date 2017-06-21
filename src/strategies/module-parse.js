
'use strict'

const ModuleMetadata = require( './module-metadata' )
const Types = require( '../types' )

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
        this.factory       = factory
        this._dependencies = null
        this._type         = null

        if( ! ( typeof factory === 'function' ) ) {
            this._type = Types.Constant
        }
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

        return this._type = ( new ModuleMetadata( this.factory ) ).type
    }
}
