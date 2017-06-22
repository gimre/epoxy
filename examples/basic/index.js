// ./index.js

const { Container, Providers } = require( '../../lib' )

const ioc = new Container( [
    Providers.CurrentDirectory,
    Providers.NodeModules
] )

const app = ioc.create( 'app' )
// app.listen( 1337 )
