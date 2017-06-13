
const Container = require( '../index' )
const ioc = new Container( './fixture' )

console.log( ioc.create( './app' ) )
