import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';

const multipliers = [0, 0.2, 0.375, 0.55, 0.725, 0.9];
export const activityOptions = readable([
	{
		name: 'Ignorar',
		description: 'No tomar en cuenta para el cálculo de calorías',
		value: multipliers[0]
	},
	{ name: 'Poca o ninguna', description: 'Estilo de vida sedentario', value: multipliers[1] },
	{ name: 'Ligera', description: 'Te ejercitas de 1 a 3 días/semana', value: multipliers[2] },
	{ name: 'Moderada', description: 'Te ejercitas de 4 a 5 días/semana', value: multipliers[3] },
	{
		name: 'Alta',
		description: 'Te ejercitas de 6 a 7 días/semana, o de manera intensa de 3 a 4 días/semana',
		value: multipliers[4]
	},
	{
		name: 'Extrema',
		description:
			'Ejercicio intenso de 6 a 7 días/semana, entrenamiento deportivo o trabajo físico diario',
		value: multipliers[5]
	}
]);

export const validateUserData = (data) => {
	return data && data.name && data.RMR && data.targetMacros;
};
export const loadStoredData = () => {
	if (browser) {
		const data = JSON.parse(window.localStorage.getItem('userData'));
		if (validateUserData(data)) {
			userData.set(data);
			return data;
		}
	} else {
		console.log('no browser');
	}
	console.log('no Data');
	return null;
};

export const userData = writable();
export const targetMacros = writable();

userData.subscribe((data) => {
	if (browser && data) {
		window.localStorage.setItem('userData', JSON.stringify(data));
	}
});
