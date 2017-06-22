# epoxy

![build status](https://img.shields.io/travis/gimre/epoxy/master.svg?style=flat-square)
![test coverage](https://img.shields.io/codecov/c/github/gimre/epoxy/master.svg?style=flat-square)

Epoxy is a lightweight (~200 sloc) IoC container for NodeJS. Notable features:
  * automatic dependency injection ( in multiple flavours )
  * multiple injection patterns - ```factory, constructor, singleton, constant```
  * circular depedency detection and resolution, if possible

## Installation
```npm install epoxy-di```

## Table of Contents
---
  * [ Basic Usage ]( #basic-usage )
  * [ API ]( #api )
    * [ Container ]( #container )
        * [ constructor( [ providers ] ) ]( #constructor-providers-providerscurrentdirectory )
        * [ create( id ) ]( #containercreate-id )
        * [ provide( path ) ]( #containerprovide-path )
        * [ register( id, factory ) ]( #containerregister-id-factory )
    * [ Providers ]( #providers )
    * [ Strategies ]( #strategies )
    * [ Types ]( #types )

## Basic Usage
```javascript
// ./index.js

const { Container, Providers } = require( 'epoxy-di' )

const ioc = new Container( [
    Providers.CurrentDirectory,
    Providers.NodeModules
] )

ioc.create( 'app' )
```

```javascript
// ./app.js

exports = module.exports = (
    http,
    router = 'handlers/router'
) => {
    return http.createServer( router )
}
```

```javascript
// ./handlers/router

exports = module.exports = (
    index    = 'handlers/index',
    notFound = 'handlers/404'
) => ( req, res ) => {
    switch( req.url ) {
        case '/':
        case '/index':
            return index( req, res )
        default:
            return notFound( req, res )
    }
}
```

## API
### **Container**
### **constructor( [ providers = [ Providers.CurrentDirectory ]( #providers ) ] )**
The ```Container``` constructor accepts a list of providers. If none are provided, it will default to the current directory provider.

### **Container.create( id )**
Creates the module with the given id. Resolves dependencies automatically and caches factories and instances along the way.

### **Container.provide( path )**
Adds [ providers ]( #providers ) after container creation.

### **Container.register( id, factory )**
Registers a factory for the provided id with the container. Useful for mocking out modules or providing overrides

### **Providers**
Providers are sources ( paths at the moment ) where to look for dependencies when resolving modules. Providers are relative to the file where [ create ]( #containercreate-id ) is called.

There are two predefined providers shipped with **epoxy**:

```CurrentDirectory``` - provides modules in the current directory ( default )

```NodeModules``` - provides node modules

### **Strategies**
There are multiple strategies provided for dependency discovery and type definition for a module:

#### Exports
```javascript
exports = module.exports = ( http, handler, port ) => {
    return class {
        constructor( ) {
            this.server = http.createServer( a )
        }
    }
}

exports[ '@type' ]   = 'constructor'
exports[ '@inject' ] = [
    'http',
    'middleware/handler',
    'config/port'
]
```

#### Parse (default)
```javascript
exports = module.exports = (
    http,
    handler = 'middleware/handler',
    port    = 'config/port'
) => {
    return class {
        constructor( ) {
            this.server = http.createServer( a )
        }
    }
}

exports[ '@type' ]   = 'constructor'
```

### Types
Multiple injection types are supported:

```Constant``` - module injected as-is, and cached

```Constructor``` - module treated as a constructible, injected with ```new```

```Factory``` - module treated as a factory; injection is done by calling the factory each time with a fresh instance

```Singleton``` - same as ```Factory```, but the first resulting instance is cached and injected for all subsequent times