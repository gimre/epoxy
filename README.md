# epoxy

![build status](https://img.shields.io/travis/gimre/epoxy/master.svg?style=flat-square)
![test coverage](https://img.shields.io/codecov/c/github/gimre/epoxy/master.svg?style=flat-square)

Epoxy is a lightweight (195 sloc) IoC container for NodeJS. Notable features:
  * automatic dependency injection ( in multiple flavours )
  * multiple injection patterns - ```factory, constructor, singleton, constant```
  * circular depedency detection and resolution, if possible

## Installation
```npm install epoxy-di```

## API
### Table of Contents
---
  * [ Container ]( #container )
      * [ constructor( [ providers ] ) ]( #constructor-providers-providerscurrentdirectory )
      * [ create( id ) ]( #containercreate-id )
      * [ register( id, factory ) ]( #containerregister-id-factory )
  * [ Providers ]( #providers )
  * [ Strategies ]( #strategies )

### **Container**
### **constructor( [ providers = [ Providers.CurrentDirectory ]( #providers ) ] )**
### **Container.create( id )**
### **Container.register( id, factory )**
### **Providers**
### **Strategies**
