import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { loadStoredData } from '../lib/stores/user';

export const ssr = false;
export function load() {
	if (browser) {
		const data = loadStoredData();
		if (!data) {
			throw redirect(301, `/start/`);
		} else {
			redirect(301, '/dashboard');
		}
	} else {
		console.log(window);
		console.log('no broswer from dashboard');
	}
}
