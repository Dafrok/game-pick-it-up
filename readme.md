# Game: Pick it up!
[Demo](http://dafrok.github.io/game-pick-it-up/)
```JavaScript
var source = require('./source.js');
var Game = require('./game/game.js');

var $game = $('#game').hide();

var game = new Game({
    el: '#game',
    source: source
});
```