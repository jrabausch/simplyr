import { AudioLoadedEvent, TimeSeekEvent, TimeUpdateEvent } from './events';

class Controls {

	protected currentTarget: EventTarget | null = null;
	protected rangeElement: HTMLInputElement;
	protected timeElement: HTMLElement;
	protected durationElement: HTMLElement;
	protected dragging: boolean = false;

	constructor(root: EventTarget) {

		this.rangeElement = document.createElement('input') as HTMLInputElement;
		this.rangeElement.type = 'range';
		this.rangeElement.min = '0';
		this.rangeElement.max = '0';
		this.rangeElement.step = '1';

		this.timeElement = document.createElement('div');
		this.timeElement.className = 'time';
		this.timeElement.innerHTML = '0:00';

		this.durationElement = document.createElement('div');
		this.durationElement.className = 'duration';
		this.durationElement.innerHTML = '0:00';

		this.rangeElement.addEventListener('change', this.rangeChange.bind(this));
		this.rangeElement.addEventListener('input', this.rangeInput.bind(this));

		root.addEventListener('audio-loaded', this.onAudioLoaded.bind(this));
		root.addEventListener('time-update', this.onTimeUpdate.bind(this));
	}

	getHtml(): DocumentFragment {
		const fragment = new DocumentFragment();
		fragment.appendChild(this.timeElement);
		const track = document.createElement('div');
		track.className = 'track';
		track.appendChild(this.rangeElement);
		fragment.appendChild(track);
		fragment.appendChild(this.durationElement);
		return fragment;
	}

	protected onAudioLoaded(e: Event) {
		this.setCurrentTime(0);
		this.setDuration((e as AudioLoadedEvent).detail.duration);
		this.currentTarget = e.target;
	}

	protected onTimeUpdate(e: Event) {
		this.setCurrentTime((e as TimeUpdateEvent).detail.currentTime);
	}

	protected rangeChange() {
		this.dragging = false;
		const position = parseInt(this.rangeElement.value, 10);
		this.currentTarget?.dispatchEvent(new TimeSeekEvent({ position }));
	}

	protected rangeInput() {
		this.dragging = true;
		const value = parseInt(this.rangeElement.value, 10);
		this.timeElement.innerHTML = this.timeString(value);
	}

	protected timeString(seconds: number): string {
		const hour = Math.floor(seconds / 3600);
		const min = Math.floor((seconds - hour * 3600) / 60);
		const sec = Math.floor(seconds - hour * 3600 - min * 60);
		return min + ':' + (sec < 10 ? '0' + sec : sec);
	}

	protected setCurrentTime(time: number) {
		if (!this.dragging) {
			this.rangeElement.value = time.toString();
			this.timeElement.innerHTML = this.timeString(time);
		}
	}

	protected setDuration(duration: number) {
		this.rangeElement.max = duration.toString();
		this.durationElement.innerHTML = this.timeString(duration);
	}
}

export default Controls;