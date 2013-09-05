/*global define, $ */

define(['player', 'platform', 'enemy', 'controls'], function(Player, Platform, Enemy, Controls) {
    'use strict';
    var VIEWPORT_PADDING = 100,
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
        this.controls = Controls;
        this.entities = [];
        this.platforms = [];
        this.visiblePLatforms = 20;
        this.elevation = 0;
        this.score = 0;
        this.backgroundEl = el.find('.background');
        this.platformsEl = el.find('.platforms');
        this.worldEl = el.find('.world');
        this.entitiesEl = el.find('.entities');
        this.scoreEl = el.find('#score');
        this.width = this.el.width();
        this.height = this.el.height();
        this.isPlaying = false;
        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
        console.log(this.el);
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

        this.controls.onFrame(delta);
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
                handler(e, i);
            }
        }
    };

    Game.prototype.updateViewPort = function () {

        var min_y = this.viewport.y + VIEWPORT_PADDING,
            player_y = this.player.pos.y;

        if (player_y < min_y) {
            this.viewport.y = player_y -  VIEWPORT_PADDING;
            this.morePlatforms(this.viewport.y);
            this.updateScore();
        }

        this.worldEl.css({
            left: -this.viewport.x,
            top: -this.viewport.y
        });
        this.backgroundEl.css('transform', 'translate3d(' + this.viewport.x + 'px,' + this.viewport.y + 'px,0)');
    };

    Game.prototype.updateScore = function() {
        this.score++;
        this.scoreEl.html('Score: ' + this.score + '!');
    };

    Game.prototype.morePlatforms = function(viewport_y) {
        var that = this;
        this.forEachPlatform(function(p, i) {
            if (p.rect.y > viewport_y + (that.height + 100)) {
                p.rect.y = viewport_y - 10;
                p.rect.x = Math.random() * (that.width);
                p.rect.width = PLATFORM_WIDHT;
                p.rect.height = p.rect.height;
                p.rect.right = p.rect.x + p.rect.width;
                p.el.remove();

                p.el.css({
                    left: p.rect.x,
                    top: p.rect.y,
                    width: PLATFORM_WIDHT,
                    height: p.rect.height
                });

                that.platforms[i] = p;
                that.platformsEl.append(p.el);
            }
        });
    };

    Game.prototype.freezeGame = function () {
        this.isPlaying = false;
    };


    Game.prototype.gameOver = function () {
        this.freezeGame();
        this.showGameOverMenu();

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
        this.hideMenu();
        this.hideGameOverMenu();


        this.score = 0;
        this.scoreEl.html('Score: 0');
        this.player.reset();
        this.entities.forEach(function(e) { e.el.remove(); });
        this.platforms.forEach(function(p) { p.el.remove(); });
        this.platforms = [];
        this.entities = [];
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
            width: 1500,
            height: 10
        }));


        // TODO: need to implement a better algorithm
        for (var i = 0; i < this.visiblePLatforms; i += 1) {
            this.addPlatform(new Platform({
                x: Math.random() * (this.viewport.width) + 100,
                y: ((Math.random()) * (this.viewport.height - 1)) - 100,
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


    Game.prototype.hideMenu  = function() {
        var menu = document.getElementById('mainMenu');
        console.log(menu);
        menu.style.zIndex = '-1';
        menu.style.visibility = 'hidden';
    }

    Game.prototype.showGameOverMenu = function() {
        var menu = document.getElementById('gameOverMenu');
        menu.style.zIndex = '1';
        menu.style.visibility = 'visible';

        var scoreText = document.getElementById('yourScore');
        scoreText.innerHTML = 'You scored ' + this.score + ' points!';
    }

    Game.prototype.hideGameOverMenu = function() {
        var men = document.getElementById('gameOverMenu');
        men.style.zIndex = '-1';
        men.style.visibility = 'hidden';
    }

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