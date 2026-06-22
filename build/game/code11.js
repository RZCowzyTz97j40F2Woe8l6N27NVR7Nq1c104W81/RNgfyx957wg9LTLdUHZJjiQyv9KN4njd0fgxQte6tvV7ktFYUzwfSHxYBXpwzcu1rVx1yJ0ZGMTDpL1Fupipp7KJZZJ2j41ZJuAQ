gdjs.ratedCode = {};
gdjs.ratedCode.localVariables = [];
gdjs.ratedCode.idToCallbackMap = new Map();
gdjs.ratedCode.GDnerdviewObjects1= [];
gdjs.ratedCode.GDnerdviewObjects2= [];
gdjs.ratedCode.GDmlsBgBorderObjects1= [];
gdjs.ratedCode.GDmlsBgBorderObjects2= [];
gdjs.ratedCode.GDtransitionObjects1= [];
gdjs.ratedCode.GDtransitionObjects2= [];
gdjs.ratedCode.GDbackbuttonObjects1= [];
gdjs.ratedCode.GDbackbuttonObjects2= [];
gdjs.ratedCode.GDNewTextInputObjects1= [];
gdjs.ratedCode.GDNewTextInputObjects2= [];
gdjs.ratedCode.GDplaybuttonObjects1= [];
gdjs.ratedCode.GDplaybuttonObjects2= [];
gdjs.ratedCode.GDtitlesObjects1= [];
gdjs.ratedCode.GDtitlesObjects2= [];
gdjs.ratedCode.GDmappackbgObjects1= [];
gdjs.ratedCode.GDmappackbgObjects2= [];
gdjs.ratedCode.GDmapPackDifficultyObjects1= [];
gdjs.ratedCode.GDmapPackDifficultyObjects2= [];
gdjs.ratedCode.GDtitleObjects1= [];
gdjs.ratedCode.GDtitleObjects2= [];
gdjs.ratedCode.GDmaplevelObjects1= [];
gdjs.ratedCode.GDmaplevelObjects2= [];
gdjs.ratedCode.GDmapPackLevelDifficultyObjects1= [];
gdjs.ratedCode.GDmapPackLevelDifficultyObjects2= [];
gdjs.ratedCode.GDrefreshObjects1= [];
gdjs.ratedCode.GDrefreshObjects2= [];
gdjs.ratedCode.GDplacementObjects1= [];
gdjs.ratedCode.GDplacementObjects2= [];
gdjs.ratedCode.GDoverlvlsObjects1= [];
gdjs.ratedCode.GDoverlvlsObjects2= [];
gdjs.ratedCode.GDunderlvlsObjects1= [];
gdjs.ratedCode.GDunderlvlsObjects2= [];
gdjs.ratedCode.GDratingObjects1= [];
gdjs.ratedCode.GDratingObjects2= [];
gdjs.ratedCode.GDratetypeObjects1= [];
gdjs.ratedCode.GDratetypeObjects2= [];
gdjs.ratedCode.GDpageScrollRightObjects1= [];
gdjs.ratedCode.GDpageScrollRightObjects2= [];
gdjs.ratedCode.GDpageScrollLeftObjects1= [];
gdjs.ratedCode.GDpageScrollLeftObjects2= [];
gdjs.ratedCode.GDfeaturedSliderObjects1= [];
gdjs.ratedCode.GDfeaturedSliderObjects2= [];
gdjs.ratedCode.GDbgObjects1= [];
gdjs.ratedCode.GDbgObjects2= [];
gdjs.ratedCode.GDchristmasLightObjects1= [];
gdjs.ratedCode.GDchristmasLightObjects2= [];


gdjs.ratedCode.userFunc0xaa38d0 = function GDJSInlineCode(runtimeScene) {
"use strict";
/*//////////////////////////////////////////////////////////////////////*/
// rated tab (recovered from code11.js). like demonlist - a vertical scroll
// list of rows on the "mappack" layer - but ordered by rateDate desc and
// filtered by the rate type: rateselect 1 = all rated (rate 1 or 2), 2 =
// featured only (rate 2). each row carries a "ratetype" badge (featured ->
// YOffset 24). the featuredSlider toggles the filter. play sets the global
// "level" + "lvlFrom" and opens "level"; back -> portal; refresh refetches.
/*//////////////////////////////////////////////////////////////////////*/

const scene = runtimeScene;
const G = scene.getGame().getVariables();
const P = (window.__rated = window.__rated || {});

const KEY = "AIzaSyDW-WtdoFxgkx6IC9z6ZqKIo-9yTZ5ILWE";
const URL = "https://firestore.googleapis.com/v1/projects/tgd-reborn/databases/(default)/documents/rated?key=" + KEY + "&pageSize=300";

// rated uses the rateicons_new.png "ratesheet" (NOT difficulties.png): each
// difficulty is a ROW at ratesheet.y in 24px cells, with a 6-frame animated
// glow running along X. value here = ratesheet.y for that difficulty.
const RATE = {
  na: 0, auto: 360, easy: 336, normal: 312, medium: 288, hard: 264, harder: 240,
  veryhard: 216, tough: 192, insane: 168, extreme: 144, easydemon: 120,
  mediumdemon: 96, demon: 72, harddemon: 72, insanedemon: 48, extremedemon: 24
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

function rateselect() {try {const r = G.get("rateselect").getAsNumber(); return r === 2 ? 2 : 1} catch (e) {return 1}}

function fetchList() {
  P.docs = null;
  P.error = "";
  try {
    fetch(URL).then(r => r.json()).then(j => {
      const g = (f, k) => {
        const c = f[k];
        if (!c) return "";
        if (c.stringValue != null) return c.stringValue;
        if (c.integerValue != null) return c.integerValue;
        if (c.doubleValue != null) return "" + c.doubleValue;
        return "";
      };
      const docs = (j.documents || []).map(d => {
        const f = d.fields || {};
        return {name: g(f, "name"), author: g(f, "author"), diff: g(f, "diff"),
          rate: parseInt(g(f, "rate") || "1", 10), rateDate: parseFloat(g(f, "rateDate") || "0"), lvl: g(f, "lvl")};
      });
      docs.sort((a, b) => b.rateDate - a.rateDate);
      P.docs = docs;
    }).catch(e => {P.docs = []; P.error = "offline"});
  } catch (e) {P.docs = []; P.error = "offline"}
}

function clearRows() {
  for (const r of P.rows || []) for (const o of r.objs) {try {o.deleteFromScene(scene)} catch (e) {}}
  P.rows = [];
  P.built = false;
  P.scroll = 120;
}

/*//////////////////////////////////////////////////////////////////////*/

if (P.owner !== scene) {
  P.owner = scene;
  P.rows = [];
  P.built = false;
  P.scroll = 120;
  P.pending = null;
  try {if (!G.has("rateselect") || G.get("rateselect").getAsNumber() === 0) G.get("rateselect").setNumber(1)} catch (e) {}
  // sync the slider knob to the current filter (1 = all rated, 2 = featured)
  P.lastSel = rateselect();
  try {const sl = first("featuredSlider"); if (sl) sl.SetValue(P.lastSel, null)} catch (e) {}
  fetchList();
  // title logo -> the rated strip
  try {
    const tt = first("titles");
    if (tt) {
      tt.setXOffset(0); tt.setYOffset(138);
      tt.getBehavior("Resizable").setWidth(64);
      tt.getBehavior("Resizable").setHeight(20);
      tt.setX(216 - 64 / 2);
    }
  } catch (e) {}
  try {const tr = first("transition"); if (tr) tr.getBehavior("FlashTransitionPainter").PaintEffect("0;0;0", 0.2, "Circular", "Backward", 0, null)} catch (e) {}
}

// title wobble
P.tphase = (P.tphase || 0) + gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(scene) * 60;
try {const tt = first("titles"); if (tt) {tt.setAngle(Math.cos(gdjs.toRad(P.tphase)) * 3); tt.setX(216 - tt.getWidth() / 2)}} catch (e) {}

// status / filter label on the nerdview (centred)
const nv = first("nerdview");
if (nv) {
  const msg = P.docs == null ? "Loading rated levels..." : (P.error ? "Could not reach the server" : "");
  settext(nv, msg);
  if (msg) {try {nv.setX(216 - nv.getWidth() / 2)} catch (e) {}}
}

/*//////////////////////////////////////////////////////////////////////*/
// build rows (filtered by rateselect) once data is in
/*//////////////////////////////////////////////////////////////////////*/

if (P.docs && !P.built) {
  P.built = true;
  const sel = rateselect();
  const list = P.docs.filter(d => sel === 2 ? d.rate >= 2 : d.rate >= 1);
  for (let i = 0; i < list.length; i++) {
    const d = list[i];
    const y = 52 + 44 * i;
    const row = {lvl: d.lvl, objs: []};

    const ml = create("maplevel");
    if (ml) {try {ml.setLayer("mappack")} catch (e) {} try {ml.setPosition(92, y)} catch (e) {} zord(ml, 2); row.bg = ml; row.objs.push(ml)}
    const bx = ml ? ml.getX() : 92;
    const base = ml ? ml.getY() : y;
    const rowH = ml ? ml.getHeight() : 40;

    const tName = create("title");
    if (tName) {try {tName.setLayer("mappack")} catch (e) {} try {tName.setPosition(126, base + 10)} catch (e) {} zord(tName, 4); settext(tName, fmtName(d.name)); row.objs.push(tName)}

    const tAuth = create("title");
    if (tAuth) {
      try {tAuth.setLayer("mappack")} catch (e) {}
      try {tAuth.setPosition(126, base + 21)} catch (e) {}
      zord(tAuth, 4);
      try {tAuth.setBitmapFontAndTextureAtlasResourceName("fonts\\garden.fnt", "fonts\\garden.png")} catch (e) {}
      settext(tAuth, "by " + d.author);
      tint(tAuth, "60;104;255");
      row.objs.push(tAuth);
    }

    // one static icon per level: rateicons_new.png cell = (rate-type column,
    // difficulty row). XOffset = rate*24 (rate type / glow), YOffset =
    // ratesheet.y (difficulty). NOT animated.
    const icon = create("mapPackLevelDifficulty");
    if (icon) {
      try {icon.setLayer("mappack")} catch (e) {}
      zord(icon, 3);
      const ry = RATE[("" + d.diff).toLowerCase().replace(/ /g, "")];
      try {icon.setYOffset(ry == null ? RATE.na : ry)} catch (e) {}
      try {icon.setXOffset(d.rate * 24)} catch (e) {}
      try {icon.getBehavior("Resizable").setWidth(24); icon.getBehavior("Resizable").setHeight(24)} catch (e) {}
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
const count = P.rows ? P.rows.length : 0;
P.scroll = Math.min(Math.max(P.scroll, 120), Math.max(120, 44 * count - 56));
try {gdjs.evtTools.camera.setCameraY(scene, P.scroll, "mappack", 0)} catch (e) {}

// rate-type slider: read its value, re-filter the list when it changes
try {
  const sl = first("featuredSlider");
  if (sl) {
    const v = sl.Value(null);
    if (v != null && v !== P.lastSel) {
      P.lastSel = v;
      try {G.get("rateselect").setNumber(v)} catch (e) {}
      clearRows();
    }
  }
} catch (e) {}

// slider preview faces (rateicons.png): top = featured/epic (48;0),
// bottom = normal (no decoration, 0;0)
for (const rt of scene.getObjects("ratetype") || []) {
  try {
    if (rt.getY() < 100) {rt.setXOffset(48); rt.setYOffset(0)}
    else {rt.setXOffset(0); rt.setYOffset(0)}
  } catch (e) {}
}

/*//////////////////////////////////////////////////////////////////////*/
// pending scene change
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
// input: play / back / refresh / toggle filter
/*//////////////////////////////////////////////////////////////////////*/

if (!P.pending && released) {
  const back = first("backbutton");
  const refresh = first("refresh");
  if (back && hov(back)) {
    paintGo("portal");
  } else if (refresh && hov(refresh)) {
    clearRows();
    fetchList();
  } else {
    for (const r of P.rows) {
      if (r.play && hov(r.play)) {
        try {G.get("level").setString(r.lvl)} catch (e) {}
        try {G.get("lvlFrom").setString("rated")} catch (e) {}
        paintGo("level");
        break;
      }
    }
  }
}

};
gdjs.ratedCode.eventsList0 = function(runtimeScene) {

{


gdjs.ratedCode.userFunc0xaa38d0(runtimeScene);

}


};gdjs.ratedCode.asyncCallback46481876 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.ratedCode.localVariables);
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "portal", true);
}
gdjs.ratedCode.localVariables.length = 0;
}
gdjs.ratedCode.idToCallbackMap.set(46481876, gdjs.ratedCode.asyncCallback46481876);
gdjs.ratedCode.eventsList1 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.ratedCode.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(0.2), (runtimeScene) => (gdjs.ratedCode.asyncCallback46481876(runtimeScene, asyncObjectsList)), 46481876, asyncObjectsList);
}
}

}


};gdjs.ratedCode.eventsList2 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("backbutton"), gdjs.ratedCode.GDbackbuttonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Escape");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.ratedCode.GDbackbuttonObjects1.length;i<l;++i) {
    if ( gdjs.ratedCode.GDbackbuttonObjects1[i].isVisible() ) {
        isConditionTrue_0 = true;
        gdjs.ratedCode.GDbackbuttonObjects1[k] = gdjs.ratedCode.GDbackbuttonObjects1[i];
        ++k;
    }
}
gdjs.ratedCode.GDbackbuttonObjects1.length = k;
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("transition"), gdjs.ratedCode.GDtransitionObjects1);
{for(var i = 0, len = gdjs.ratedCode.GDtransitionObjects1.length ;i < len;++i) {
    gdjs.ratedCode.GDtransitionObjects1[i].getBehavior("FlashTransitionPainter").PaintEffect("0;0;0", 0.2, "Circular", "Forward", 0, null);
}
}

{ //Subevents
gdjs.ratedCode.eventsList1(runtimeScene);} //End of subevents
}

}


};gdjs.ratedCode.eventsList3 = function(runtimeScene) {

{


gdjs.ratedCode.eventsList0(runtimeScene);
}


{


gdjs.ratedCode.eventsList2(runtimeScene);
}


};

gdjs.ratedCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.ratedCode.GDnerdviewObjects1.length = 0;
gdjs.ratedCode.GDnerdviewObjects2.length = 0;
gdjs.ratedCode.GDmlsBgBorderObjects1.length = 0;
gdjs.ratedCode.GDmlsBgBorderObjects2.length = 0;
gdjs.ratedCode.GDtransitionObjects1.length = 0;
gdjs.ratedCode.GDtransitionObjects2.length = 0;
gdjs.ratedCode.GDbackbuttonObjects1.length = 0;
gdjs.ratedCode.GDbackbuttonObjects2.length = 0;
gdjs.ratedCode.GDNewTextInputObjects1.length = 0;
gdjs.ratedCode.GDNewTextInputObjects2.length = 0;
gdjs.ratedCode.GDplaybuttonObjects1.length = 0;
gdjs.ratedCode.GDplaybuttonObjects2.length = 0;
gdjs.ratedCode.GDtitlesObjects1.length = 0;
gdjs.ratedCode.GDtitlesObjects2.length = 0;
gdjs.ratedCode.GDmappackbgObjects1.length = 0;
gdjs.ratedCode.GDmappackbgObjects2.length = 0;
gdjs.ratedCode.GDmapPackDifficultyObjects1.length = 0;
gdjs.ratedCode.GDmapPackDifficultyObjects2.length = 0;
gdjs.ratedCode.GDtitleObjects1.length = 0;
gdjs.ratedCode.GDtitleObjects2.length = 0;
gdjs.ratedCode.GDmaplevelObjects1.length = 0;
gdjs.ratedCode.GDmaplevelObjects2.length = 0;
gdjs.ratedCode.GDmapPackLevelDifficultyObjects1.length = 0;
gdjs.ratedCode.GDmapPackLevelDifficultyObjects2.length = 0;
gdjs.ratedCode.GDrefreshObjects1.length = 0;
gdjs.ratedCode.GDrefreshObjects2.length = 0;
gdjs.ratedCode.GDplacementObjects1.length = 0;
gdjs.ratedCode.GDplacementObjects2.length = 0;
gdjs.ratedCode.GDoverlvlsObjects1.length = 0;
gdjs.ratedCode.GDoverlvlsObjects2.length = 0;
gdjs.ratedCode.GDunderlvlsObjects1.length = 0;
gdjs.ratedCode.GDunderlvlsObjects2.length = 0;
gdjs.ratedCode.GDratingObjects1.length = 0;
gdjs.ratedCode.GDratingObjects2.length = 0;
gdjs.ratedCode.GDratetypeObjects1.length = 0;
gdjs.ratedCode.GDratetypeObjects2.length = 0;
gdjs.ratedCode.GDpageScrollRightObjects1.length = 0;
gdjs.ratedCode.GDpageScrollRightObjects2.length = 0;
gdjs.ratedCode.GDpageScrollLeftObjects1.length = 0;
gdjs.ratedCode.GDpageScrollLeftObjects2.length = 0;
gdjs.ratedCode.GDfeaturedSliderObjects1.length = 0;
gdjs.ratedCode.GDfeaturedSliderObjects2.length = 0;
gdjs.ratedCode.GDbgObjects1.length = 0;
gdjs.ratedCode.GDbgObjects2.length = 0;
gdjs.ratedCode.GDchristmasLightObjects1.length = 0;
gdjs.ratedCode.GDchristmasLightObjects2.length = 0;

gdjs.ratedCode.eventsList3(runtimeScene);
gdjs.ratedCode.GDnerdviewObjects1.length = 0;
gdjs.ratedCode.GDnerdviewObjects2.length = 0;
gdjs.ratedCode.GDmlsBgBorderObjects1.length = 0;
gdjs.ratedCode.GDmlsBgBorderObjects2.length = 0;
gdjs.ratedCode.GDtransitionObjects1.length = 0;
gdjs.ratedCode.GDtransitionObjects2.length = 0;
gdjs.ratedCode.GDbackbuttonObjects1.length = 0;
gdjs.ratedCode.GDbackbuttonObjects2.length = 0;
gdjs.ratedCode.GDNewTextInputObjects1.length = 0;
gdjs.ratedCode.GDNewTextInputObjects2.length = 0;
gdjs.ratedCode.GDplaybuttonObjects1.length = 0;
gdjs.ratedCode.GDplaybuttonObjects2.length = 0;
gdjs.ratedCode.GDtitlesObjects1.length = 0;
gdjs.ratedCode.GDtitlesObjects2.length = 0;
gdjs.ratedCode.GDmappackbgObjects1.length = 0;
gdjs.ratedCode.GDmappackbgObjects2.length = 0;
gdjs.ratedCode.GDmapPackDifficultyObjects1.length = 0;
gdjs.ratedCode.GDmapPackDifficultyObjects2.length = 0;
gdjs.ratedCode.GDtitleObjects1.length = 0;
gdjs.ratedCode.GDtitleObjects2.length = 0;
gdjs.ratedCode.GDmaplevelObjects1.length = 0;
gdjs.ratedCode.GDmaplevelObjects2.length = 0;
gdjs.ratedCode.GDmapPackLevelDifficultyObjects1.length = 0;
gdjs.ratedCode.GDmapPackLevelDifficultyObjects2.length = 0;
gdjs.ratedCode.GDrefreshObjects1.length = 0;
gdjs.ratedCode.GDrefreshObjects2.length = 0;
gdjs.ratedCode.GDplacementObjects1.length = 0;
gdjs.ratedCode.GDplacementObjects2.length = 0;
gdjs.ratedCode.GDoverlvlsObjects1.length = 0;
gdjs.ratedCode.GDoverlvlsObjects2.length = 0;
gdjs.ratedCode.GDunderlvlsObjects1.length = 0;
gdjs.ratedCode.GDunderlvlsObjects2.length = 0;
gdjs.ratedCode.GDratingObjects1.length = 0;
gdjs.ratedCode.GDratingObjects2.length = 0;
gdjs.ratedCode.GDratetypeObjects1.length = 0;
gdjs.ratedCode.GDratetypeObjects2.length = 0;
gdjs.ratedCode.GDpageScrollRightObjects1.length = 0;
gdjs.ratedCode.GDpageScrollRightObjects2.length = 0;
gdjs.ratedCode.GDpageScrollLeftObjects1.length = 0;
gdjs.ratedCode.GDpageScrollLeftObjects2.length = 0;
gdjs.ratedCode.GDfeaturedSliderObjects1.length = 0;
gdjs.ratedCode.GDfeaturedSliderObjects2.length = 0;
gdjs.ratedCode.GDbgObjects1.length = 0;
gdjs.ratedCode.GDbgObjects2.length = 0;
gdjs.ratedCode.GDchristmasLightObjects1.length = 0;
gdjs.ratedCode.GDchristmasLightObjects2.length = 0;


return;

}

gdjs['ratedCode'] = gdjs.ratedCode;
