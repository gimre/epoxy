
'use strict'

const debug = require( 'debug' )( 'epoxy' )

exports = module.exports = ( fn ) => function( ... args ) {
    const start     = process.hrtime( )
    const result    = fn.apply( this, arguments )
    const [ s, ns ] = process.hrtime( start )
    const time      = ( s * 1e3 + ns / 10e6 ).toFixed( 2 )

    debug( `${ this.constructor.name }.${ fn.name }( ${ args  } ) took ${ time } ms` )

    return result
}
