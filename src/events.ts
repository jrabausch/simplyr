export type PlayPauseDetail = {
	title: string;
	sub: string;
	audio: string;
};

export class PlayPauseEvent extends CustomEvent<PlayPauseDetail> {
	constructor(detail: PlayPauseDetail) {
		super('play-pause', {
			bubbles: true,
			detail
		});
	}
};

export class PlayingEvent extends CustomEvent<any>
{
	constructor() {
		super('playing', {
			bubbles: false
		});
	}
};

export class PausedEvent extends CustomEvent<any>
{
	constructor() {
		super('paused', {
			bubbles: false
		});
	}
};

export type AudioLoadedDetail = {
	duration: number;
};

export class AudioLoadedEvent extends CustomEvent<AudioLoadedDetail>
{
	constructor(detail: AudioLoadedDetail) {
		super('audio-loaded', {
			bubbles: true,
			detail
		});
	}
};

export type TimeUpdateDetail = {
	currentTime: number;
};

export class TimeUpdateEvent extends CustomEvent<TimeUpdateDetail>
{
	constructor(detail: TimeUpdateDetail) {
		super('time-update', {
			bubbles: true,
			detail
		});
	}
};

export type TimeSeekDetail = {
	position: number;
};

export class TimeSeekEvent extends CustomEvent<TimeSeekDetail>
{
	constructor(detail: TimeSeekDetail) {
		super('time-seek', {
			bubbles: true,
			detail
		});
	}
};