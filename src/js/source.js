/**
 * @file game source
 */

// 测试
var __uri = function (arg) {
    return arg
};
// 测试

module.exports = {
    player: {
        width: 153,
        height: 165,
        speed: 12,
        image: {
            left: {
                name: 'left',
                map: ['0 0', '0 165', '0 330', '0 495'],
                state: [
                    __uri('resource/image/player-left-0.png'),
                    __uri('resource/image/player-left-1.png'),
                    __uri('resource/image/player-left-2.png'),
                    __uri('resource/image/player-left-3.png'),
                    __uri('resource/image/player-left-4.png')
                ]
            },
            right: {
                name:'right',
                map: ['0 0', '0 165', '0 330', '0 495'],
                state: [
                    __uri('resource/image/player-right-0.png'),
                    __uri('resource/image/player-right-1.png'),
                    __uri('resource/image/player-right-2.png'),
                    __uri('resource/image/player-right-3.png'),
                    __uri('resource/image/player-right-4.png')
                ]
            },
            stopLeft: {
                default:true,
                name: 'stop-left',
                state: [
                    __uri('resource/image/player-left-0.png'),
                    __uri('resource/image/player-left-1.png'),
                    __uri('resource/image/player-left-2.png'),
                    __uri('resource/image/player-left-3.png'),
                    __uri('resource/image/player-left-4.png')
                ]
            },
            stopRight: {
                name: 'stop-right',
                state: [
                    __uri('resource/image/player-right-0.png'),
                    __uri('resource/image/player-right-1.png'),
                    __uri('resource/image/player-right-2.png'),
                    __uri('resource/image/player-right-3.png'),
                    __uri('resource/image/player-right-4.png')
                ]
            },
            stop: {
                name: 'stop',
                state: []
            }
        }
    },
    items: [
        {
            name: '糖果',
            score: 500,
            image: __uri('resource/image/candy.png'),
            weight: 1000,
            width: 70,
            height: 70
        },
        {
            name: '小南瓜1',
            score: 800,
            image: __uri('resource/image/pumpkin-s1.png'),
            weight: 800,
            width: 54,
            height: 54
        },
        {
            name: '小南瓜2',
            score: 800,
            image: __uri('resource/image/pumpkin-s2.png'),
            weight: 800,
            width: 54,
            height: 54
        },
        {
            name: '大南瓜',
            score: 1000,
            image: __uri('resource/image/pumpkin-b.png'),
            weight: 500,
            width: 73,
            height: 80
        },
        {
            name: '幽灵',
            score: -300,
            image: __uri('resource/image/ghost.png'),
            weight: 300,
            width: 70,
            height: 70,
            map: ['0 70', '0 140', '0 210', '0 280', '0 350']
        }
    ],
    score: {
        color: {
            add: 'yellow',
            decrease: 'red'
        },
        size: 28,
        duration: 2,
        flyHeight: 150
    }
};
