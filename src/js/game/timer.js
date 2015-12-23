var Timer = function (option) {
    this.timeLimit = option.timeLimit;
    this.time = option.timeLimit;
    this.$el = option.$el;
    this.interval = null;
    this.onEnd = option.onEnd;
    this.setTime(this.time);
};

Timer.prototype.start = function (callback) {
    this.reset();
    this.interval = setInterval(function () {
        this.time -= 1;
        this.setTime(this.time);
        if (this.time <= 0) {
            this.clear();
            callback && callback();
            this.onEnd();
        }
    }.bind(this), 1000);
};

Timer.prototype.clear = function () {
    clearInterval(this.interval);
    this.setTime(0);
};

Timer.prototype.reset = function () {
    clearInterval(this.interval);
    this.setTime(this.timeLimit);
};

Timer.prototype.setTime = function (time) {
    this.time = time;
    this.$el.text(time);
};

module.exports = Timer;
