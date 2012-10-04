## Modulite.js


Modulite.js is a lightweight javascript module loader. 

For an example of how to integrate modulite.js with three.js, check out the [modulite-threejs](https://github.com/zfedoran/modulite-threejs) project.


## Getting Started

**Directory Structure**

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

**HTML File**

To get started with modulite.js, add a `<script>` tag with the `src=""` attribute pointing to the location of modulite.js relative to your index.html file.

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

Note that we only need to reference two JavaScript files, modulite.js will automatically import any files referenced by game.js. You can use `ml.requires()` to load any other scripts you need. 

**Using Modulite.js**

Your game.js might look something like this:

```javascript
ml.module(
  'game'
)
.requires(
  'util.math',
  'engine.camera3d',
  'engine.vector3',
  // etc...
)
.defines(function(){

  var Game = function(){
    this.width = 720;
    this.height = 480;
    this.camera = new Camera3d();
    this.camera.position = new Vector3(0, 10, 0);
    this.camera.target = new Vector3(5, 10, 5);
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

Lets look at what is going on in this file. The first line starts with a call to `ml.module()`. This function simply tells modulite what you are calling the module defined in this file. Note that we can also use `modulite.module()` instead.  

Next we tell modulite.js which modules are required by the current module definition. The module names are important here, they should look like the path to the files. If you need more control over the module paths, it is possible to setup namespace paths using the `ml.config()` function. 

Finally, `ml.defines()` declares the body of our module. The callback passed to `ml.defines()` will only be called once all of the required dependencies have been loaded.

**Custom Paths**

If want more control over the project directory structure, you can use the `ml.config()` function. For example, lets move the `engine/` directory, from the example above, up to its parent directory. Since `engine/` is now outside the `javascripts/` directory, we need to tell modulite where to look when it is told to load a module from the `engine.<something>` namespace. The following function call will set that up for us:

```javascript
ml.config({
    'engine': '../engine/' // the game engine is in another directory!
  , 'somethingElse': '../../crazy/path/to/somethingElse'
  // etc...
});
```

The config function can also be used to create shorter or easier to remember namespaces. For example, lets pretend that the name `engine/` is too long. We can use the following config call to change it to something shorter.

```javascript
ml.config({
  'en': 'engine/' // we can now use ml.module('game').requires('en.vector2d')
});
```

## Baking

Once you have finished your project, you can bake all of your files into a single file using the modulite bakeCurrentStack function.

```javascript
ml.bakeCurrentStack();
// opens a new window with the baked source code
```

## API

### ml.module()
Begins a new module. 
```javascript
//example usage:
ml.module('name.of.module');
```

### ml.requires()
Declare the dependencies for the current module definition.
```javascript
//example usage:
ml.requires('a', 'b', 'c'/*, etc...*/);
```

### ml.defines()
Sets the callback to execute once all of the dependencies for the current module definition have been loaded and executed.
```javascript
//example usage:
ml.module(function(){
  console.log('hello, world');
});
```

### ml.config()
This function allows you to configure custom library paths.
```javascript
//example usage:
ml.config({
    'something': 'a/b/c/something/'
  , 'another': '../../crazy/path/to/another/'
});
```

### ml.disableBrowserCaching()
Disable the sometimes annoying browser caching for modules.
```javascript
//example usage:
ml.disableBrowserCaching(true);
```

### ml.on()
Bind a function to a modulite event. Valid events are: `'module'`, `'requires'`, `'define'`, and `'execute'`.
```javascript
//example usage:
var callback = function(name){ console.log('executed: ' + name); };
ml.on('execute', callback, this);
```

### ml.off()
Remove a bound function from a modulite event.
```javascript
//example usage:
var callback = function(name){ console.log('executed: ' + name); };
ml.on('execute', callback, this);

...

ml.off('execute', callback, this);
```

### ml.getCallbackStack()
Get a list of all executed module callbacks sorted by dependencies.
```javascript
//example usage:
ml.getCallbackStack();
-> [moduleA, moduleB, moduleC]
```

### ml.bakeCurrentStackString()
Bake all currently loaded modules into a single string, sorted by dependencies.
```javascript
//example usage:
ml.bakeCurrentStackString();
```

### ml.bakeCurrentStack()
Bake all currently loaded modules into a single string, sorted by dependencies and redirect the browser to the result.
```javascript
//example usage:
ml.bakeCurrentStack();
```

---
---

## Acknowledgements

The module definition syntax for modulite.js is inspired by the [Impact.js](http://impactjs.com/documentation/getting-started#modules) module system written by [Dominic Szablewski](http://www.phoboslab.org/).