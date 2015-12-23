var $ = require('jquery');
var source = require('./source.js');
var Game = require('./game/game.js');

var $game = $('#game').hide();

var game = new Game({
    el: '#game',
    source: source,
    frameInterval: 100,
    time: 30,
    passLine: 40000,
    itemSpeed: [2, 5],
    playerSpeed: 10,
    onStart: function () {
        $game.fadeIn(1000);
    },
    onEnd: function () {
        $game.fadeOut(1000);
    },
    onWin: function (score) {
        alert('You win! You got ' + score + ' points.');
    },
    onLose: function (score) {
        alert('You lose... You got ' + score + ' points.');
    }
});

$('button.start').on('click', function () {
    game.start();
});