Sequelize relations/associations plugin Helper
========================

    /!\  This an ES6 package

Plugin makes your life easier with sequelize relations.

The biggest problem with Sequelize is that it's difficult to manage relationships in each model without encountering difficulty circular dependencies.
The only solution is to define after you set all the models and... it's not very legible.
This plugin will allow you therefore define relationships directly in the statement of each model

## Usage
```javascript


const sequelize = new Sequelize( credentials, options );

// Use plugin
require('sequelize-relations-helper')( sequelize );

// OK, now, you instead of declare relations with commons methods MyModel.belongsTo or MyModel.hasOne, use property "relations"


sequelize.define('MyModel', {
    /// HERE cols defs
}, {
    relations: [
        { type: 'belongsTo', target: 'MyFooModel' },
        { type: 'belongsToMany', target: 'MyBarModel', options: { through: 'MyModel_Has_MyBarModel' } },
    ]
});
// And more models, relation are now resolved on the fly without errors !

```


## Plugin options

When you use plugin, you can set options like
```javascript
require('sequelize-relations-helper')( sequelize, { /* plugin options */ } );
```


### debug
Boolean, enable debugging trace

### onMissingModel
Function, called when models are not found

You're two approch to use model in your app :

 1 - You load all models on application startup, and so, this option is useless

 2 - You choose to lazy load your models and this option is for you!

```javascript
require('sequelize-relations-helper')( sequelize, { 
    onMissingModel( modelName ) {
        require('./path/to/my/models/' + modelName );
    }
} );
```
