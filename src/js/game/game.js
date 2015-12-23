var $ = require('jquery');
var Player = require('./player.js');
var Timer = require('./timer.js');
var Score = require('./score.js');
var Item = require('./item.js');

var Game = function (option) {
    // 绑定jQuery对象
    var self = this;
    this.$el = $(option.el);
    var $player = $('<div data-game-player="player" class="player"></div>');
    var $score = $('<div data-game-score class="score"></div>');
    var $timer = $('<div data-game-timer class="timer"></div>');
    this.$el.append($player, $score, $timer);
    // 配置项
    this.time = option.time || 30;
    this.maxItems = option.maxItems || 10;
    this.passLine = option.passLine || 30000;
    this.step = option.step || 10;
    this.isPlaying = false;
    this.source = option.source;
    this.frameInterval = option.frameInterval || 100;

    this.score = new Score({
        $el: $score,
        score: option.score,
        game: this,
        source: this.source
    });
    this.timer = new Timer({
        $el: $timer,
        timeLimit: this.time,
        onEnd: function () {
            self.end();
        }
    });
    this.player = new Player({
        $el: $player,
        game: this,
        source: this.source.player
    });
    this.itemSpeed = option.itemSpeed || [1, 3];
    this.items = [];
    // 定时器
    this.interval = {};
    this.timeout = {};
    this.onStart = option.onStart;
    this.onEnd = option.onEnd;
    this.onWin = option.onWin;
    this.onLose = option.onLose;
    option.preload === false ? (this.preload = option.preload) : (this.preload = true);
    this.preload && this.preloadImage();
};

Game.prototype.start = function () {
    if (!this.isPlaying) {
        this.isPlaying = true;
        this.onStart && this.onStart();
        this.timer.start();
        this.score.setScore(0);
        this.player.onActive({frameInterval: this.frameInterval});
        this.dropItems();
    }
};

Game.prototype.end = function () {
    this.onEnd && this.onEnd();
    (this.score.score >= this.passLine)
        ? this.onWin(this.score.score) : this.onLose(this.score.score);
    this.player.offActive();
    this.clearItems();
    this.isPlaying = false;
};

Game.prototype.reset = function () {

};

Game.prototype.clearItems = function () {
    var self = this;
    self.items.forEach(function (item, i) {
        item.remove();
    });
    self.items = [];
}

Game.prototype.dropItems = function () {
    var count = this.$el.children('[data-item]').length;
    var self = this;
    if (count < this.maxItems && this.isPlaying) {
        var item = new Item({
            game: this,
            source: this.source.items,
            frameInterval: this.frameInterval,
            speed: this.itemSpeed
        });
        item.create();
        this.items.push(item);
    }
    requestAnimationFrame(function () {
        self.items.forEach(function (item, i) {
            if(!self.isPlaying || !item.drop()){
                item.remove();
                self.items.splice(i, 1);
            }

            if ((parseInt(item.$el.css('top'), 10) > (self.$el.height() - self.player.height))
                && self.collide(item)) {
                self.score.addScore(item.score);
                self.player.autoChangeState(true);
                item.remove();
                self.items.splice(i, 1);
            }
        });
        self.isPlaying && self.dropItems();
    });
};

Game.prototype.collide = function (item) {
    var modelOffset = this.player.$model.offset();
    var modelTop = modelOffset.top;
    var modelLeft = modelOffset.left;
    var modelWidth = this.player.$model.width();
    var modelHeight = this.player.$model.height();
    var itemOffset = item.$el.offset();
    var itemTop = itemOffset.top;
    var itemLeft = itemOffset.left;
    var itemWidth = item.width;
    var itemHeight = item.height;
    var modelTopCenter = modelTop - modelWidth / 2;
    var modelLeftCenter = modelLeft + modelWidth / 2;
    var itemTopCenter = itemTop - itemWidth / 2;
    var itemLeftCenter = itemLeft + itemWidth / 2;
    return !!(Math.abs(modelTopCenter - itemTopCenter) < (itemHeight + modelHeight)
        && Math.abs(modelLeftCenter - itemLeftCenter) < (itemWidth + modelWidth));
}

Game.prototype.preloadImage = function () {
    var imgList = [];
    for (var i in this.source.player.image) {
        imgList = this.source.player.image[i].state.concat(imgList);
    }
    for (var i = 0; i < this.source.items.length; i++) {
        imgList.push(this.source.items[i].image);
    }
    for (var i = 0; i < imgList.length; i++) {
        (function (i) {
            var img = new Image();
            console.log(imgList[i])
            img.src = imgList[i];
        })(i)
    }
};

module.exports = Game;
