export function throttle(f, t = 300) {
	let waiting = false;
	return (...args) => {
		if (waiting) return;
		f(...args);
		waiting = true;
		setTimeout(() => {
			waiting = false;
		}, t);
	};
}
export function debounce(f, t = 100) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			f.apply(this, args);
		}, t);
	};
}

const monthNames = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre'
];

const dayNames = [
	'Domingo',
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sabado',
	'Domingo'
];
export const getMonthNames = () => monthNames;
export const getDayNames = () => dayNames;
