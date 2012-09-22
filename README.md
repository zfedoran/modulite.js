modulite.js
===========

Modulite.js is a lightweight javascript module loader.


**Usage**

```javascript
ml.module(
  'game.some-file'
)
.requires(
  'core.vector3',
  'core.matrix',
  'core.camera3d',
  'game.enemies.tank',
  'assets.loader',
  'math.helper'
)
.defines(function(){
  // ... code for this module
});
```

**Example**

For a complete sample project, check out <a href="https://github.com/zfedoran/modulite-threejs">modulite-threejs</a>.