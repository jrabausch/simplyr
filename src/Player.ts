import Controls from './Controls';
import PlayPauseEvent from './PlayPauseEvent';

class Player {

	protected audioElement: HTMLAudioElement;
	protected currentTarget: EventTarget | null = null;
	protected controls: Controls;

	constructor() {

		this.audioElement = document.createElement('audio');
		this.audioElement.preload = 'metadata';
		this.audioElement.addEventListener('timeupdate', this.onTimeupdate.bind(this));
		this.audioElement.addEventListener('loadedmetadata', this.onLoadedmetadata.bind(this));
		this.audioElement.addEventListener('ended', this.onEnded.bind(this));

		document.documentElement.addEventListener(PlayPauseEvent.type, this.onPlayPause.bind(this), true);

		this.controls = new Controls(this);
	}

	protected onPlayPause(e: Event) {

		const event = e as PlayPauseEvent;
		const target = event.target;

		if (this.currentTarget !== target) {

			const audio = event.detail.audio;

			this.loadAudio(audio);

			this.currentTarget = target;
		}

		this.togglePlay();
	}

	protected onTimeupdate(e: Event) {
		this.controls.setCurrentTime(this.audioElement.currentTime);
	}

	protected onLoadedmetadata(e: Event) { 
		console.log(e);
		this.controls.setCurrentTime(0);
		this.controls.setDuration(this.audioElement.duration);
	}

	protected isPlaying(): boolean {
		return !this.audioElement.paused;
	}

	protected onEnded(e: Event) {
		this.pause();
		this.audioElement.currentTime = 0;
	}

	protected togglePlay() {
		if (this.isPlaying()) {
			this.pause();
		}
		else {
			this.play();
		}
	}

	protected loadAudio(resource: string) {
		this.pause();
		this.audioElement.src = resource;
		this.audioElement.load();
	}

	protected setTargetPlaying(flag: boolean) {
		if (this.currentTarget) {
			(this.currentTarget as HTMLElement).dataset.playing = (flag ? 'true' : 'false');
		}
	}

	play() {
		this.audioElement.play();
		this.setTargetPlaying(true);
	}

	pause() {
		this.audioElement.pause();
		this.setTargetPlaying(false);
	}

	jumpTo(offset: number) {
		this.audioElement.currentTime = offset;
	}

	seek(delta: number) {
		this.audioElement.currentTime += delta;
	}
}

export default Player;
