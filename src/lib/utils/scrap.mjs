export const getHtml = (url) => {
	const proxyURL = 'https://corsproxy.io/?' + encodeURIComponent(url);
	return new Promise((resolve) => {
		fetch(proxyURL)
			.then((response) => response.text())
			.then((html) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				resolve({ doc });
			})
			.catch((error) => {
				console.log(error);
				resolve({ error });
			});
	});
};

export const scrap = async (url) => {
	console.log('scrap', url);
	const { doc, error } = await getHtml(url);
	if (error) return;
	if (url.includes('fatsecret')) {
		console.log('scrap fatsecret');
		return await scrapFatsecret(doc);
	} else if (url.includes('calorieking')) {
		console.log('scrap calorie king');
		return await scrapCalorieKing(doc);
	} else if (url.includes('myfooddiary')) {
		console.log('scrap myfooddiary');
		return await scrapMyFoodDiary(doc);
	}
};

export const extractFloat = (str) => {
	const cleanedValue = str.replace(',', '.').replace(/[^0-9.]/g, '');
	return parseFloat(cleanedValue);
};

// https://www.fatsecret.es/calor%C3%ADas-nutrici%C3%B3n/activia/pera/1-vaso
const scrapFatsecret = async (doc) => {
	// Check format is correct
	const name = doc.querySelector('h1')?.innerText;
	if (!name) {
		console.warn('page is not formatted correctly', "couldn't retrieve data");
		return;
	}

	try {
		// extract nutrion facts
		const facts = Array.from(doc.querySelectorAll('.factPanel td.fact'));
		const cals = extractFloat(facts[0].children[1].innerText);
		const protein = extractFloat(facts[3].children[1].innerText);
		const carbs = extractFloat(facts[2].children[1].innerText);
		const fat = extractFloat(facts[1].children[1].innerText);
		// grams from serving
		const serving = doc.querySelector('.serving_size_value')?.innerText;
		let servingName;
		let servingSize;
		if (serving) {
			const servingInfo = parseServing(serving);
			// Example: 1 porción (33 g)
			// - units: 1
			// = serving: porción
			// - servingUnit: 1 porción
			// = grams: 33
			servingName = servingInfo.serving;
			if (servingInfo.grams) {
				servingSize = servingInfo.grams;
			} else {
				// get common portions table
				const commonPortionsTable = doc.querySelector('.details table.generic:has(tr.selected)');
				if (commonPortionsTable) {
					const gramsRegex = /^\d+(\.\d+)?\s+g$/;
					// look for grams reference in table
					const rows = Array.from(commonPortionsTable.querySelectorAll('tr'));
					rows.shift();
					rows.forEach((row) => {
						const refServing = row.children[0].innerText.trim();
						if (gramsRegex.test(refServing)) {
							const refGrams = extractUnitAndAmount(refServing).amount;
							const refCals = parseFloat(row.children[1].innerText);
							const convertionRate = (1 / refCals) * cals;
							const servingInGrams = servingInfo.units * refGrams * convertionRate;
							servingSize = Math.round(servingInGrams * 100) / 100;
						}
					});
				}
			}
		}
		// look for brand name
		const brand = doc.querySelector('h2.manufacturer')?.innerText;
		return {
			name,
			brand,
			cals,
			protein,
			carbs,
			fat,
			servingName,
			servingSize
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};

// https://www.calorieking.com/us/en/foods/search?keywords=banana
// https://www.calorieking.com/us/en/foods/f/calories-in-fresh-fruits-pears-raw/kBB-3tIxRbuf34iWRfQNaA
const scrapCalorieKing = (doc) => {
	console.log(doc);
	const name = doc.querySelector('[aria-current="page"]')?.innerText;
	if (!name) {
		console.warn('page is not formatted correctly', "couldn't retrieve data");
		return;
	}
	try {
		const title = doc.querySelector('div h1.MuiTypography-h4');
		const brand = title
			? title.childNodes[title.childNodes.length - 1].textContent?.replace(name, '')
			: null;

		const calorieLabel = doc.querySelector(
			'th.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeSmall'
		);
		const cals = parseInt(calorieLabel.childNodes[calorieLabel.childNodes.length - 1].textContent);
		const factsTable = doc.querySelector('tbody.MuiTableBody-root');
		const fat = parseFloat(
			factsTable.children[0].children[1].children[0].childNodes[0].textContent
		);
		const carbs = parseFloat(
			factsTable.children[1].children[1].children[0].childNodes[0].textContent
		);
		const protein = parseFloat(
			factsTable.children[3].children[1].children[0].childNodes[0].textContent
		);

		const servingQuantity = parseFloat(doc.querySelector('.MuiCardHeader-root input[type=number]'));
		const servingUnit = doc.querySelector('.MuiCardHeader-root [aria-haspopup]')?.innerText || '';

		let servingName;
		let servingSize;
		if (servingUnit) {
			servingName = ((servingQuantity || '1') + ' ' + servingUnit || '').trim();
			const servinginfo = parseServing(servingName);
			servingSize = servinginfo.grams;
		}

		return {
			name,
			brand,
			cals,
			protein,
			carbs,
			fat,
			servingName,
			servingSize
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};

// https://www.myfooddiary.com/foods/search?q=banana
// https://www.myfooddiary.com/foods/26915/pear
const scrapMyFoodDiary = (doc) => {
	const name = doc.querySelector('h2')?.innerText;
	if (!name) {
		console.warn('page is not formatted correctly', "couldn't retrieve data");
		return;
	}
	const brand = doc.querySelector('h4 strong')?.innerText;
	const foodLabel = doc.getElementById('FoodLabelHldr');
	const cals = doc.getElementById('nf_cal_hldr')?.children[0].innerText;
	const fat = parseFloat(foodLabel.querySelector('.GramsFat')?.innerText.replace('g', ''));
	const carbs = parseFloat(foodLabel.querySelector('.GramsCarbs')?.innerText.replace('g', ''));
	const protein = parseFloat(foodLabel.querySelector('.GramsProtein')?.innerText.replace('g', ''));
	const servingQuantity = parseFloat(doc.getElementById('NFServings').value);
	const serving = doc.querySelector('#FoodLabelHldr form+span')?.innerText;
	let servingName =
		servingQuantity + ' ' + doc.querySelector('#FoodLabelHldr form')?.childNodes[1].textContent;
	let servingSize;
	if (serving) {
		const match = serving.match(/(\d+)\s+(\w+)\s+=\s+(\d+)g/);
		servingSize = (parseFloat(match[3]) * servingQuantity) / parseFloat(match[1]);
	}
	try {
		return {
			name,
			brand,
			cals,
			protein,
			carbs,
			fat,
			servingName,
			servingSize
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};

// https://www.eatthismuch.com/food/browse?q=banana
// https://www.eatthismuch.com/calories/cashew-nuts-2642
const scrapEatThisMuch = (doc) => {
	const name = doc.querySelector('h1')?.innerText;
	if (!name) {
		console.log(doc);
		console.warn('page is not formatted correctly', "couldn't retrieve data");
		return;
	}
	try {
		return {
			name,
			brand,
			cals,
			protein,
			carbs,
			fat,
			servingName,
			servingSize
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};

// https://www.nutritionix.com/search?q=banana
// https://www.nutritionix.com/food/pear
const scrapNutritionix = (doc) => {
	const name = doc.querySelector('h1.food-item-name')?.innerText;
	if (!name) {
		console.warn('page is not formatted correctly', "couldn't retrieve data");
		return;
	}
	try {
		const cals = parseInt(doc.querySelector('[itemprop="calories"]').innerText);
		const fat = parseFloat(doc.querySelector('[itemprop="fatContent"]').childNodes[0].textContent);
		const carbs = parseFloat(
			doc.querySelector('[itemprop="carbohydrateContent"]').childNodes[0].textContent
		);
		const protein = parseFloat(
			doc.querySelector('[itemprop="proteinContent"]').childNodes[0].textContent
		);

		const servingQuantity = parseFloat(doc.querySelector('input.nf-unitQuantityBox')?.value);
		const servingUnit = (
			doc.querySelector('.servingUnit') || doc.querySelector('.nf-serving-unit-name')
		)?.innerText
			?.replace(/[\n\t]/g, ' ')
			.replace(name, '')
			.trim();

		let servingName;
		let servingSize;
		if (servingUnit) {
			servingName = ((servingQuantity || '1') + ' ' + servingUnit || '').trim();
			const servinginfo = parseServing(servingName);
			servingSize = servinginfo.grams;
		}

		return {
			name,
			brand: null,
			cals,
			protein,
			carbs,
			fat,
			servingName,
			servingSize
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const parseServing = (str) => {
	let units = 1;
	let servingUnit = str;
	let serving;
	let grams;
	const unitMeasureReg = /^(\d+(\.\d+)?)*\s*(.+)$/;
	// split into number and measure unit
	const matchUnitMeasure = str.match(unitMeasureReg);
	console.log(matchUnitMeasure);
	if (matchUnitMeasure) {
		if (matchUnitMeasure.length === 4) {
			units = parseFloat(matchUnitMeasure[1]);
			servingUnit = matchUnitMeasure[3];
		}
		// check if serving contains comvertion value in parenthesys
		const conversionInParenthesysReg = /\((\d+(\.\d+)?)\s*([a-z]+)\)/;
		const matchConversionToUnits = servingUnit.match(conversionInParenthesysReg);
		if (matchConversionToUnits) {
			console.log(matchConversionToUnits);
			servingUnit = servingUnit.replace(matchConversionToUnits[0], '').trim();
			const convertionUnits = parseFloat(matchConversionToUnits[1]);
			const convertionMeasureUnit = matchConversionToUnits[3];
			grams = toGrams(convertionMeasureUnit, convertionUnits);
		} else {
			grams = toGrams(servingUnit, units);
		}
	}
	serving = units + ' ' + servingUnit;
	return { units, servingUnit, serving, grams };
};

const extractUnitAndAmount = (str, strict = false) => {
	// Regular expression to match a number followed by a space and a unit
	const match = strict
		? str.match(/^(\d+(\.\d+)?)\s+([a-zA-Z]+)$/)
		: str.match(/^(\d+(\.\d+)?)\s+(.+)$/);

	if (match) {
		const amount = parseFloat(match[1]); // Convert the number part to a float
		const unit = match[3].trim().toLowerCase(); // Extract the unit part
		return { amount, unit };
	} else {
		return { amount: 0, unit: false }; // Return null if the pattern doesn't match
	}
};

const toGrams = (measureUnit, units = 1) => {
	measureUnit = measureUnit?.trim().toLowerCase();
	if (measureUnit === 'g') return 1 * units;
	else if (measureUnit === 'oz') return 28.35 * units;
	else return 0;
};
