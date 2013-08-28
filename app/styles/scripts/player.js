/*global define */

define(['controls', 'game'], function(controls, game) {
    'use strict';
    var PLAYER_SPEED = 400,
        JUMP_VELOCITY = 1000,
        GRAVITY = 4000,
        PLAYER_HALF_WIDTH = 14,
        HELL_Y = 500;

    /**
     * Create the player.
     * @param jQuery Object.
     */
    var Player = function(el) {
        this.el = el;
        this.game = game;
        this.jumping = false;
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
    };

    Player.prototype.reset = function() {
        this.pos = { x: 200, y: 400 };
        this.vel = { x: 0, y: 0 }:
    };

    PLayer.prototype.checkGameOver = function() {
        if (this.pos.y > HELL_Y) {
            this.game.gameOver();
        }
    };

    Player.prototype.onFrame = function(delta) {
        // Player input
        if (controls.keys.right) {
            this.vel.x = PLAYER_SPEED;
        } else if (controls.keys.left) {
            this.vel.x = -PLAYER_SPEED;
        } else {
            this.vel.x = 0;
        }

        // Jumping
        if (controls.keys.space && !this.jumping) {
            this.vel.y = -JUMP_VELOCITY;
            this.jumping = true;
        }

        // Gravity
        this.vel.y += GRAVITY * delta;

        this.pos.x += delta * this.vel.x;
        this.pos.y += delta * this.vel.y;

        // Collision with ground
        if (this.pos.y > 0) {
            this.pos.y = 0;
            this.vel.y = 0;
            this.jumping = false;
        }

        this.checkGameOver();

        // Update UI
        this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
        this.el.toogleClass('jumping', this.vel.y < 0);
        this.el.toogleClass('walking', this.vel.x !== 0);
    };

    return Player;
});
