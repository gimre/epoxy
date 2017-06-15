
'use strict'

const fs = require( 'fs' )
const p  = require( 'path' )

const { getExternalCaller } = require( './helpers' )
const { ModuleParse }       = require( './strategies' )

exports = module.exports = class Container {

    constructor( providers = [ './' ] ) {
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

        let factory = factoryCache.get( id )
        if( factory == null ) {
            factory = this.load( this.resolve( id ) )
            factoryCache.set( id, factory )
        }

        let instance = instanceCache.get( id )
        if( instance != null ) {
            return instance
        }
        
        const info = new this.strategy( factory )
        let dependencies = [ ]

        instance = this.getInstance( info, dependencies )
        if( this.isSingleton( info ) ) {
            instanceCache.set( id, instance )
        }
        
        dependencies.push( ... info.dependencies
            .map( id => this.create( id ) ) )

        return instance
    }

    getInstance( info, dependencies ) {
        const {
            factory,
            type
        } = info

        const instance = new Proxy( { }, {
            get: function( target, property ) {
                if( target.__instance == null ) {
                    let instance = null
                    switch( type ) {
                        case 'constructor':
                            instance = new factory( ... dependencies )
                            break
                        case 'factory':
                        case 'singleton':
                        default:
                            instance = factory( ... dependencies )
                            break
                    }

                    Object.defineProperty( target, '__instance', {
                        configurable: false,
                        enumerable: false,
                        value: instance,
                        writable: false
                    } )
                }

                const value = target.__instance[ property ]
                if( typeof value === 'function' ) {
                    return value.bind( target.__instance )
                }
                return value
            }
        } )

        return instance
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