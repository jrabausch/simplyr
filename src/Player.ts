import { AudioLoadedEvent, PlayingEvent, PausedEvent, PlayPauseEvent, TimeUpdateEvent, TimeSeekEvent } from './events';

class Player {

	protected audio: HTMLAudioElement;
	protected currentTarget: EventTarget | null = null;

	constructor(root: EventTarget) {

		this.audio = new Audio();
		this.audio.preload = 'metadata';

		this.audio.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
		this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
		this.audio.addEventListener('ended', this.onEnded.bind(this));

		root.addEventListener('play-pause', this.onPlayPause.bind(this));
		root.addEventListener('time-seek', this.onTimeSeek.bind(this));
	}

	protected onPlayPause(e: Event) {

		const target = e.target;

		if (target !== this.currentTarget) {

			this.pause();
			const audio = (e as PlayPauseEvent).detail.audio;
			audio && this.load(audio);
			this.currentTarget = target;
		}

		this.togglePlay();
	}

	protected onTimeSeek(e: Event) {
		this.seek((e as TimeSeekEvent).detail.position);
	}

	protected onTimeUpdate(e: Event) {
		this.currentTarget?.dispatchEvent(new TimeUpdateEvent({
			currentTime: this.audio.currentTime
		}));
	}

	protected onLoadedMetadata(e: Event) {
		this.currentTarget?.dispatchEvent(new AudioLoadedEvent({
			duration: this.audio.duration
		}));
	}

	protected isPlaying(): boolean {
		return !this.audio.paused;
	}

	protected onEnded(e: Event) {
		this.pause();
		this.audio.currentTime = 0;
	}

	protected togglePlay() {
		if (this.isPlaying()) {
			this.pause();
		}
		else {
			this.play();
		}
	}

	protected load(src: string) {
		this.audio.src = src;
		this.audio.load();
	}

	protected play() {
		this.audio.play();
		this.currentTarget?.dispatchEvent(new PlayingEvent());
	}

	protected pause() {
		this.audio.pause();
		this.currentTarget?.dispatchEvent(new PausedEvent())
	}

	protected seek(offset: number) {
		this.audio.currentTime = offset;
	}

	protected jump(delta: number) {
		this.audio.currentTime += delta;
	}
}

export default Player;
