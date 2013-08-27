/*global define, $ */

define(['player', 'platform'], function(Player, Platform) {
    'use strict';

    var platforms = [],
        platform_count = 10;
  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
    var Game = function(el) {
        this.el = el;
        this.player = new Player(this.el.find('.player'));

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
    };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
    Game.prototype.onFrame = function() {
        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        this.player.onFrame(delta);

        // Request next frame.
        requestAnimFrame(this.onFrame);
    };

  /**
   * Starts the game.
   */
    Game.prototype.start = function() {
        // Restart the onFrame loop
        this.lastFrame = +new Date() / 1000;
        requestAnimFrame(this.onFrame);
    };


    Game.prototype.initPlatform = function () {
        var i;
        for (i = 0; i < platform_count; i += 1) {
            platforms.push(new Platform());
        }
    };

  /**
   * Cross browser RequestAnimationFrame
   */
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    return Game;
});