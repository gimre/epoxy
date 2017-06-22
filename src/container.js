
'use strict'

const p  = require( 'path' )

const { LazyObject, Symbols } = require( 'lazyref' )

const Errors     = require( './errors' )
const Providers  = require( './providers' )
const Strategies = require( './strategies' )
const Types      = require( './types' )

const {
    getConstructor,
    getExternalCaller
} = require( './helpers' )

exports = module.exports = class Container {
    constructor( providers = [ Providers.CurrentDirectory ] ) {
        this.factoryCache  = new Map
        this.instanceCache = new Map
        this.providers     = [ ]

        this.provide( providers )

        if( process.env.DEBUG ) {
            const timed = require( './performance/timed' )
            this.create = timed( this.create )
        }
    }

    create( id ) {
        const { factoryCache, instanceCache } = this
        const dependencyTree = Array.from( this.getDependencyTree( id ) )

        for( const dep of dependencyTree.reverse( ) ) {
            const { factory, dependencies, type } = factoryCache.get( dep )
            const instances = dependencies.map( d => instanceCache.get( d ) )
            const instance  = instanceCache.get( dep )

            if( instance[ Symbols.constructor ] === LazyObject ) {
                const concrete = this.getInstance( instances, factory, type )
                instance[ Symbols.resolveAs ]( concrete )
            }
        }

        return instanceCache.get( id )
    }

    getDependencyTree( id ) {
        const { factoryCache, instanceCache } = this
        const dependencyTree = new Set( [ id ] )

        for( const dep of dependencyTree ) {
            if( ! factoryCache.has( dep ) ) {
                this.register( dep, this.resolve( dep ) )
            }

            const { dependencies, factory } = factoryCache.get( dep )
            if( this.isNodeModule( dep ) ) {
                instanceCache.set( dep, factory )
                continue
            }

            if( ! instanceCache.has( dep ) ) {
                const constructor = getConstructor( factory )
                instanceCache.set( dep, new LazyObject( constructor ) )
            }

            if( dependencies.length ) {
                const { size } = dependencyTree
                dependencies.forEach( d => dependencyTree.add( d ) )

                // no size change for the Set => we had a duplicate
                if( dependencyTree.size === size ) {
                    console.warn( Errors.CircularDependency( id ) )
                }
            }
        }

        return dependencyTree
    }

    getFactoryMetadata( factory, strategy = Strategies.Parse ) {
        if( typeof factory === 'function' ) {
            return strategy.getMetadata( factory )
        }
        return { dependencies: [ ], factory, type: Types.Constant }
    }

    getInstance( dependencies, factory, type ) {
        switch( type ) {
            case Types.Constant:
                return factory
            case Types.Constructor:
                return new factory( ... dependencies )
            case Types.Factory:
            case Types.Singleton:
            default:
                return factory( ... dependencies )
        }
    }

    isNodeModule( id ) {
        const { location } = this.factoryCache.get( id )
        return location === id
    }

    load( path ) {
        return require( path )
    }

    provide( providers ) {
        const calleeDir = p.dirname( getExternalCaller( __filename ) )
        this.providers = this.providers.concat(
            [ ]
            .concat( providers )
            .map( provider => {
                if( provider === Providers.NodeModules ) {
                    return provider
                }
                return p.join( calleeDir, provider )
            } )
        )

        return this
    }

    register( id, factory ) {
        let location
        if( typeof factory === 'string' ) {
            location = factory
            factory  = this.load( location )
        }

        const { dependencies, type = Types.Singleton } =
            this.getFactoryMetadata( factory )

        const entry = { dependencies, factory, location, type }
        this.factoryCache.set( id, entry )

        return entry
    }

    resolve( id ) {
        for( const provider of this.providers ) {
            const location = p.join( provider, id )
            try {
                require.resolve( location )
                return location
            } catch( ex ) {
                continue
            }
        }

        throw( new Error( Errors.Resolve( id ) ) )
    }
}
