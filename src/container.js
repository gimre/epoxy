
'use strict'

const p  = require( 'path' )

const { getExternalCaller } = require( './helpers' )
const { ModuleParse }       = require( './strategies' )
const { Providers }         = require( './providers' )

class Container {

    constructor( providers = [ Providers.CurrentDirectory ] ) {
        this.factoryCache  = new Map
        this.instanceCache = new Map
        this.providers     = [ ]
        this.strategy      = ModuleParse

        this.provide( providers )

        if( process.env.DEBUG ) {
            const timed = require( './performance/timed' )
            this.create = timed( this.create )
        }
    }

    create( id ) {
        const {
            factoryCache,
            instanceCache
        } = this

        if( ! factoryCache.has( id ) ) {
            factoryCache.set( id, this.load( this.resolve( id ) ) )
        }

        const factory = factoryCache.get( id )
        const info = new this.strategy( factory )
        const dependencies = info.dependencies
            .map( id => this.create( id ) )

        if( ! this.isSingleton( info ) ) {
            return this.getInstance( info, dependencies )
        }
        
        if( ! instanceCache.has( id ) ) {
            instanceCache.set( id, this.getInstance( info, dependencies ) )
        }

        return instanceCache.get( id )
    }

    getInstance( info, dependencies ) {
        const {
            factory,
            type
        } = info

        switch( type ) {
            case 'constructor':
                return new factory( ... dependencies )
            case 'instance':
                return factory
            case 'factory':
            case 'singleton':
            default:
                return factory( ... dependencies )
        }
    }

    isSingleton( factory ) {
        const { '@type': type } = factory
        return ( type === 'singleton' || type === undefined )
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
        this.factoryCache[ id ] = factory
        return this
    }

    resolve( id ) {
        const { providers } = this

        for( const provider of providers ) {
            const location = p.join( provider, id )
            try {
                require.resolve( location )
                return location
            } catch( ex ) {
                continue
            }
        }

        throw( new Error( `couldn't resolve "${ id }"` ) )
    }

}

exports = module.exports = {
    Container,
    Providers
}