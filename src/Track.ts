import { PlayPauseEvent } from './events';

class Track {

	protected element: HTMLElement;

	constructor(element: HTMLElement) {

		this.element = element;
		this.element.addEventListener('click', this.onClick.bind(this));
		this.element.addEventListener('playing', this.onPlaying.bind(this));
		this.element.addEventListener('paused', this.onPaused.bind(this));
	}

	protected onClick(e: MouseEvent) {

		const title = this.element.dataset.title || '';
		const sub = this.element.dataset.sub || '';
		const audio = this.element.dataset.audio || '';

		const event = new PlayPauseEvent({ title, sub, audio });

		this.element.blur();
		this.element.dispatchEvent(event);
	}

	protected onPlaying() {
		this.element.dataset.playing = 'true';
	}

	protected onPaused() {
		this.element.dataset.playing = 'false';
	}
}

export default Track;