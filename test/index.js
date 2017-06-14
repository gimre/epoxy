
const should = require( 'chai' ).expect( )
const Container = require( '../index' )

process.env.DEBUG = '='

describe( 'Container constructor', ( ) => {
    it( 'should accept no parameters', ( ) => {
        new Container
    } )
    it( 'should accept an optional provider path', ( ) => {
        new Container( './fixture' )
    } )
    it( 'should accept an optional list of provider paths', ( ) => {
        new Container( [ './fixture', './fixture2' ] )
    } )
} )

// describe( 'Container operation', ( ) => {
//     beforeEach( ( ) => {
//         this.container = new Container( './fixture' )
//     } )

//     it( 'should resolve module with no dependencies', ( ) => {
//         this.container.create( 'moduleWithNoDependencies' )
//     } )

//     afterEach( ( ) => {
//         this.container = null
//     } )
// } )
