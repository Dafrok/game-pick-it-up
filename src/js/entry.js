var $ = require('jquery');
var source = require('./source.js');
var Game = require('./game/game.js');
var Animation = require('./game/animation.js');

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

    },
    onEnd: function () {
        $('button.start').text('Game Start!').removeClass('active');
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
    var $this = $(this);
    $this
        .text('Ready...')
        .addClass('active');
    $game.fadeIn(1000);
    game.player.changeDirection('left');
    game.player.animation.left.start(100);
    game.player.$el.css('left', '100%');
    game.player.$el.animate({left: '50%'}, 3000, function () {
        game.player.animation.left.pause();
        game.player.stop('right');
        game.player.stop('left');
        game.start();
        $this.text('Go!');
        setTimeout(function () {
            $this.text('');
        }, 2000);
    }.bind(this));
});