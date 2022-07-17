import Player from './Player';

class Controls {

	protected player: Player;
	protected rangeElement: HTMLInputElement;
	protected timeElement: HTMLElement;
	protected durationElement: HTMLElement;
	protected dragging: boolean = false;

	constructor(player: Player) {
		this.player = player;

		this.rangeElement = document.querySelector('input[type="range"]') as HTMLInputElement;
		this.timeElement = document.querySelector('.timeline .time') as HTMLElement;
		this.durationElement = document.querySelector('.timeline .duration') as HTMLElement;

		this.rangeElement.addEventListener('change', this.rangeChange.bind(this));
		this.rangeElement.addEventListener('input', this.rangeInput.bind(this));
	}

	protected rangeChange() {
		this.dragging = false;
		const value = parseInt(this.rangeElement.value, 10);
		this.player.jumpTo(value);
	}

	protected rangeInput() {
		this.dragging = true;
		const value = parseInt(this.rangeElement.value, 10);
		this.timeElement.innerHTML = this.htmlTime(value);
	}

	protected htmlTime(seconds: number): string {
		const hour = Math.floor(seconds / 3600);
		const min = Math.floor((seconds - hour * 3600) / 60);
		const sec = Math.floor(seconds - hour * 3600 - min * 60);
		return min + ':' + (sec < 10 ? '0' + sec : sec);
	}

	setCurrentTime(time: number) {
		if (!this.dragging) {
			this.rangeElement.value = time.toString();
			this.timeElement.innerHTML = this.htmlTime(time);
		}
	}

	setDuration(duration: number) {
		this.rangeElement.max = duration.toString();
		this.durationElement.innerHTML = this.htmlTime(duration);
	}
}

export default Controls;