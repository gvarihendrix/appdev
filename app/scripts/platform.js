define([], function() {
    'use strict';

    var WIDHT = 80,
        HEIGHT = 20,
        HEIGHT_OF_GAME = $('.game').height(),
        WIDTH_OF_GAME = $('.game').width(),
        image = $('#platform')[0],
        PLATFORM_COUNT = 10,
        position = 0,
        attrib = {
            fixed: 0,
            moving: 1,
            broken: 2
        };
    /**
     * Constructor for the platforms in the game
     */
    var Platform = function () {
        this.vec = { x: 0, y: 0 };
        this.widht = WIDHT;
        this.height = HEIGHT;

        this.vec.x = Math.random() * (WIDTH_OF_GAME - this.widht);
        this.vec.y = position;

        position += (HEIGHT_OF_GAME / PLATFORM_COUNT);

        $('.game').append(image);
    };

    Platform.prototype.platformCount = function () {
        return PLATFORM_COUNT;
    };

    return Platform;
});