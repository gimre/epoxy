
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
            .match( /^(?:async|function\s*\*?|async\s+function|)\s*\(([^\)]*)\)/ ) || [ ]

        if( ! match ) {
            return [ ]
        }

        return dependencyString
        .split( ',' )
        .map( d => d.trim( ) )
        .filter( Boolean )
        .map( d => {
            // this will not match complex default parameter values such as:
            // * a = [ 1, 2, 3 ]
            // * a = ( b = 2 ) => { }
            // possible solution - esprima
            const [ isVariableName, variableName ] = d.
            match( /^([a-zA-Z_$][0-9a-zA-Z_$]+)$/ ) || [ ]

            if( isVariableName ) {
                return variableName
            }

            const [ isDefaultValue, defaultValue ] = d
            .match( /=\s*["'`]([^"'`]+)["'`]/ ) || [ ]

            if( isDefaultValue ) {
                return defaultValue
            }

            return d
            .split( '=' )
            .shift( )
            .trim( )
        } )
    }
}