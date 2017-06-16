
const expect = require( 'chai' ).expect
const path   = require( 'path' )
const { Container, Providers } = require( '../lib' )

process.env.DEBUG = '='

const test = ( message, id ) => {
    it( message, ( ) => {
        const instance = this.container.create( id )
        expect( instance ).to.be.equal( path.basename( id ) )
    } )
}

describe( 'Container( )', ( ) => {
    it( 'should accept no parameters', ( ) => {
        new Container
    } )
    it( 'should accept an optional provider path', ( ) => {
        new Container( './fixture1' )
    } )
    it( 'should accept an optional list of provider paths', ( ) => {
        new Container( [ './fixture1', './fixture2' ] )
    } )
} )

describe( 'Container.create', ( ) => {
    beforeEach( ( ) => {
        this.container = new Container( [
            './fixture',
            './fixture/provider1',
            './fixture/provider2'
        ] )
    } )

    test( 'should create linear module', '_' )
    test( 'should create nested module', 'provider1/a' )
    test( 'should create module with dependencies from same provider', 'ab' )
    test( 'should create module with dependencies from multiple providers', 'a1' )

    afterEach( ( ) => {
        this.container = null
    } )
} )

describe( 'Container.providers', ( ) => {
    beforeEach( ( ) => {
        this.container = new Container( Providers.NodeModules )
    } )

    it( 'should create node module', ( ) => {
        expect( this.container.create( 'fs' ) ).to.be.equal( require( 'fs' ) )
    } )

    afterEach( ( ) => {
        this.container = null
    } )
} )

describe( 'Container.Strategies', ( ) => {
    beforeEach( ( ) => {
        this.container = new Container( [
            './fixture/strategies'
        ] )
    } )

    test( 'should create module with parse provider', 'ab' )

    afterEach( ( ) => {
        this.container = null
    } )
} )
