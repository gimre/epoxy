
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
    parseFunction( fn ) {
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
}