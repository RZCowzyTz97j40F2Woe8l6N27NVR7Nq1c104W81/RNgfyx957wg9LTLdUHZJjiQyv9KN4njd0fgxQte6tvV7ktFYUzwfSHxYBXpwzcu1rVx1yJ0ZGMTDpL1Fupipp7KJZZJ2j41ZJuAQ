gdjs.demonlistCode = {};
gdjs.demonlistCode.localVariables = [];
gdjs.demonlistCode.idToCallbackMap = new Map();
gdjs.demonlistCode.GDnerdviewObjects1= [];
gdjs.demonlistCode.GDnerdviewObjects2= [];
gdjs.demonlistCode.GDmlsBgBorderObjects1= [];
gdjs.demonlistCode.GDmlsBgBorderObjects2= [];
gdjs.demonlistCode.GDtransitionObjects1= [];
gdjs.demonlistCode.GDtransitionObjects2= [];
gdjs.demonlistCode.GDbackbuttonObjects1= [];
gdjs.demonlistCode.GDbackbuttonObjects2= [];
gdjs.demonlistCode.GDNewTextInputObjects1= [];
gdjs.demonlistCode.GDNewTextInputObjects2= [];
gdjs.demonlistCode.GDplaybuttonObjects1= [];
gdjs.demonlistCode.GDplaybuttonObjects2= [];
gdjs.demonlistCode.GDtitlesObjects1= [];
gdjs.demonlistCode.GDtitlesObjects2= [];
gdjs.demonlistCode.GDmappackbgObjects1= [];
gdjs.demonlistCode.GDmappackbgObjects2= [];
gdjs.demonlistCode.GDmapPackDifficultyObjects1= [];
gdjs.demonlistCode.GDmapPackDifficultyObjects2= [];
gdjs.demonlistCode.GDtitleObjects1= [];
gdjs.demonlistCode.GDtitleObjects2= [];
gdjs.demonlistCode.GDmaplevelObjects1= [];
gdjs.demonlistCode.GDmaplevelObjects2= [];
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects1= [];
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects2= [];
gdjs.demonlistCode.GDrefreshObjects1= [];
gdjs.demonlistCode.GDrefreshObjects2= [];
gdjs.demonlistCode.GDplacementObjects1= [];
gdjs.demonlistCode.GDplacementObjects2= [];
gdjs.demonlistCode.GDoverlvlsObjects1= [];
gdjs.demonlistCode.GDoverlvlsObjects2= [];
gdjs.demonlistCode.GDunderlvlsObjects1= [];
gdjs.demonlistCode.GDunderlvlsObjects2= [];
gdjs.demonlistCode.GDbgObjects1= [];
gdjs.demonlistCode.GDbgObjects2= [];
gdjs.demonlistCode.GDchristmasLightObjects1= [];
gdjs.demonlistCode.GDchristmasLightObjects2= [];


gdjs.demonlistCode.userFunc0x1246be8 = function GDJSInlineCode(runtimeScene) {
"use strict";
/*//////////////////////////////////////////////////////////////////////*/
// demonlist tab (recovered from code10.js). the recovered scene had no
// events; this fetches the live "demonlist" Firestore collection (project
// tgd-reborn) over REST, sorts by pos asc, and builds a scrollable list of
// rows on the "mappack" layer matching the original layout:
//   maplevel row bg @ (92, 52+44i)
//   placement rank "N." @ (62, +16)
//   title name @ (126, +10)
//   title "by author" @ (126, +21), tinted 60;104;255
//   mapPackLevelDifficulty icon @ (X centred on maplevel.X+20, +1)
//   playbutton @ (308, +8)
// title logo = titles TiledSprite YOffset 118, 111x20. play sets the global
// "level" json + "lvlFrom" and opens "level"; back -> portal; refresh.
/*//////////////////////////////////////////////////////////////////////*/

const scene = runtimeScene;
const G = scene.getGame().getVariables();
const P = (window.__demonlist = window.__demonlist || {});

const KEY = "AIzaSyDW-WtdoFxgkx6IC9z6ZqKIo-9yTZ5ILWE";
const URL = "https://firestore.googleapis.com/v1/projects/tgd-reborn/databases/(default)/documents:runQuery?key=" + KEY;

// difficulty name (lowercased, spaces stripped) -> [xoff, yoff, w, h]
const DIFF = {
  unrated: [0, 48, 16, 16], auto: [0, 0, 16, 16], easy: [16, 0, 16, 16],
  normal: [32, 0, 16, 16], medium: [48, 0, 16, 16], hard: [64, 0, 16, 16],
  harder: [80, 0, 16, 16], veryhard: [96, 0, 16, 16], tough: [112, 0, 16, 16],
  insane: [128, 0, 16, 16], extreme: [144, 0, 16, 16], easydemon: [0, 16, 16, 16],
  mediumdemon: [16, 16, 16, 16], harddemon: [32, 16, 16, 16],
  insanedemon: [48, 16, 18, 16], extremedemon: [66, 16, 18, 16]
};

const create = n => {try {return scene.createObject(n)} catch (e) {return null}};
const first = n => {const l = scene.getObjects(n); return l && l.length ? l[0] : null};
const released = gdjs.evtTools.input.isMouseButtonReleased(scene, "Left");
const settext = (o, t) => {try {o.getBehavior("Text").setText(t)} catch (e) {try {o.setText(t)} catch (e2) {}}};
const tint = (o, c) => {try {o.setTint(c)} catch (e) {}};
const zord = (o, z) => {try {o.setZOrder(z)} catch (e) {}};
const hov = o => {
  if (!o || o.isHidden()) return false;
  const ly = o.getLayer();
  const mx = gdjs.evtTools.input.getCursorX(scene, ly, 0);
  const my = gdjs.evtTools.input.getCursorY(scene, ly, 0);
  return mx >= o.getAABBLeft() && mx <= o.getAABBRight() && my >= o.getAABBTop() && my <= o.getAABBBottom();
};
const fmtName = s => (("" + s).length > 21 ? ("" + s).substring(0, 18) + "..." : "" + s);

function fetchList() {
  P.docs = null;
  P.error = "";
  try {
    fetch(URL, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({structuredQuery: {from: [{collectionId: "demonlist"}], limit: 300}})}).then(r => r.json()).then(j => {
      const g = (f, k) => {
        const c = f[k];
        if (!c) return "";
        if (c.stringValue != null) return c.stringValue;
        if (c.integerValue != null) return c.integerValue;
        if (c.doubleValue != null) return "" + c.doubleValue;
        return "";
      };
      const docs = (Array.isArray(j) ? j : []).filter(x => x.document).map(x => x.document).map(d => {
        const f = d.fields || {};
        return {name: g(f, "name"), author: g(f, "author"), diff: g(f, "diff"),
          pos: parseFloat(g(f, "pos") || "0"), lvl: g(f, "lvl")};
      });
      docs.sort((a, b) => a.pos - b.pos);
      P.docs = docs;
    }).catch(e => {P.docs = []; P.error = "offline"});
  } catch (e) {P.docs = []; P.error = "offline"}
}

/*//////////////////////////////////////////////////////////////////////*/

if (P.owner !== scene) {
  P.owner = scene;
  P.rows = [];
  P.built = false;
  P.scroll = 120;
  P.pending = null;
  fetchList();
  // title logo: point the titles TiledSprite at the demonlist strip
  try {
    const tt = first("titles");
    if (tt) {
      tt.setXOffset(0); tt.setYOffset(118);
      tt.getBehavior("Resizable").setWidth(111);
      tt.getBehavior("Resizable").setHeight(20);
      tt.setX(216 - 111 / 2);
    }
  } catch (e) {}
  // transition wipe in
  try {const tr = first("transition"); if (tr) tr.getBehavior("FlashTransitionPainter").PaintEffect("0;0;0", 0.2, "Circular", "Backward", 0, null)} catch (e) {}
}

// status line: only while loading / on error (cleared once the rows exist),
// kept horizontally centred
const nv = first("nerdview");
if (nv) {
  const msg = P.docs == null ? "Loading demon list..." : (P.error ? "Could not reach the server" : "");
  settext(nv, msg);
  if (msg) {try {nv.setX(216 - nv.getWidth() / 2)} catch (e) {}}
}

// title logo rock back and forth (matches the portal/other menus)
P.tphase = (P.tphase || 0) + gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(scene) * 60;
try {
  const tt = first("titles");
  if (tt) {tt.setAngle(Math.cos(gdjs.toRad(P.tphase)) * 3); tt.setX(216 - tt.getWidth() / 2)}
} catch (e) {}

/*//////////////////////////////////////////////////////////////////////*/
// build rows once the data arrives
/*//////////////////////////////////////////////////////////////////////*/

if (P.docs && !P.built) {
  P.built = true;
  for (let i = 0; i < P.docs.length; i++) {
    const d = P.docs[i];
    const y = 52 + 44 * i;
    const rank = i + 1;
    const row = {lvl: d.lvl, objs: []};

    const ml = create("maplevel");
    if (ml) {
      try {ml.setLayer("mappack")} catch (e) {}
      try {ml.setPosition(92, y)} catch (e) {}
      zord(ml, 2);
      row.bg = ml; row.objs.push(ml);
    }
    const bx = ml ? ml.getX() : 92;
    const base = ml ? ml.getY() : y;
    const rowH = ml ? ml.getHeight() : 40;

    const place = create("placement");
    if (place) {try {place.setLayer("mappack")} catch (e) {} try {place.setPosition(62, base + 16)} catch (e) {} zord(place, 4); settext(place, (rank < 10 ? " " : "") + rank + "."); row.objs.push(place)}

    const tName = create("title");
    if (tName) {try {tName.setLayer("mappack")} catch (e) {} try {tName.setPosition(126, base + 10)} catch (e) {} zord(tName, 4); settext(tName, fmtName(d.name)); row.objs.push(tName)}

    const tAuth = create("title");
    if (tAuth) {
      try {tAuth.setLayer("mappack")} catch (e) {}
      try {tAuth.setPosition(126, base + 21)} catch (e) {}
      zord(tAuth, 4);
      // the author line uses the outline-less garden font, tinted muted blue
      try {tAuth.setBitmapFontAndTextureAtlasResourceName("fonts\\garden.fnt", "fonts\\garden.png")} catch (e) {}
      settext(tAuth, "by " + d.author);
      tint(tAuth, "60;104;255");
      row.objs.push(tAuth);
    }

    const icon = create("mapPackLevelDifficulty");
    if (icon) {
      try {icon.setLayer("mappack")} catch (e) {}
      zord(icon, 3);
      const dd = DIFF[("" + d.diff).toLowerCase().replace(/ /g, "")] || DIFF.unrated;
      try {icon.setXOffset(dd[0]); icon.setYOffset(dd[1])} catch (e) {}
      try {icon.getBehavior("Resizable").setWidth(dd[2]); icon.getBehavior("Resizable").setHeight(dd[3])} catch (e) {}
      try {icon.setPosition((bx + 20) - icon.getWidth() / 2, base + rowH / 2 - icon.getHeight() / 2)} catch (e) {}
      row.objs.push(icon);
    }

    const play = create("playbutton");
    if (play) {try {play.setLayer("mappack")} catch (e) {} try {play.setPosition(308, base + 8)} catch (e) {} zord(play, 4); row.play = play; row.objs.push(play)}

    P.rows.push(row);
  }
}

/*//////////////////////////////////////////////////////////////////////*/
// scroll the mappack-layer camera
/*//////////////////////////////////////////////////////////////////////*/

const dt = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(scene);
if (gdjs.evtTools.input.isScrollingDown && gdjs.evtTools.input.isScrollingDown(scene)) P.scroll += 44;
if (gdjs.evtTools.input.isScrollingUp && gdjs.evtTools.input.isScrollingUp(scene)) P.scroll -= 44;
if (gdjs.evtTools.input.isKeyPressed(scene, "Down")) P.scroll += 360 * dt;
if (gdjs.evtTools.input.isKeyPressed(scene, "Up")) P.scroll -= 360 * dt;
const count = P.docs ? P.docs.length : 0;
P.scroll = Math.min(Math.max(P.scroll, 120), Math.max(120, 44 * count - 56));
try {gdjs.evtTools.camera.setCameraY(scene, P.scroll, "mappack", 0)} catch (e) {}

/*//////////////////////////////////////////////////////////////////////*/
// pending scene change (after the transition paint)
/*//////////////////////////////////////////////////////////////////////*/

if (P.pending && performance.now() >= P.pending.at) {
  const tgt = P.pending.scene;
  P.pending = null;
  gdjs.evtTools.runtimeScene.replaceScene(scene, tgt, true);
}

function paintGo(target) {
  try {const tr = first("transition"); if (tr) tr.getBehavior("FlashTransitionPainter").PaintEffect("0;0;0", 0.2, "Circular", "Forward", 0, null)} catch (e) {}
  P.pending = {at: performance.now() + 200, scene: target};
}

/*//////////////////////////////////////////////////////////////////////*/
// input: play a row, back, refresh
/*//////////////////////////////////////////////////////////////////////*/

if (!P.pending && released) {
  const back = first("backbutton");
  const refresh = first("refresh");
  if (back && hov(back)) {
    paintGo("portal");
  } else if (refresh && hov(refresh)) {
    for (const r of P.rows) for (const o of r.objs) {try {o.deleteFromScene(scene)} catch (e) {}}
    P.rows = []; P.built = false; P.scroll = 120;
    fetchList();
  } else {
    for (const r of P.rows) {
      if (r.play && hov(r.play)) {
        try {G.get("level").setString(r.lvl)} catch (e) {}
        try {G.get("lvlFrom").setString("demonlist")} catch (e) {}
        paintGo("level");
        break;
      }
    }
  }
}

};
gdjs.demonlistCode.eventsList0 = function(runtimeScene) {

{


gdjs.demonlistCode.userFunc0x1246be8(runtimeScene);

}


};gdjs.demonlistCode.asyncCallback46356212 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.demonlistCode.localVariables);
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "portal", true);
}
gdjs.demonlistCode.localVariables.length = 0;
}
gdjs.demonlistCode.idToCallbackMap.set(46356212, gdjs.demonlistCode.asyncCallback46356212);
gdjs.demonlistCode.eventsList1 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.demonlistCode.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(0.2), (runtimeScene) => (gdjs.demonlistCode.asyncCallback46356212(runtimeScene, asyncObjectsList)), 46356212, asyncObjectsList);
}
}

}


};gdjs.demonlistCode.eventsList2 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("backbutton"), gdjs.demonlistCode.GDbackbuttonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Escape");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.demonlistCode.GDbackbuttonObjects1.length;i<l;++i) {
    if ( gdjs.demonlistCode.GDbackbuttonObjects1[i].isVisible() ) {
        isConditionTrue_0 = true;
        gdjs.demonlistCode.GDbackbuttonObjects1[k] = gdjs.demonlistCode.GDbackbuttonObjects1[i];
        ++k;
    }
}
gdjs.demonlistCode.GDbackbuttonObjects1.length = k;
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("transition"), gdjs.demonlistCode.GDtransitionObjects1);
{for(var i = 0, len = gdjs.demonlistCode.GDtransitionObjects1.length ;i < len;++i) {
    gdjs.demonlistCode.GDtransitionObjects1[i].getBehavior("FlashTransitionPainter").PaintEffect("0;0;0", 0.2, "Circular", "Forward", 0, null);
}
}

{ //Subevents
gdjs.demonlistCode.eventsList1(runtimeScene);} //End of subevents
}

}


};gdjs.demonlistCode.eventsList3 = function(runtimeScene) {

{


gdjs.demonlistCode.eventsList0(runtimeScene);
}


{


gdjs.demonlistCode.eventsList2(runtimeScene);
}


};

gdjs.demonlistCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.demonlistCode.GDnerdviewObjects1.length = 0;
gdjs.demonlistCode.GDnerdviewObjects2.length = 0;
gdjs.demonlistCode.GDmlsBgBorderObjects1.length = 0;
gdjs.demonlistCode.GDmlsBgBorderObjects2.length = 0;
gdjs.demonlistCode.GDtransitionObjects1.length = 0;
gdjs.demonlistCode.GDtransitionObjects2.length = 0;
gdjs.demonlistCode.GDbackbuttonObjects1.length = 0;
gdjs.demonlistCode.GDbackbuttonObjects2.length = 0;
gdjs.demonlistCode.GDNewTextInputObjects1.length = 0;
gdjs.demonlistCode.GDNewTextInputObjects2.length = 0;
gdjs.demonlistCode.GDplaybuttonObjects1.length = 0;
gdjs.demonlistCode.GDplaybuttonObjects2.length = 0;
gdjs.demonlistCode.GDtitlesObjects1.length = 0;
gdjs.demonlistCode.GDtitlesObjects2.length = 0;
gdjs.demonlistCode.GDmappackbgObjects1.length = 0;
gdjs.demonlistCode.GDmappackbgObjects2.length = 0;
gdjs.demonlistCode.GDmapPackDifficultyObjects1.length = 0;
gdjs.demonlistCode.GDmapPackDifficultyObjects2.length = 0;
gdjs.demonlistCode.GDtitleObjects1.length = 0;
gdjs.demonlistCode.GDtitleObjects2.length = 0;
gdjs.demonlistCode.GDmaplevelObjects1.length = 0;
gdjs.demonlistCode.GDmaplevelObjects2.length = 0;
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects1.length = 0;
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects2.length = 0;
gdjs.demonlistCode.GDrefreshObjects1.length = 0;
gdjs.demonlistCode.GDrefreshObjects2.length = 0;
gdjs.demonlistCode.GDplacementObjects1.length = 0;
gdjs.demonlistCode.GDplacementObjects2.length = 0;
gdjs.demonlistCode.GDoverlvlsObjects1.length = 0;
gdjs.demonlistCode.GDoverlvlsObjects2.length = 0;
gdjs.demonlistCode.GDunderlvlsObjects1.length = 0;
gdjs.demonlistCode.GDunderlvlsObjects2.length = 0;
gdjs.demonlistCode.GDbgObjects1.length = 0;
gdjs.demonlistCode.GDbgObjects2.length = 0;
gdjs.demonlistCode.GDchristmasLightObjects1.length = 0;
gdjs.demonlistCode.GDchristmasLightObjects2.length = 0;

gdjs.demonlistCode.eventsList3(runtimeScene);
gdjs.demonlistCode.GDnerdviewObjects1.length = 0;
gdjs.demonlistCode.GDnerdviewObjects2.length = 0;
gdjs.demonlistCode.GDmlsBgBorderObjects1.length = 0;
gdjs.demonlistCode.GDmlsBgBorderObjects2.length = 0;
gdjs.demonlistCode.GDtransitionObjects1.length = 0;
gdjs.demonlistCode.GDtransitionObjects2.length = 0;
gdjs.demonlistCode.GDbackbuttonObjects1.length = 0;
gdjs.demonlistCode.GDbackbuttonObjects2.length = 0;
gdjs.demonlistCode.GDNewTextInputObjects1.length = 0;
gdjs.demonlistCode.GDNewTextInputObjects2.length = 0;
gdjs.demonlistCode.GDplaybuttonObjects1.length = 0;
gdjs.demonlistCode.GDplaybuttonObjects2.length = 0;
gdjs.demonlistCode.GDtitlesObjects1.length = 0;
gdjs.demonlistCode.GDtitlesObjects2.length = 0;
gdjs.demonlistCode.GDmappackbgObjects1.length = 0;
gdjs.demonlistCode.GDmappackbgObjects2.length = 0;
gdjs.demonlistCode.GDmapPackDifficultyObjects1.length = 0;
gdjs.demonlistCode.GDmapPackDifficultyObjects2.length = 0;
gdjs.demonlistCode.GDtitleObjects1.length = 0;
gdjs.demonlistCode.GDtitleObjects2.length = 0;
gdjs.demonlistCode.GDmaplevelObjects1.length = 0;
gdjs.demonlistCode.GDmaplevelObjects2.length = 0;
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects1.length = 0;
gdjs.demonlistCode.GDmapPackLevelDifficultyObjects2.length = 0;
gdjs.demonlistCode.GDrefreshObjects1.length = 0;
gdjs.demonlistCode.GDrefreshObjects2.length = 0;
gdjs.demonlistCode.GDplacementObjects1.length = 0;
gdjs.demonlistCode.GDplacementObjects2.length = 0;
gdjs.demonlistCode.GDoverlvlsObjects1.length = 0;
gdjs.demonlistCode.GDoverlvlsObjects2.length = 0;
gdjs.demonlistCode.GDunderlvlsObjects1.length = 0;
gdjs.demonlistCode.GDunderlvlsObjects2.length = 0;
gdjs.demonlistCode.GDbgObjects1.length = 0;
gdjs.demonlistCode.GDbgObjects2.length = 0;
gdjs.demonlistCode.GDchristmasLightObjects1.length = 0;
gdjs.demonlistCode.GDchristmasLightObjects2.length = 0;


return;

}

gdjs['demonlistCode'] = gdjs.demonlistCode;
