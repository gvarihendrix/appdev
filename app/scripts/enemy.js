
define(function() {

    var FloatingEnemy = function(options) {
        this.el = $('<div class="enemy"></div>');

        this.pos = {};
        this.radius = 20;
        this.start = options.start;
        this.end = options.end;
        this.duration = options.duration || 5;
        this.current = 0;
    };

    FloatingEnemy.prototype.onFrame = function(delta) {
        this.current = (this.current + delta) % this.duration;

        var relPosition = Math.sin((Math.PI * 3) * (this.current / this.duration)) / 0.8 + 0.9;

        this.pos.x = this.start.x + (this.end.x - this.start.x) * relPosition;
        this.pos.y = this.start.y + (this.end.y - this.start.y) * relPosition;

        this.el.css('transform', 'translate3d(' +
            this.pos.x + 'px,' + this.pos.y + 'px,0)');
    };

  return FloatingEnemy;
});