
const stack = require( 'callsite' )

exports = module.exports = {
    getExternalCaller( callee ) {
        const callsites = stack( ).slice( 1 )
        for( const callsite of callsites ) {
            const filename = callsite.getFileName( )
            if( filename !== callee ) {
                return filename
            }
        }
    },

    intersect( A, B ) {
        const S = new Set( B )
        return new Set( [ ... A ].filter( v => S.has( v ) ) )
    }
}