ml = (function(){

  var _basePath = ''
    , _currentlyDownloading = {}
    , _loadedModuleDefinitions = {} // Module definitions which have been loaded but not necessarily executed
    , _executedModules = {}
    , _numWaitingOnDefLoad = 0
    , _numWaitingToExecute = 0
    , _currentModuleDef = null;

  var modulite = this.modulite = {
    version : '0.0.1',
  };

  modulite.module = function(name){
    if(_currentModuleDef)
      throw('Error: Module "' + _currentModuleDef.name + '" does not call defines()');

    _currentModuleDef = { name : name, dependencies : {}, callback : null };
    return this;
  }

  modulite.requires = function(){
    if(!_currentModuleDef)
      throw('Error: Must call module() before calling requires()');

    _currentModuleDef.dependencies = Array.prototype.slice.call(arguments);
    return this;
  }

  modulite.defines = function(callback){
    if(!_currentModuleDef)
      throw('Error: Must call module() before calling defines()');

    _currentModuleDef.callback = callback;
    _loadedModuleDefinitions[_currentModuleDef.name] = _currentModuleDef;
    
    if(_currentlyDownloading[_currentModuleDef.name])
      delete _currentlyDownloading[_currentModuleDef.name];
    
    _numWaitingToExecute++;
    
    _currentModuleDef = null;
    _resolveDependencies();
    return this;
  }

  modulite.libraryPath = function(path){
    _basePath = path;
    return this;
  }

  function _resolveDependencies(){
    var wereAnyModulesLoaded = false;
    for (var moduleName in _loadedModuleDefinitions){
      var module = _loadedModuleDefinitions[moduleName];
      var allModuleDependenciesLoaded = true;
      for (var i = 0; i < module.dependencies.length; i++) {
        var dependencyName = module.dependencies[i];

        if(!_executedModules[dependencyName])
          allModuleDependenciesLoaded = false;

        if(!_loadedModuleDefinitions[dependencyName]){
          _loadModuleDefinitionFor(dependencyName, moduleName);
        }
      }

      if(allModuleDependenciesLoaded && !_executedModules[moduleName]){
        _executeModule(module);
        wereAnyModulesLoaded = true; 
        _numWaitingToExecute--;       
      }
    }

    if(wereAnyModulesLoaded){
      _resolveDependencies();      
    } else if(_numWaitingOnDefLoad == 0 && _numWaitingToExecute > 0) {
        throw('Error: Unresolved module reference (circular dependencies?)');
    }
  }

  function _loadModuleDefinitionFor(name, requiredBy){
    if(_currentlyDownloading[name])
      return;

    var path = _basePath + name.replace(/\./g, '/') + '.js';
    _numWaitingOnDefLoad++;
    _currentlyDownloading[name] = path;
    _loadScript({ 
      url : path, 
      onSuccess: function(){
        _numWaitingOnDefLoad--; 
        _resolveDependencies();
      }, 
      onError: function(){
        throw ('Error: Failed to load module [' + name + '] at ['  + path + '] ' + 'required by [' + requiredBy + ']');
      }
    });
  }

  function _loadScript(options){
    // adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = options.url;

    // then bind the event to the callback function 
    // there are several events for cross browser compatibility
    script.onreadystatechange = options.onSuccess;
    script.onload = options.onSuccess;
    script.onerror = options.onError;

    // fire the loading
    head.appendChild(script);
  }

  function _executeModule(module){
    _executedModules[module.name] = module;
    
    console.log('Loading Module [' + module.name + ']');
    if(module.callback)
      module.callback();
  }

  return modulite;
})();




