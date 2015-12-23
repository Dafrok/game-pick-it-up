var $ = require('jquery');
var Animation = require('./animation.js');

var move = function ($node, direction, speed) {
    switch (direction) {
        case 'left': $node.css('left', parseInt($node.css('left'), 10) - speed); break;
        case 'right': $node.css('left', parseInt($node.css('left'), 10) + speed); break;
        case 'up': $node.css('bottom', parseInt($node.css('bottom'), 10) + speed); break;
        case 'down': $node.css('bottom', parseInt($node.css('bottom'), 10) - speed); break;
    }
};

var setAnimation = function (source, $node) {
    return source.map
        ? (new Animation()).changePosition($node[0], source.map).repeat()
        : null;
};

var Player = function (option) {
    this.$el = option.$el;
    this.source = option.source;
    this.width = option.width || this.source.width;
    this.height = option.height || this.source.height;
    this.speed = option.speed || this.source.speed || 10;
    this.$el.css({
        width: this.width,
        height: this.height,
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'block'
    });
    this.game = option.game;
    this.interval = null;
    this.isMoving = false;
    this.direction = {
        left: false,
        right: false
    };
    this.state = 0

    var $left = $('<div data-game-player="left" class="left"></div>').css({
        display: this.source.image.left.default ? 'block' : 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'url(' + this.source.image.left.state[0] + ')',
    });
    var $right = $('<div data-game-player="right" class="right"></div>').css({
        display: this.source.image.right.default ? 'block' : 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'url(' + this.source.image.right.state[0] + ')',
    });
    var $stopLeft = $('<div data-game-player="stop-left" class="stop-left"></div>').css({
        display: this.source.image.stopLeft.default ? 'block' : 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'url('
            + (this.source.image.stopLeft
            ? this.source.image.stopLeft.state[0]
            : this.source.image.stop.state[0])
            + ')'
    });
    var $stopRight = $('<div data-game-player="stop-right" class="stop-right"></div>').css({
        display: this.source.image.stopRight.default ? 'block' : 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'url('
            + (this.source.image.stopRight
            ? this.source.image.stopRight.state[0]
            : this.source.image.stop.state[0])
            + ')'
    });
    var $model = $('<div data-game-player="model" class="model"></div>').css({
        position: 'absolute',
        width: this.width * 0.5,
        height: this.height * 0.5,
        top: '50%',
        left: '50%',
        marginTop: -this.width * 0.5,
        marginRight: -this.height * 0.5
    });
    this.$el.append($left, $right, $stopLeft, $stopRight, $model);
    this.$model = $model;

    this.animation = {
        left: setAnimation(this.source.image.left, $left),
        right: setAnimation(this.source.image.right, $right),
        stopLeft: setAnimation(this.source.image.stopLeft, $stopLeft),
        stopRight: setAnimation(this.source.image.stopRight, $stopRight),
    }
};

Player.prototype.onActive = function (option) {
    var $document = $(document);
    var self = this;
    clearInterval(this.interval);
    for (var i in this.animation) {
        this.animation[i] && this.animation[i].start(option.frameInterval || 100);
    }
    this.setState(0);
    $document.on('keydown', function (e) {
        // ←37 →39
        e.preventDefault();
        switch (e.keyCode) {
            case 37: self.go('left'); break;
            case 39: self.go('right'); break;
        }
    });
    $document.on('keyup', function (e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 37: self.stop('left'); break;
            case 39: self.stop('right'); break;
        }
    });
    this.interval = setInterval(function () {
        this.moving();
    }.bind(this) ,16.7);
};

Player.prototype.offActive = function () {
    var $document = $(document);
    $document.off('keyup');
    $document.off('keydown');
    this.isMoving = false;
    this.direction.left = false;
    this.direction.right = false;
    for (var i in this.animation) {
        this.animation[i] && this.animation[i].pause();
    }
    clearInterval(this.interval);
};

Player.prototype.go = function (direction) {
    this.isMoving = direction;
    this.direction[direction] = true;
    this.animation[direction].start(100);
};

Player.prototype.stop = function (direction) {
    this.direction[direction] = false;
    if (direction === 'left') {
        direction === this.isMoving && !(this.direction.right ^ this.direction.left) ?
            (this.isMoving = false) : (this.isMoving = 'right');
        !this.isMoving && this.changeDirection('stop-left');
    } else if (direction === 'right') {
        direction === this.isMoving && !(this.direction.left ^ this.direction.right) ?
            (this.isMoving = false) : (this.isMoving = 'left');
        !this.isMoving && this.changeDirection('stop-right');
    }
    !this.isMoving && this.animation.left && this.animation.left.pause();
    !this.isMoving && this.animation.right && this.animation.right.pause();
};

Player.prototype.moving = function () {
    this.isLimited(this.isMoving);
    switch (this.isMoving) {
        case 'left':
            move(this.$el, this.isMoving, this.speed);
            break;
        case 'right':
            move(this.$el, this.isMoving, this.speed);
            break;
        // case 'up': move($player, game.player.isMoving, game.step); break;
        // case 'down': move($player, game.player.isMoving, game.step); break;
    }
    this.changeDirection(this.isMoving);
};

Player.prototype.isLimited = function (direction) {
    var offset = parseInt(this.$el.css('left'), 10);
    var maxStep = this.game.$el.width() - this.source.width;
    var minStep = 0;
    if (offset <= minStep && direction === 'left') {
        this.$el.css('left', minStep);
        return false;
    } else if (offset >= maxStep && direction === 'right') {
        this.$el.css('left', maxStep);
        return false;
    } else {
        return true;
    }
};

Player.prototype.changeDirection = function (direction) {
    this.$el.find('.' + direction).show().siblings().not('.model').hide();
};

Player.prototype.setState = function (state) {
    this.state = state;
    this.source.image.left && this.source.image.left.state[state]
        && this.$el.children('.left').css('background', 'url(' + this.source.image.left.state[state] + ')');
    this.source.image.right && this.source.image.right.state[state]
        && this.$el.children('.right').css('background', 'url(' + this.source.image.right.state[state] + ')');
    this.source.image.stopLeft && this.source.image.stopLeft.state[state]
        && this.$el.children('.stop-left').css('background', 'url(' + this.source.image.stopLeft.state[state] + ')');
    this.source.image.stopRight && this.source.image.stopRight.state[state]
        && this.$el.children('.stop-right').css('background', 'url(' + this.source.image.stopRight.state[state] + ')');
    this.source.image.stop && this.source.image.stop.state[state]
        && this.$el.children('.stop').css('background', 'url(' + this.source.image.stop.state[state] + ')');
};

Player.prototype.autoChangeState = function (flag) {
    flag && this.setState(this.state + 1)
}

module.exports = Player;
