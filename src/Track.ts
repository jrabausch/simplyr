import PlayPauseEvent from './PlayPauseEvent';

class Track {

	protected element: HTMLElement;

	constructor(element: HTMLElement) {

		this.element = element;
		this.element.addEventListener('click', this.onClick.bind(this));
	}

	protected onClick(e: MouseEvent) {

		const title = this.element.dataset.title || '';
		const sub = this.element.dataset.sub || '';
		const audio = this.element.dataset.audio || '';

		const event = PlayPauseEvent.create(title, sub, audio);

		this.element.blur();
		this.element.dispatchEvent(event);
	}
}

export default Track;