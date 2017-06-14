
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
    }
}