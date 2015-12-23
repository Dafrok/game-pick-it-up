# Game: Pick it up!
### Demo
[Try this game](http://dafrok.github.io/game-pick-it-up/)

### Usage
```JavaScript
var source = require('./source.js');
var Game = require('./game/game.js');

var $game = $('#game').hide();

var game = new Game({
    el: '#game',
    source: source
});
```
