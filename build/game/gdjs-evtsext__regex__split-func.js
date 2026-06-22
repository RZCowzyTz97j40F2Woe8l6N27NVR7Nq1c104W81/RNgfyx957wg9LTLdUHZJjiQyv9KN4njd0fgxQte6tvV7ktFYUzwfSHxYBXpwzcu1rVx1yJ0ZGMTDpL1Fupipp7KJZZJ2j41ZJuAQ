
if (typeof gdjs.evtsExt__RegEx__Split !== "undefined") {
  gdjs.evtsExt__RegEx__Split.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__RegEx__Split = {};
gdjs.evtsExt__RegEx__Split.idToCallbackMap = new Map();


gdjs.evtsExt__RegEx__Split.userFunc0x82ab80 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
const re = new RegExp(eventsFunctionContext.getArgument("pattern"), eventsFunctionContext.getArgument("flags"));
/** @type {string} */
const str = eventsFunctionContext.getArgument("string");
const variable = runtimeScene.getVariables().get(eventsFunctionContext.getArgument("variable"));

variable.fromJSObject(str.split(re));

};
gdjs.evtsExt__RegEx__Split.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__RegEx__Split.userFunc0x82ab80(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__RegEx__Split.func = function(runtimeScene, pattern, flags, string, variable, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("RegEx"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("RegEx"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "pattern") return pattern;
if (argName === "flags") return flags;
if (argName === "string") return string;
if (argName === "variable") return variable;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__RegEx__Split.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__RegEx__Split.registeredGdjsCallbacks = [];