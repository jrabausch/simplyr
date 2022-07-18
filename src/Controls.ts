import { AudioLoadedEvent, TimeSeekEvent, TimeUpdateEvent } from './events';

class Controls {

	protected currentTarget: EventTarget | null = null;
	protected rangeElement: HTMLInputElement;
	protected timeElement: HTMLElement;
	protected durationElement: HTMLElement;
	protected dragging: boolean = false;

	constructor(root: EventTarget) {

		this.rangeElement = document.querySelector('input[type="range"]') as HTMLInputElement;
		this.timeElement = document.querySelector('.timeline .time') as HTMLElement;
		this.durationElement = document.querySelector('.timeline .duration') as HTMLElement;

		this.rangeElement.addEventListener('change', this.rangeChange.bind(this));
		this.rangeElement.addEventListener('input', this.rangeInput.bind(this));

		root.addEventListener('audio-loaded', this.onAudioLoaded.bind(this));
		root.addEventListener('time-update', this.onTimeUpdate.bind(this));
	}

	protected onAudioLoaded(e: Event) {
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