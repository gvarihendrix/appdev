/*global define */

define(['controls'], function(controls) {
    'use strict';
    var PLAYER_SPEED = 400,
        JUMP_VELOCITY = 1500,
        GRAVITY = 4000,
        PLAYER_HALF_WIDTH = 20,
        PLAYER_RADIUS = 40,
        HELL_Y = 500;

    /**
     * Create the player.
     * @param jQuery Object.
     */
    var Player = function(el, game) {
        this.el = el;
        this.game = game;
        this.pos = { x: 200, y: 400 };
        this.vel = { x: 0, y: 0 };
        this.isMovingLeft = false;
        this.isMovingRight = true;
        this.width = this.el.width();
        this.height = this.el.height();
    };

    Player.prototype.reset = function() {
        this.pos = { x: 200, y: 400 };
        this.vel = { x: 0, y: 0 };
        this.isMovingLeft = false;
        this.isMovingRight = true;
    };

    Player.prototype.checkGameOver = function() {
        if (this.pos.y > this.game.viewport.y + this.game.height + 20) {
            this.game.gameOver();
        }
    };


    Player.prototype.checkOutOfBounds = function() {
        if (this.pos.x > this.game.width + this.width) {
            this.pos.x = this.width;
        } else if (this.pos.x < (140 - this.width)) {
            this.pos.x = this.game.width + this.width;
        }
    };

    Player.prototype.checkPlatforms = function(oldY) {
        var that = this;

        this.game.forEachPlatform(function (plat) {
            // Are we crossing Y.
            if (plat.rect.y >= oldY && plat.rect.y < that.pos.y) {

                // Are we inside X bounds.
                if (that.pos.x + PLAYER_HALF_WIDTH >= plat.rect.x  &&
                    that.pos.x - PLAYER_HALF_WIDTH <= plat.rect.right) {
                    // COLLISION. Lets stop gravitiy.
                    that.pos.y = plat.rect.y;
                    that.vel.y = 0;
                }
            }
        });
    };

    Player.prototype.checkEnemies = function() {
        var centerX = this.pos.x;
        var centerY = this.pos.y - (PLAYER_RADIUS*2);
        var that = this;
        this.game.forEachEnemy(function(enemy) {
            // Distance squared
            var distanceX = enemy.pos.x - centerX;
            var distanceY = enemy.pos.y - centerY;

            // Minimum distance squared
            var distanceSq = distanceX * distanceX + distanceY * distanceY;
            var minDistanceSq = (enemy.radius + PLAYER_RADIUS) * (enemy.radius + PLAYER_RADIUS);

            // What up?
            if (distanceSq < minDistanceSq) {
                that.game.gameOver();
            }
        });
    };

    Player.prototype.onFrame = function(delta) {
        // Player input
        if (controls.keys.right) {
            this.vel.x = PLAYER_SPEED;
            this.isMovingRight = true;
            this.isMovingLeft = false;
        } else if (controls.keys.left) {
            this.vel.x = -PLAYER_SPEED;
            this.isMovingRight = false;
            this.isMovingLeft = true;
        } else {
            this.vel.x = 0;
        }

        // Jumping
        if (this.vel.y === 0) {
            this.vel.y = -JUMP_VELOCITY;
        }

        // Gravity
        this.vel.y += GRAVITY * delta;

        var oldY = this.pos.y;

        this.pos.x += delta * this.vel.x;
        this.pos.y += delta * this.vel.y;

        this.checkPlatforms(oldY);
        this.checkEnemies();
        this.checkGameOver();
        this.checkOutOfBounds();

        // Update UI
        this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
        this.el.toggleClass('jumping', this.vel.y < 0);
        this.el.toggleClass('walking', this.vel.x !== 0);
        this.el.toggleClass('right', this.isMovingRight);
        this.el.toggleClass('left', this.isMovingLeft);
    };

    return Player;
});
