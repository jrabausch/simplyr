(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
class Controls {
    constructor(root) {
        this.currentTarget = null;
        this.dragging = false;
        this.rangeElement = document.querySelector('input[type="range"]');
        this.timeElement = document.querySelector('.timeline .time');
        this.durationElement = document.querySelector('.timeline .duration');
        this.rangeElement.addEventListener('change', this.rangeChange.bind(this));
        this.rangeElement.addEventListener('input', this.rangeInput.bind(this));
        root.addEventListener('audio-loaded', this.onAudioLoaded.bind(this));
        root.addEventListener('time-update', this.onTimeUpdate.bind(this));
    }
    onAudioLoaded(e) {
        this.setDuration(e.detail.duration);
        this.currentTarget = e.target;
    }
    onTimeUpdate(e) {
        this.setCurrentTime(e.detail.currentTime);
    }
    rangeChange() {
        var _a;
        this.dragging = false;
        const position = parseInt(this.rangeElement.value, 10);
        (_a = this.currentTarget) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new events_1.TimeSeekEvent({ position }));
    }
    rangeInput() {
        this.dragging = true;
        const value = parseInt(this.rangeElement.value, 10);
        this.timeElement.innerHTML = this.timeString(value);
    }
    timeString(seconds) {
        const hour = Math.floor(seconds / 3600);
        const min = Math.floor((seconds - hour * 3600) / 60);
        const sec = Math.floor(seconds - hour * 3600 - min * 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    }
    setCurrentTime(time) {
        if (!this.dragging) {
            this.rangeElement.value = time.toString();
            this.timeElement.innerHTML = this.timeString(time);
        }
    }
    setDuration(duration) {
        this.rangeElement.max = duration.toString();
        this.durationElement.innerHTML = this.timeString(duration);
    }
}
exports.default = Controls;

},{"./events":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
class Player {
    constructor(root) {
        this.currentTarget = null;
        this.audio = new Audio();
        this.audio.preload = 'metadata';
        this.audio.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
        this.audio.addEventListener('ended', this.onEnded.bind(this));
        root.addEventListener('play-pause', this.onPlayPause.bind(this));
        root.addEventListener('time-seek', this.onTimeSeek.bind(this));
    }
    onPlayPause(e) {
        const target = e.target;
        if (target !== this.currentTarget) {
            this.pause();
            this.loadAudioSrc(e.detail.audio);
            this.currentTarget = target;
        }
        this.togglePlay();
    }
    onTimeSeek(e) {
        this.seek(e.detail.position);
    }
    onTimeUpdate(e) {
        var _a;
        (_a = this.currentTarget) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new events_1.TimeUpdateEvent({
            currentTime: this.audio.currentTime
        }));
    }
    onLoadedMetadata(e) {
        var _a;
        (_a = this.currentTarget) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new events_1.AudioLoadedEvent({
            duration: this.audio.duration
        }));
    }
    isPlaying() {
        return !this.audio.paused;
    }
    onEnded(e) {
        this.pause();
        this.audio.currentTime = 0;
    }
    togglePlay() {
        if (this.isPlaying()) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    loadAudioSrc(resource) {
        this.audio.src = resource;
        this.audio.load();
    }
    play() {
        var _a;
        this.audio.play();
        (_a = this.currentTarget) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new events_1.PlayingEvent());
    }
    pause() {
        var _a;
        this.audio.pause();
        (_a = this.currentTarget) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new events_1.PausedEvent());
    }
    seek(offset) {
        this.audio.currentTime = offset;
    }
    jump(delta) {
        this.audio.currentTime += delta;
    }
}
exports.default = Player;

},{"./events":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
class Track {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('click', this.onClick.bind(this));
        this.element.addEventListener('playing', this.onPlaying.bind(this));
        this.element.addEventListener('paused', this.onPaused.bind(this));
    }
    onClick(e) {
        const title = this.element.dataset.title || '';
        const sub = this.element.dataset.sub || '';
        const audio = this.element.dataset.audio || '';
        const event = new events_1.PlayPauseEvent({ title, sub, audio });
        this.element.blur();
        this.element.dispatchEvent(event);
    }
    onPlaying() {
        this.element.dataset.playing = 'true';
    }
    onPaused() {
        this.element.dataset.playing = 'false';
    }
}
exports.default = Track;

},{"./events":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSeekEvent = exports.TimeUpdateEvent = exports.AudioLoadedEvent = exports.PausedEvent = exports.PlayingEvent = exports.PlayPauseEvent = void 0;
class PlayPauseEvent extends CustomEvent {
    constructor(detail) {
        super('play-pause', {
            bubbles: true,
            detail
        });
    }
}
exports.PlayPauseEvent = PlayPauseEvent;
;
class PlayingEvent extends CustomEvent {
    constructor() {
        super('playing', {
            bubbles: false
        });
    }
}
exports.PlayingEvent = PlayingEvent;
;
class PausedEvent extends CustomEvent {
    constructor() {
        super('paused', {
            bubbles: false
        });
    }
}
exports.PausedEvent = PausedEvent;
;
class AudioLoadedEvent extends CustomEvent {
    constructor(detail) {
        super('audio-loaded', {
            bubbles: true,
            detail
        });
    }
}
exports.AudioLoadedEvent = AudioLoadedEvent;
;
class TimeUpdateEvent extends CustomEvent {
    constructor(detail) {
        super('time-update', {
            bubbles: true,
            detail
        });
    }
}
exports.TimeUpdateEvent = TimeUpdateEvent;
;
class TimeSeekEvent extends CustomEvent {
    constructor(detail) {
        super('time-seek', {
            bubbles: true,
            detail
        });
    }
}
exports.TimeSeekEvent = TimeSeekEvent;
;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controls_1 = require("./Controls");
const Player_1 = require("./Player");
const Track_1 = require("./Track");
window.Simplyr = {
    Player: Player_1.default,
    Track: Track_1.default,
    Controls: Controls_1.default
};

},{"./Controls":1,"./Player":2,"./Track":3}]},{},[5]);
