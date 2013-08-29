/*global define, $ */

define(['player', 'platform'], function(Player, Platform) {
    'use strict';
    var VIEWPORT_PADDING = 100,
        GAME_WIDTH = 1100,
        PLATFORM_WIDHT = 80,
        POSITION = 418;
    /**
    * Main game class.
    * @param {Element} el DOM element containig the game.
    * @constructor
    */
    var Game = function(el) {
        this.el = el;
        this.player = new Player(this.el.find('.player'), this);
        this.platformsEl = el.find('.platforms');
        this.worldEl = el.find('.world');
        this.isPlaying = false;
        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
    };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
    Game.prototype.onFrame = function() {
        if (!this.isPlaying) {
            return;
        }

        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        this.player.onFrame(delta);

        this.updateViewPort();
        // Request next frame.
        requestAnimFrame(this.onFrame);
    };

    Game.prototype.updateViewPort = function () {
        var min_x = this.viewport.x + VIEWPORT_PADDING,
            max_x = this.viewport.x + this.viewport.width - VIEWPORT_PADDING,
            player_x = this.player.pos.x;


        // Update viewport if needed
        if (player_x < min_x) {
            this.viewport.x = player_x - VIEWPORT_PADDING;
            this.gameOver();
        } else if(player_x > max_x) {
            this.viewport.x = player_x - this.viewport.width + VIEWPORT_PADDING;
        }

        this.worldEl.css({
            left: -this.viewport.x,
            top: -this.viewport.y
        });
    };

    Game.prototype.freezeGame = function () {
        this.isPlaying = false;
    };


    Game.prototype.gameOver = function () {
        this.freezeGame();
        alert('You are game over! Sorry man....');
        var game = this;

        setTimeout(function () {
            game.start();
        }, 0);
    };

    /**
     * Freezez the game when gameover.
     */
    Game.prototype.unFreezeGame = function () {
        if (!this.isPlaying) {
            this.isPlaying = true;

            this.lastFrame = +new Date() / 1000;
            requestAnimFrame(this.onFrame);
        }
    };

  /**
   * Starts the game.
   */
    Game.prototype.start = function() {
        // Restart the onFrame loop
        this.platforms = [];
        this.createPlatforms();
        this.player.reset();
        this.viewport = {x: 100, y: 150, width: 500, height: 400};

        this.unFreezeGame();
    };


    Game.prototype.createPlatforms = function () {
        this.addPlatform(new Platform({
            x: 100,
            y: 418,
            width: 1000,
            height: 10
        }));

        for (var i = 0; i < 10; i += 1) {
            this.addPlatform(new Platform({
                x: Math.random() * (GAME_WIDTH - PLATFORM_WIDHT),
                y: -(this.viewport.y + VIEWPORT_PADDING),
                width: PLATFORM_WIDHT,
                height: 12
            }));
        }
    };


    Game.prototype.addPlatform = function(platform) {
        this.platform.push(platform);
        this.platformsEl.append(platform.el);
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