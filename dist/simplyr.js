(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controls = /** @class */ (function () {
    function Controls(player) {
        this.dragging = false;
        this.player = player;
        this.rangeElement = document.querySelector('input[type="range"]');
        this.timeElement = document.querySelector('.timeline .time');
        this.durationElement = document.querySelector('.timeline .duration');
        this.rangeElement.addEventListener('change', this.rangeChange.bind(this));
        this.rangeElement.addEventListener('input', this.rangeInput.bind(this));
    }
    Controls.prototype.rangeChange = function () {
        this.dragging = false;
        var value = parseInt(this.rangeElement.value, 10);
        this.player.jumpTo(value);
    };
    Controls.prototype.rangeInput = function () {
        this.dragging = true;
        var value = parseInt(this.rangeElement.value, 10);
        this.timeElement.innerHTML = this.htmlTime(value);
    };
    Controls.prototype.htmlTime = function (seconds) {
        var hour = Math.floor(seconds / 3600);
        var min = Math.floor((seconds - hour * 3600) / 60);
        var sec = Math.floor(seconds - hour * 3600 - min * 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    };
    Controls.prototype.setCurrentTime = function (time) {
        if (!this.dragging) {
            this.rangeElement.value = time.toString();
            this.timeElement.innerHTML = this.htmlTime(time);
        }
    };
    Controls.prototype.setDuration = function (duration) {
        this.rangeElement.max = duration.toString();
        this.durationElement.innerHTML = this.htmlTime(duration);
    };
    return Controls;
}());
exports.default = Controls;

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PlayPauseEvent = /** @class */ (function (_super) {
    __extends(PlayPauseEvent, _super);
    function PlayPauseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayPauseEvent.create = function (title, sub, audio) {
        return new CustomEvent(PlayPauseEvent.type, {
            detail: {
                title: title,
                sub: sub,
                audio: audio
            }
        });
    };
    PlayPauseEvent.type = 'play-pause';
    return PlayPauseEvent;
}(CustomEvent));
exports.default = PlayPauseEvent;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controls_1 = require("./Controls");
var PlayPauseEvent_1 = require("./PlayPauseEvent");
var Player = /** @class */ (function () {
    function Player() {
        this.currentTarget = null;
        this.audioElement = document.createElement('audio');
        this.audioElement.preload = 'metadata';
        this.audioElement.addEventListener('timeupdate', this.onTimeupdate.bind(this));
        this.audioElement.addEventListener('loadedmetadata', this.onLoadedmetadata.bind(this));
        this.audioElement.addEventListener('ended', this.onEnded.bind(this));
        document.documentElement.addEventListener(PlayPauseEvent_1.default.type, this.onPlayPause.bind(this), true);
        this.controls = new Controls_1.default(this);
    }
    Player.prototype.onPlayPause = function (e) {
        var event = e;
        var target = event.target;
        if (this.currentTarget !== target) {
            var audio = event.detail.audio;
            this.loadAudio(audio);
            this.currentTarget = target;
        }
        this.togglePlay();
    };
    Player.prototype.onTimeupdate = function (e) {
        this.controls.setCurrentTime(this.audioElement.currentTime);
    };
    Player.prototype.onLoadedmetadata = function (e) {
        this.controls.setCurrentTime(0);
        this.controls.setDuration(this.audioElement.duration);
    };
    Player.prototype.isPlaying = function () {
        return !this.audioElement.paused;
    };
    Player.prototype.onEnded = function (e) {
        this.pause();
        this.audioElement.currentTime = 0;
    };
    Player.prototype.togglePlay = function () {
        if (this.isPlaying()) {
            this.pause();
        }
        else {
            this.play();
        }
    };
    Player.prototype.loadAudio = function (resource) {
        this.pause();
        this.audioElement.src = resource;
        this.audioElement.load();
    };
    Player.prototype.setTargetPlaying = function (flag) {
        if (this.currentTarget) {
            this.currentTarget.dataset.playing = (flag ? 'true' : 'false');
        }
    };
    Player.prototype.play = function () {
        this.audioElement.play();
        this.setTargetPlaying(true);
    };
    Player.prototype.pause = function () {
        this.audioElement.pause();
        this.setTargetPlaying(false);
    };
    Player.prototype.jumpTo = function (offset) {
        this.audioElement.currentTime = offset;
    };
    Player.prototype.seek = function (delta) {
        this.audioElement.currentTime += delta;
    };
    return Player;
}());
exports.default = Player;

},{"./Controls":1,"./PlayPauseEvent":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayPauseEvent_1 = require("./PlayPauseEvent");
var Track = /** @class */ (function () {
    function Track(element) {
        this.element = element;
        this.element.addEventListener('click', this.onClick.bind(this));
    }
    Track.prototype.onClick = function (e) {
        var title = this.element.dataset.title || '';
        var sub = this.element.dataset.sub || '';
        var audio = this.element.dataset.audio || '';
        var event = PlayPauseEvent_1.default.create(title, sub, audio);
        this.element.blur();
        this.element.dispatchEvent(event);
    };
    return Track;
}());
exports.default = Track;

},{"./PlayPauseEvent":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrack = exports.createPlayer = void 0;
var Player_1 = require("./Player");
var Track_1 = require("./Track");
var createPlayer = function () {
    return new Player_1.default();
};
exports.createPlayer = createPlayer;
var createTrack = function (element) {
    return new Track_1.default(element);
};
exports.createTrack = createTrack;
(function () {
    var player = (0, exports.createPlayer)();
    document.querySelectorAll('.playpause').forEach(function (el) {
        (0, exports.createTrack)(el);
    });
})();

},{"./Player":3,"./Track":4}]},{},[5]);
