
'use strict'

const fs = require( 'fs' )
const p  = require( 'path' )

const { getExternalCaller } = require( './helpers' )

exports = module.exports = class Container {

    constructor( providers = [ './' ] ) {
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
        // const log = debug( `epoxy:${ id }` )
        const {
            factoryCache,
            instanceCache
        } = this

        if( ! factoryCache.has( id ) ) {
            // log( `factory cache miss for ${ id }` )
            factoryCache.set( id, this.load( this.resolve( id ) ) )
        }

        const factory = factoryCache.get( id )
        const dependencies = this.getDependencies( factory )
            .map( id => this.create( id ) )

        if( ! this.isSingleton( factory ) ) {
            return this.getInstance( factory, dependencies )
        }
        
        if( ! instanceCache.has( id ) ) {
            // log( `instance cache miss for ${ id }` )
            instanceCache.set( id, this.getInstance( factory, dependencies ) )
        }

        return instanceCache.get( id )
    }

    getDependencies( factory ) {
        return factory[ '@inject' ] || [ ]
    }

    getInstance( factory, dependencies ) {
        switch( factory[ '@type' ] ) {
            case 'constructor':
                return new factory( ... dependencies )
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
            .map( provider => p.join( calleeDir, provider ) )
        )

        return this
    }

    register( id, factory ) {
        this.cache[ id ] = factory
        return this
    }

    resolve( id ) {
        const { providers } = this

        for( const provider of providers ) {
            const location = p.join( provider, id )
            if( fs.existsSync( `${ location }.js` ) ) {
                return location
            }
        }

        throw( new Error( `couldn't resolve "${ id }"` ) )
    }

}