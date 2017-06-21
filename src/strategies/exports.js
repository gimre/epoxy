
const metadata = {
    dependencies: '@inject',
    type:         '@type'
}

exports = module.exports = {
    getMetadata( factory ) {
        return {
            dependencies: this.getDependencies( factory ),
            type:         this.getType( factory )
        }
    },

    getDependencies( factory ) {
        return factory[ metadata.dependencies ]
    },

    getType( factory ) {
        return factory[ metadata.type ]
    }
}