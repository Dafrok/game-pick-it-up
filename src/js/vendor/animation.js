/* eslint-disable */
/**
 * @file 动画组件
 * @author 黄轶
 */

var Timeline = require('./timeline.js');
var loadImage = require('./imageloader.js');

var STATE_UNINITED = 0;
var STATE_INITED = 1;
var STATE_STOP = 2;

var TIMELINE = 1;

function next(callback) {
    callback && callback();
}

function Animation() {
    this.taskQueue = [];
    this.timeline = new Timeline();
    this.state = STATE_UNINITED;
    this.index = 0;
}

Animation.prototype = {
    loadImage: function (imglist) {

        return this._add(function (success) {
            // load srcs
            loadImage(imglist.slice(), success);
            imglist = null;
        });
    },
    changePosition: function (ele, positions) {
        var len = positions.length;
        var index = 0;
        var last = false;
        var me = this;
        return this._add(len ? function (success, time) {
            var position;
            index = (time / me.interval) | 0;
            last = index >= len - 1;
            index = Math.min(index, len - 1);
            // change posistions
            position = positions[index].split(' ');
            ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
            if (last) {
                success();
                return;
            }
        } : next, TIMELINE);
    },
    changeSrc: function (ele, imglist) {
        var len = imglist.length;
        var index = 0;
        var last = false;
        var me = this;
        return this._add(len ? function (success, time) {
            index = (time / me.interval) | 0;
            last = index >= len - 1;
            index = Math.min(index, len - 1);
            // change src
            ele.src = imglist[index];
            if (last) {
                success();
                return;
            }
        } : next, TIMELINE);
    },
    then: function (callback) {
        return this._add(function (success) {
            callback();
            success();
        });
    },
    enterFrame: function (callback) {
        return this._add(callback, TIMELINE);
    },
    repeat: function (times) {
        var me = this;
        return this._add(function () {
            var queue;
            if (times) {
                if (!--times) {
                    queue = me.taskQueue[me.index];
                    me.index++;
                    queue.wait ? setTimeout(function () {
                        me._next();
                    }, queue.wait) : me._next();
                } else {
                    me.index--;
                    me._next();
                }
            } else {
                me.index--;
                me._next();
            }

        });
    },
    repeatForever: function () {
        return this.repeat();
    },
    start: function (interval) {
        var queue;
        if (this.state === STATE_INITED) {
            return this;
        }
        this.state = STATE_INITED;
        queue = this.taskQueue;
        var len = queue.length;
        if (!len) {
            return this;
        }
        this.interval = interval;
        this._next();
        return this;

    },
    pause: function () {
        this.state = STATE_STOP;
        this.timeline.stop();
        return this;
    },
    wait: function (time) {
        if (this.taskQueue && this.taskQueue.length > 0) {
            this.taskQueue[this.taskQueue.length - 1].wait = time;
        }
        return this;
    },
    dispose: function () {
        this.taskQueue = null;
        this.timeline && this.timeline.stop();
        this.timeline = null;
        this.state = STATE_UNINITED;
    },
    _add: function (task, type) {
        this.taskQueue.push({
            task: task,
            type: type
        });
        return this;
    },
    _next: function () {
        var queue;
        if (!this.taskQueue || this.state == STATE_STOP)
            return;
        if (this.index == this.taskQueue.length) {
            this.dispose();
            return;
        }
        queue = this.taskQueue[this.index];
        if (queue.type == TIMELINE) {
            this._enterframe(queue.task);
        } else {
            this._excuteTask(queue.task);
        }
    },
    _excuteTask: function (task) {
        var me = this;
        task(function () {
            var queue;
            if (!me.taskQueue)
                return;
            queue = me.taskQueue[me.index];
            me.index++;
            queue.wait ? setTimeout(function () {
                me._next();
            }, queue.wait) : me._next();

        });
    },
    _enterframe: function (task) {
        var me = this;

        this.timeline.onenterframe = enter;
        this.timeline.start(this.interval);

        function enter(time) {
            task(function () {
                var queue;
                if (!me.taskQueue)
                    return;
                queue = me.taskQueue[me.index];
                me.timeline.stop();
                me.index++;
                queue.wait ? setTimeout(function () {
                    me._next();
                }, queue.wait) : me._next();
            }, time);
        }
    },
    constructor: Animation
}

module.exports = Animation;