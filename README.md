modulite.js
===========

Modulite.js is a lightweight javascript module loader.


**Usage**

    
    ml.module('game')
    .requires(
      'game.level',
      'game.entity',
      'game.enemies.tank',
      'game.enemies.spike',
      'assets.loader',
      'math')
    .defines(function(){
      // ... code for this module
    });
    

**Example**

For a complete sample project, check out <a href="https://github.com/zfedoran/modulite-threejs">modulite-threejs</a>.