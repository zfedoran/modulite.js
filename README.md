Modulite.js
===========

Modulite.js is a lightweight javascript module loader.

Getting Started
===============

This setup assumes you keep all your JavaScript files in a "javascripts" directory in your project. For example, if you have a project that has an index.html page, with some scripts, the directory layout might look like so:

```
project/
    index.html
    javascripts/
        game.js
        engine/
            camera.js
            vector2d.js
            matrix.js
            ...
        util/
            math.js
            ...
```

Add modulite.js to the javascripts directory. Your directory structure should now look like this:

```
project/
    index.html
    javascripts/
        game.js
        modulite.js
        engine/
            camera.js
            vector2d.js
            matrix.js
            ...
        util/
            math.js
            ...
```

To load modules using modulite.js, you must first load modulite.js. Simply add a link to modulite.js relative to your index.html file.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Modulite.js Sample</title>
  <script type="text/javascript" src="javascripts/modulite.js"></script>
  <script type="text/javascript" src="javascripts/game.js"></script>
</head>
<body>
  <h1>My Sample Project</h1>
</body>
</html>
```

Note that we only need to reference two JavaScript files, modulite.js will automatically import any files referenced by game.js. Inside of game.js, you can use requires() to load any other scripts you need to run. Your game.js might look something like this:

```javascript
// set paths to module namespaces
ml.config({
  'util': 'util/',
  'core': 'engine/'
});

ml.module(
  'game'
)
.requires(
  'util.math',
  'core.vector3',
  'core.matrix',
  'core.camera3d',
  // etc...
)
.defines(function(){

  var Game = function(){
    this.width = 720;
    this.height = 480;
  }

  Game.prototype = {
    init: function(){
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      document.body.appendChild(canvas);
      //etc...
    },
    tick: function(){
      //update character positions
    },
    draw: function(){
      //draw game sprites
    }
  }
  
  var gameInstance = new Game();
  gameInstance.init();

});
```

Lets look at what is going on in this file. The first line starts with `ml.module`. This function simply tells modulite what you are calling the module defined in this file. Note that we can also use `modulite.module` instead.  

Next we tell modulite.js which modules are required by the current module. The module names are important here, they should look like the path to the files. If you need more control over the module paths, it is possible to setup namespace paths using the `ml.config()` function. 

For instance, if my game engine was contained outside the `javascripts` directory, we could use something like the following:

```javascript
// set paths to module namespaces
ml.config({
  'util': 'util/',
  'engine': '../engine/'
});

ml.module(
  'game'
)
.requires(
  'util.math',
  'engine.vector3',
  'engine.matrix',
  'engine.camera3d',
  // etc...
)
.defines(function(){
// etc...
```

Finally, `ml.defines()` declares the body of our module. The callback passed to `ml.defines()` will only be called once all of the required dependencies have been loaded.

Baking
======

Once you have finished your project, you can bake all of your files into a single file using the modulite `bakeCurrentStack()` function.

```javascript
ml.bakeCurrentStack();
```

Example
=======

For a complete sample project, check out <a href="https://github.com/zfedoran/modulite-threejs">modulite-threejs</a>.
