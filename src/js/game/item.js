var $ = require('jquery');
var Animation = require('./animation.js');

var Item = function (option) {
    this.source = option.source;
    var getRandomIndex = (function (items) {
        var weights = [0];
        var total = 0;
        for (var i = 0; i < items.length; i++) {
            total += items[i].weight;
            weights.push(total);
        }
        return function () {
            var rnd = Math.random() * total;
            for (var i = 1; i < weights.length; i++) {
                if(rnd > weights[i - 1] && rnd < weights[i]) {
                    return (i - 1);
                }
            }
        };
    })(this.source);
    var randomIndex = getRandomIndex();
    this.game = option.game;
    this.image = option.image || this.source[randomIndex].image;
    this.width = option.width || this.source[randomIndex].width;
    this.height = option.height || this.source[randomIndex].height;
    this.score = option.score || this.source[randomIndex].score;
    this.speed = Math.random() * (option.speed[1] - option.speed[0]) + option.speed[0];

    this.startX = option.startX || Math.random() * (this.game.$el.width() - this.width);
    this.startY = option.startY || -this.source[randomIndex].height;
    this.$el = $('<div class="item" data-item></div>').css({
        background: 'url(' + this.image + ')',
        left: this.startX + 'px',
        top: this.startY + 'px',
        width: this.width,
        height: this.height,
        position: 'absolute'
    });
    this.frameInterval = option.frameInterval;
    this.animation = this.source[randomIndex].map
        ? (new Animation()).changePosition(this.$el[0], this.source[randomIndex].map).repeat()
        : null;
};

Item.prototype.create = function () {
    this.$el.appendTo(this.game.$el);
    this.animation && this.animation.start(this.frameInterval);
};

Item.prototype.remove = function () {
    this.animation && this.animation.dispose();
    this.$el.remove();
}

Item.prototype.drop = function () {
    var top = parseInt(this.$el.css('top'), 10);
    if (top < this.game.$el.height()) {
        this.$el.css('top', top + this.speed);
        return true;
    }
    return false;
};

module.exports = Item;
