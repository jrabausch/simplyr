import { PlayPauseEvent } from './events';

class PlayPause {

	protected element: HTMLElement;
	protected currentTarget: EventTarget | null = null;

	constructor(root: EventTarget, element: HTMLElement) {

		this.element = element;
		this.element.addEventListener('click', this.onClick.bind(this));

		root.addEventListener('audio-loaded', this.onAudioLoaded.bind(this));
		root.addEventListener('playing', this.onPlaying.bind(this));
		root.addEventListener('paused', this.onPaused.bind(this));
	}

	protected onClick(e: MouseEvent) {
		this.currentTarget?.dispatchEvent(new PlayPauseEvent({}));
	}

	protected onAudioLoaded(e: Event) {
		this.currentTarget = e.target;
	}

	protected onPlaying() {
		this.element.dataset.playing = 'true';
	}

	protected onPaused() {
		this.element.dataset.playing = 'false';
	}
}

export default PlayPause;