
const Container = require( '../lib' )
const ioc = new Container

const first  = ioc.create( 'first' )

first.log( )