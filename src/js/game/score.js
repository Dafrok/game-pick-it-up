var $ = require('jquery');

var Score = function (option) {
    this.$el = option.$el;
    this.game = option.game;
    this.score = option.score || 0;
    this.source = option.source;
    this.setScore(0);
};

Score.prototype.setScore = function (score) {
    if (score < 0) {
        score = 0;
    }
    this.score = score;
    this.$el.text(score);
};

Score.prototype.addScore = function (score) {
    var strColor;
    var strScore;
    this.setScore(this.score + score);
    if (score >= 0) {
        strColor = this.source.score.color.add;
        strScore = '+' + score;
    } else {
        strColor = this.source.score.color.decrease;
        strScore = score.toString();
    }

    var $addScore = $('<div></div>');
    $addScore.css({
        'position': 'fixed',
        'bottom': this.source.player.height,
        'left': this.game.player.$el.offset().left + this.source.player.width / 2,
        'transition': 'opacity '
            + this.source.score.duration +'s, bottom '
            + this.source.score.duration +'s, transform '
            + this.source.score.duration + 's',
        'font-size': this.source.score.size,
        'transform': 'translate(0,0)',
        'color': strColor
    })
    .text(strScore);

    $addScore.appendTo(this.game.$el);

    setTimeout(function () {
        $addScore.css({
            transform: 'translate(0,-' + this.source.score.flyHeight + 'px)',
            opacity: '0'
        });
    }.bind(this), 0);

    setTimeout(function () {
        $addScore.remove();
    }, this.source.score.duration * 1000);
}

module.exports = Score;
