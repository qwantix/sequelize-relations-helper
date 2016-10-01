'use strict';

class AssociationHelperPlugin {
  constructor( db, opts ) {
    this._db = db;
    this._opts = opts || {};
    this._models = new Set();
  }

  register( Model ) {
    if( Model.options.relations ) {
      if( this._opts.debug ) {
        console.log(`[AssociationHelperPlugin] Register new model "${Model.name}"`);
      }
      this._models.add( Model );
    }
    this.setup();
  }
  
  setup( ) {
    if( !this._models.size ) {
      return; 
    }
    this._models.forEach( modelSrc  => {
      for( let def of modelSrc.options.relations ) {
        if( !this._db.isDefined( def.target ) 
          && typeof this._opts.onMissingModel === 'function' ) {
          this._opts.onMissingModel( def.target );
        }

        if( !def._complete && this._db.isDefined( def.target ) ) {
          const modelDst = this._db.model(def.target);
          const opts = def.options || def.opts || {};

          switch( def.type ) {
            case 'hasOne':
            case 'belongsTo':
            case 'hasMany':
            case 'belongsToMany':
              if( this._opts.debug ) {
                console.log(`[AssociationHelperPlugin] Set "${modelSrc.name}" ${def.type} "${modelDst.name}"` , def._complete, opts );
              }
              def._complete = true;
              modelSrc[def.type]( modelDst, Object.assign( {}, opts ) );
              break;
          }
        }
      }
    });
  }
}


module.exports = ( db, opts ) => {
  const plugin = new AssociationHelperPlugin( db, opts );
  db.hook('afterDefine', ( Model ) => {
    plugin.register( Model );
  });
};