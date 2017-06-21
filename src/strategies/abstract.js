
'use strict'

const mustImplement = ( ) => { throw Error( 'method is abstract' ) }

exports = module.exports = {
    getMetadata( factory ) {
        return {
            dependencies: this.getDependencies( factory ),
            type:         this.getType( factory )
        }
    },

    getDependencies: mustImplement,
    getType:         mustImplement
}