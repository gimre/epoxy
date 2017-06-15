
'use strict'

const metadata = {
    dependencies: '@inject',
    type:         '@type'
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

        return this._dependencies = this.factory[ metadata.dependencies ] || [ ]
    }

    get type( ) {
        if( this._type ) {
            return this._type
        }

        return this._type = this.factory[ metadata.type ]
    }
}