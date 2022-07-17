import Player from './Player';
import Track from './Track';

export const createPlayer = (): Player => {
	return new Player();
};

export const createTrack = (element: HTMLElement): Track => {
	return new Track(element);
};

(function () {

	const player = createPlayer();

	document.querySelectorAll('.playpause').forEach((el) => {
		createTrack(el as HTMLElement);
	});

})();