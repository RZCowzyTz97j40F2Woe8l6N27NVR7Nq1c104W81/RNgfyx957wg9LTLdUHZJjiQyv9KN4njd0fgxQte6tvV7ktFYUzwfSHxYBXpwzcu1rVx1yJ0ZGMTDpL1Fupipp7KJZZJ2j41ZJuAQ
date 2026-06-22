## tas stuff
- all runs are now recorded in the background. i literally implemented this change early into development, yet it somehow got lost..
- orbs rotation, block state, physics object position/velocity etc are now properly saved in checkpoints 
- "backtracking" is now possible - after reaching a normal checkpoint during a macro practice run, you can press U at any time to teleport to that checkpoint. this doesn't have much use, actually, however coins are saved even if you die, so in levels where coin paths intentionally kill you / cause a softlock can be escaped,  
- speed control: scrub the game speed from a 0.01x crawl up to 10x, and the music follows along
  in both tempo and pitch, even past the limits the engine normally allows.
- frame-by-frame stepping: advance or rewind a single frame at a time (comma and period) to line
  up the tightest timings.
- hitbox view: draws the true collision shapes rather than rough boxes. the player shape rotates
  and resizes with you (a box for the cube, a circle for the ball, wave and ufo, and so on),
  hazards show in red and solids in blue, pads show as the thin strip they really are, and orbs,
  portals, triggers and the goal show their activation ring.
- player info readout: a live bottom-left panel with your position, your horizontal, vertical and
  rotational speed, plus a little arrow drawn from the player showing your velocity direction.
- input viewer: an on-screen d-pad that lights up the keys you are pressing (arrows, wasd, space,
  or a click). during a replay it shows the recorded run's own inputs instead of yours.
- fix a recorded run in place: pause a replay, hit practice, and keep playing from that exact
  frame to redo a mistake. it re-records from that point on, and the corrected run becomes your
  saved macro, so you never have to redo the whole thing.
- video export: renders any run to an mp4 with the audio mixed in. the picture is a crisp 3x
  pixel-art upscale, there are short fade-in and fade-out bookends, and the audio is exported at
  full volume no matter where your in-game volume is set. it is fast now, where it used to take
  minutes for a few seconds of footage. an optional "show ui in recording" keeps the pause button
  and fps counter in frame; otherwise only the gameplay is captured.
- fair play: using any of the assist tools (changing speed, hitbox view, practice, or watching a
  replay) marks that attempt so it does not count as a legitimate completion.
- everything has its own home: all of these toggles live in a dedicated tas tab in settings
  (frame advance, input display, player info, show ui in recording, and more).
- quality-of-life on the overlay itself: the button row can be dragged anywhere on screen and
  remembers where you put it, and hovering a button shows what it does along the bottom.

## overall game improvements

- click to jump: a left-click now jumps, the same as the keys. clicks on the on-screen tas
  buttons or the pause button do not count as a jump.
- pausing feels right: the pause button and esc both fully pause and slide the menu out (the
  pause button used to just open the menu without really pausing), and space resumes, or cleanly
  restarts a finished level with the win coins reset.
- esc goes back in every menu, rebuilt so it is a normal editable part of the game rather than a
  bolted-on script.
- edit any level: open any level, including the main levels and map packs, in the editor as your
  own independent copy, and download any level to a file from the pause menu.
- music quality toggle: switch between high-quality and smaller compressed music, and you can
  flip it live without a restart.
- gapless music: looping tracks no longer go silent for a moment at every loop point, and the
  menu theme is loaded at startup so it plays instantly instead of stuttering in a beat late.
- smoother menu-to-level transitions, with the grey flash on the way in gone.
- the full demon list now shows all 69 entries (it used to stop at the first 18).
- leaving a demon-list or rated level now returns you to the right list instead of dropping you
  on the wrong screen.
- map packs no longer flash a placeholder "0" / "by 0" title before the real name loads.
- audio fixes: a few tracks that were silent now play, and the high-quality "beginnings" track no
  longer has a stray leftover jingle.
- lighter download: the game now ships as a small program plus a separate game folder, so the
  music and assets sit loose and swappable, with a lighter compressed-audio version available.

## restoration additions

- rebuilt the editor's fill tool: drag to fill a rectangle, pick from six block types in a popup
  with each block's real texture, and see a live preview of the grid as you drag. fills now both
  render correctly and save, where before they could come out blank or vanish on reload.
- restored the editor's instant playtest mode: test a level you are building right away in a
  stripped-down demo, with just a stop and a practice button, and esc to return to the editor.
- fixed a save bug that could wipe a level down to nothing (opening the pause menu with esc and
  then saving used to write an empty, placeholder level).
- reconstructed the settings menu and the portal hub from scratch, and made the settings menu
  data-driven so its tabs and descriptions are easy to extend.
- a long list of smaller fixes: the stray demon face on the custom-level info screen is gone, the
  selected tool in the editor now shows a clear outline, a dead refresh button is hidden, and the
  time-attack time limit only appears for time-attack levels.
