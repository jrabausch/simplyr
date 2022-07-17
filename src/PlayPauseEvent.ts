export type PlayPausePayload = {
	title: string;
	sub: string;
	audio: string;
}

class PlayPauseEvent extends CustomEvent<PlayPausePayload>{

	static readonly type: string = 'play-pause';

	static create(title: string, sub: string, audio: string): CustomEvent<PlayPausePayload> {

		return new CustomEvent<PlayPausePayload>(PlayPauseEvent.type, {
			detail: {
				title,
				sub,
				audio
			}
		});
	}
}

export default PlayPauseEvent;