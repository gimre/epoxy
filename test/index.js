
const chai          = require( 'chai' )
const child_process = require( 'child_process' )
const path          = require( 'path' )
const sinon         = require( 'sinon' )
const sinonChai     = require( 'sinon-chai' )

const { expect } = chai

chai.use( sinonChai )

const {
    Container,
    Errors,
    Providers,
    Strategies,
    Types
} = require( '../lib' )

const {
    Symbols
} = require( 'lazyref' )

process.env.DEBUG = '='

const expectEqual = ( a, b ) =>
    expect( a == b || a[ Symbol.equals ]( b ) ).to.be.true

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
    it( 'throws for non-existent module', ( ) => {
        const { container } = this
        expect( container.create.bind( container, 'missing-module' ) )
        .to.throw( Errors.Resolve( 'missing-module' ) )
    } )

    it( 'resolve root module', ( ) => {
        const { container } = this
        expectEqual( container.create('S1-9o6v7Z' ), 'S1-9o6v7Z' )
    } )

    it( 'resolve nested module', ( ) => {
        const { container } = this
        expectEqual( container.create('ByI4opDQb/B1GHsTDXb' ), 'B1GHsTDXb' )
    } )

    it( 'resolve node module', ( ) => {
        const { container } = this
        container.provide( Providers.NodeModules )
        expectEqual( container.create( 'fs' ), require( 'fs' ) )
    } )

    it( 'create module with dependencies from same provider', ( ) => {
        const { container } = this
        expectEqual( container.create('ByI4opDQb/B1GHsTDXb' ), 'B1GHsTDXb' )
    } )

    it( 'create module with dependencies from multiple providers', ( ) => { } )
} )

suite( 'metadata extraction', ( ) => {
    it( 'extract from exports', ( ) => {
        const factory  = require( './fixtures/HJHF36DmW' )
        const metadata = this.container
            .getFactoryMetadata( factory, Strategies.Exports )

        expect( metadata )
        .to.be.deep.equal( {
            dependencies: [ 'ByI4opDQb/B1GHsTDXb', 'S1-9o6v7Z' ],
            type: Types.Factory
        } )
    } )

    it( 'extract with parse', ( ) => {
        const factory  = require( './fixtures/HJHF36DmW' )
        const metadata = this.container
            .getFactoryMetadata( factory, Strategies.Parse )

        expect( metadata )
        .to.be.deep.equal( {
            dependencies: [ 'ByI4opDQb/B1GHsTDXb', 'S1-9o6v7Z' ],
            type: Types.Factory
        } )
    } )

    it( 'extract with parse - non-string default value', ( ) => {
        const { container } = this
        expectEqual( container.create( 'BkequUumZ' ), 'S1Q17UO7b' )
    } )

    it( 'extract with parse - no default value', ( ) => {
        const { container } = this
        expectEqual( container.create( 'H1HFGPdXb' ), 'S1Q17UO7b' )
    } )
} )

suite( 'module types', ( ) => {
    it( Types.Constant, ( ) => {
        const { container } = this
        expectEqual( container.create( 'S1ZSxUOXW' ), 'S1ZSxUOXW' )
    } )

    it( Types.Constructor, ( ) => {
        const { container } = this
        expect( container.create( 'rJK3-IOXb' ).value )
        .to.be.equal( 'rJK3-IOXb' )
    } )

    it( Types.Factory, ( ) => {
        const { container } = this
        expectEqual( container.create( 'HykBXUumb' ), 'HykBXUumb' )
    } )

    it( Types.Singleton, ( ) => {
        const { container } = this
        expectEqual( container.create( 'S1Q17UO7b' ), 'S1Q17UO7b' )
    } )
} )

suite( 'modules with dependencies', ( ) => {
    it( 'resolve module with non-circular dependencies', ( ) => {
        const { container } = this
        expectEqual( container.create( 'HJHF36DmW' ), 'B1GHsTDXbS1-9o6v7Z' )
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

// describe( 'examples', ( ) => {
//     it( 'basic', ( ) => {
//         const { status, stderr } = child_process
//         .spawnSync( 'node', [ './examples/basic/index.js' ], {
//             shell: true
//         } )

//         if( stderr ) {
//             console.log( stderr.toString( ) )
//         }
//         expect( status ).to.be.equal( 0 )
//     } )
// } )
