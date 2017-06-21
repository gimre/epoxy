
'use strict'

const Types = require( '../types' )

const metadata = {
    dependencies: '@inject',
    type:         '@type'
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

        return this._dependencies = this.factory[ metadata.dependencies ] || [ ]
    }

    get type( ) {
        if( this._type ) {
            return this._type
        }

        return this._type = this.factory[ metadata.type ] || Types.Singleton
    }
}
