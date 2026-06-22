
gdjs.evtsExt__SpriteMultitouchJoystick__SpriteMultitouchJoystick = gdjs.evtsExt__SpriteMultitouchJoystick__SpriteMultitouchJoystick || {};

/**
 * Object generated from 
 */
gdjs.evtsExt__SpriteMultitouchJoystick__SpriteMultitouchJoystick.SpriteMultitouchJoystick = class SpriteMultitouchJoystick extends gdjs.CustomRuntimeObject2D {
  constructor(parentInstanceContainer, objectData, instanceData) {
    super(parentInstanceContainer, objectData, instanceData);
    this._parentInstanceContainer = parentInstanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._objectData = {};
    
    

    // It calls the onCreated super implementation at the end.
    this.onCreated();
  }

  // Hot-reload:
  updateFromObjectData(oldObjectData, newObjectData) {
    super.updateFromObjectData(oldObjectData, newObjectData);

    this.onHotReloading(this._parentInstanceContainer);
    return true;
  }

  // Properties:
  

  

  
}

// Methods:

gdjs.evtsExt__SpriteMultitouchJoystick__SpriteMultitouchJoystick.SpriteMultitouchJoystick.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerObject("SpriteMultitouchJoystick::SpriteMultitouchJoystick", gdjs.evtsExt__SpriteMultitouchJoystick__SpriteMultitouchJoystick.SpriteMultitouchJoystick);
