
exports = module.exports = {
    CircularDependency: ( id ) => `circular dependency for module ${ id }, hope you know what you're doing`,
    Resolve: ( id ) => `couldn't resolve "${ id }"`
}