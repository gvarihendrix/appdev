/*global define, $ */

define(['player', 'platform', 'enemy'], function(Player, Platform, Enemy) {
    'use strict';
    var VIEWPORT_PADDING = 300,
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
        this.entities = [];
        this.platforms = [];
        this.visiblePLatforms = 15;
        this.elevation = 0;
        this.backgroundEl = el.find('.background');
        this.platformsEl = el.find('.platforms');
        this.worldEl = el.find('.world');
        this.entitiesEl = el.find('.entities');
        this.width = this.el.width();
        this.height = this.el.height();
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

        for (var i = 0, e; e = this.entities[i]; i++) {
            e.onFrame(delta);

            if (e.dead) {
                this.entities.splice(i--, 1);
            }
        }

        this.updateViewPort();
        // Request next frame.
        requestAnimFrame(this.onFrame);
    };

    Game.prototype.forEachPlatform = function(handler) {
        for (var i = 0, e; e = this.platforms[i]; i += 1) {
            if (e instanceof Platform) {
                handler(e);
            }
        }
    };

    Game.prototype.updateViewPort = function () {

        var min_y = this.viewport.y + VIEWPORT_PADDING,
            player_y = this.player.pos.y;

        if (player_y < min_y) {
            this.viewport.y = player_y -  VIEWPORT_PADDING;
            this.elevation += (player_y);

            this.morePLatforms();
        }

        this.worldEl.css({
            left: -this.viewport.x,
            top: -this.viewport.y
        });

        this.backgroundEl.css('transform', 'translate3d(' + this.viewport.x + 'px,' + this.viewport.y + 'px,0)');
    };


    Game.prototype.morePLatforms = function() {
        // TODO: need to implement a better algorithm
        this.addPlatform(new Platform({
            x: Math.random() * (this.width  + 300),
            y: Math.random() * -(this.height + (Math.random() * -this.viewport.y)),
            width: PLATFORM_WIDHT,
            height: 12
        }));
        /*
        var p = this.platforms.splice(1,1);
        p[0].el.remove();*/
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
        this.player.reset();
        this.entities.forEach(function(e) { e.el.remove(); });
        this.platforms.forEach(function(p) { p.el.remove(); });
        this.viewport = {x: 100, y: 0 , width: this.width, height: this.height };
        this.createWorld();
        this.unFreezeGame();
    };


    /**
     * Create the platforms that the game has to hold
     */
    Game.prototype.createWorld = function () {

        this.addPlatform(new Platform({
            x: 100,
            y: 418,
            width: 1000,
            height: 10
        }));
        // TODO: need to implement a better algorithm
        for (var i = 1; i < this.visiblePLatforms; i += 1) {
            this.addPlatform(new Platform({
                x: Math.random() * (this.viewport.width + 300),
                y: Math.random() * (this.viewport.height + 300),
                width: PLATFORM_WIDHT,
                height: 12
            }));
        }


        this.addEnemy(new Enemy({
            start: {x: 400, y: 350 },
            end: {x: 400, y: 200}
        }));
    };


    Game.prototype.addEnemy = function(enemy) {
        this.entities.push(enemy);
        this.entitiesEl.append(enemy.el);
    };

    Game.prototype.forEachEnemy = function(handler) {
        for (var i = 0, e; e = this.entities[i]; i += 1) {
            if (e instanceof Enemy) {
                handler(e);
            }
        }
    };

    Game.prototype.addPlatform = function(platform) {
        this.platforms.push(platform);
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