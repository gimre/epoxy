
const chai      = require( 'chai' )
const path      = require( 'path' )
const sinon     = require( 'sinon' )
const sinonChai = require( 'sinon-chai' )

const { expect } = chai

chai.use( sinonChai )

const {
    Container,
    Errors,
    Providers,
    Strategies,
    Types 
} = require( '../lib' )

process.env.DEBUG = '='

const expectEqual = ( a, b ) =>
    expect( a == b || a.equals( b ) ).to.be.true

const suite = ( name, tests ) => {
    describe( name, ( ) => {
        beforeEach( ( ) => {
            this.container = new Container( [
                './fixtures'
            ] )
            
            sinon
            .stub( console, 'warn' )
            .callsFake( ( ) => { } )
        } )

        tests( )

        afterEach( ( ) => {
            this.container = null
            console.warn.restore( )
        } )
    } )
}

describe( 'container construction', ( ) => {
    it( 'no initial providers', ( ) => {
        new Container
    } )
    it( 'single initial provider', ( ) => {
        new Container( './fixture1' )
    } )
    it( 'multiple initial providers', ( ) => {
        new Container( [ './fixture1', './fixture2' ] )
    } )
} )

suite( 'module resolution', ( ) => {
    it( 'resolve root module', ( ) => {
        expectEqual(
            this.container.create('S1-9o6v7Z' ),
            'S1-9o6v7Z'
        )
    } )

    it( 'resolve nested module', ( ) => {
        expectEqual(
            this.container.create('ByI4opDQb/B1GHsTDXb' ),
            'B1GHsTDXb'
        )
    } )

    it( 'create module with dependencies from same provider', ( ) => {
        expectEqual(
            this.container.create('ByI4opDQb/B1GHsTDXb' ),
            'B1GHsTDXb'
        )
    } )

    it( 'create module with dependencies from multiple providers', ( ) => { } )
} )

suite( 'metadata extraction', ( ) => {
    it( 'extract from exports', ( ) => {
        const factory  = require( './fixtures/HJHF36DmW' )
        const metadata = this.container.getFactoryMetadata( factory,
            Strategies.ModuleMetadata
        )

        expect( metadata )
        .to.be.deep.equal( {
            dependencies: [ 'ByI4opDQb/B1GHsTDXb', 'S1-9o6v7Z' ],
            type: Types.Factory
        } )
    } )

    it( 'extract with parse', ( ) => {
        const factory  = require( './fixtures/HJHF36DmW' )
        const metadata = this.container.getFactoryMetadata( factory,
            Strategies.ModuleParse
        )

        expect( metadata )
        .to.be.deep.equal( {
            dependencies: [ 'ByI4opDQb/B1GHsTDXb', 'S1-9o6v7Z' ],
            type: Types.Factory
        } )
    } )
} )

suite( 'modules with dependencies', ( ) => {
    it( 'resolve module with non-circular dependencies', ( ) => {
        expectEqual(
            this.container.create( 'HJHF36DmW' ),
            'B1GHsTDXbS1-9o6v7Z'
        )
    } )

    it( 'detect circular depedencies', ( ) => {
        const a = this.container.create( 'rJoOgZO7b' )
        const b = this.container.create( 'rkMG-WOQW' )

        expect( console.warn )
        .to.have.been.calledWith( Errors.CircularDependency( 'rJoOgZO7b' ) )
    } )

    it( 'resolve module with circular dependencies', ( ) => {
        const a = this.container.create( 'B14TxkOX-' )
        const b = this.container.create( 'r18dbku7b' )

        expect( a.getValue( ) )
        .to.be.equal( 'B14TxkOX-r18dbku7b' )

        expect( b.getValue( ) )
        .to.be.equal( 'r18dbku7bB14TxkOX-' )
    } )
} )

suite( 'configure providers at runtime', ( ) => {
    it( 'add provider', ( ) => { } )
    it( 'remove provider', ( ) => { } )
} )
