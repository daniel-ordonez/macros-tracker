import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const openDatabase = (dbName, dbVersion = 1, stores = []) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);

		if (stores.length) {
			// Set up the schema if this is the first time creating the database
			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				// Create Object store
				for (const store of stores) {
					if (!db.objectStoreNames.contains(store.name)) {
						const objectStore = db.createObjectStore(store.name, {
							keyPath: 'id'
						});
						// Define the schema
						for (const item of store.items) {
							objectStore.createIndex(item.indexName, item.keyPath, item.options);
						}
					}
				}
			};
		}

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(`Database error: ${request.error}`);
		};
	});
};
async function getFoodItemById(db, id) {
	return new Promise((resolve) => {
		try {
			const transaction = db.transaction('foodItems', 'readonly');
			const objectStore = transaction.objectStore('foodItems');

			const request = objectStore.get(id);
			request.onsuccess = (event) => {
				const item = event.target.result;
				if (item) {
					resolve({ item });
				} else {
					console.log('No item found with the given ID');
					resolve({ item: null });
				}
			};
			request.onerror = () => {
				console.error('Error retrieving food item:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
}
const getAllFoodItems = (db) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodItems', 'readonly');
			const objectStore = transaction.objectStore('foodItems');

			const request = objectStore.getAll();
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = () => {
				console.error('Error fetching food items:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};
const getAllFoodLogs = (db) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readonly');
			const objectStore = transaction.objectStore('foodLogs');

			const request = objectStore.getAll();
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = () => {
				console.error('Error fetching food logs:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};
const getFoodLogs = (db, date) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readonly');
			const objectStore = transaction.objectStore('foodLogs');

			const index = objectStore.index('date');
			const request = index.getAll(date);

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = () => {
				console.error('Error fetching food logs:', request.error);
				//resolve({ error: request.error });
				resolve([]);
			};
		} catch (error) {
			console.error('Database error:', error);
			//resolve({ error });
			resolve([]);
		}
	});
};

export const getFoodLogsInRange = (db, startDate, endDate) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readonly');
			const objectStore = transaction.objectStore('foodLogs');

			// Use the index on the "date" field to query the range
			const index = objectStore.index('date');
			const range = IDBKeyRange.bound(startDate, endDate); // Inclusive range
			const request = index.openCursor(range);

			const results = [];
			request.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					results.push(cursor.value); // Collect matching items
					cursor.continue(); // Move to the next record
				} else {
					resolve(results);
				}
			};
			request.onerror = () => {
				console.error('Error querying items by date range:', request.error);
				resolve([]);
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve([]);
		}
	});
};
const addFoodItem = (db, food) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodItems', 'readwrite');
			const objectStore = transaction.objectStore('foodItems');

			food.id = uuidv4();

			const request = objectStore.add(food);
			request.onsuccess = () => {
				console.log('Food item added successfully!');
				resolve({ success: true });
			};
			request.onerror = () => {
				console.error('Error adding food item:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};
const addFoodLog = (db, foodLog) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readwrite');
			const objectStore = transaction.objectStore('foodLogs');

			foodLog.id = uuidv4();

			const request = objectStore.add(foodLog);
			request.onsuccess = () => {
				console.log('Food log added successfully!');
				resolve({ inserted: foodLog });
			};
			request.onerror = () => {
				console.error('Error adding food item:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};

const updateFoodLog = (db, foodLog) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readwrite');
			const objectStore = transaction.objectStore('foodLogs');

			const request = objectStore.put(foodLog);
			request.onsuccess = () => {
				console.log('Food log updated successfully!');
				resolve({ success: true });
			};
			request.onerror = () => {
				console.error('Error updating food item:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};

const deleteFoodLog = (db, logId) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodLogs', 'readwrite');
			const objectStore = transaction.objectStore('foodLogs');

			const request = objectStore.delete(logId);
			request.onsuccess = () => {
				console.log('Food log deleted successfully!');
				resolve({ success: true });
			};
			request.onerror = () => {
				console.error('Error deleting food item:', request.error);
				resolve({ error: request.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};
const batchAddFoodItem = (db, items) => {
	return new Promise(async (resolve) => {
		try {
			const transaction = db.transaction('foodItems', 'readwrite');
			const objectStore = transaction.objectStore('foodItems');

			for (let i = 0; i < items.length; i++) {
				objectStore.add(items[i]);
			}

			transaction.onsuccess = () => {
				console.log('All food items added successfully!');
				resolve({ success: true });
			};
			transaction.onerror = () => {
				console.error('Error adding food items:', transaction.error);
				resolve({ error: transaction.error });
			};
		} catch (error) {
			console.error('Database error:', error);
			resolve({ error });
		}
	});
};

export const dateToISO = (date = new Date()) => {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const year = date.getFullYear();
	return `${year}-${month}-${day}`;
};

// Wait for FoodDB to be ready before requesting logs
// When requested logs for a day, check if can serve from cache
// otherwise query DB, then save to cache

const logsCache = new Map();

class FoodDB {
	constructor(itemsStore, currentDate, currentDateLogs, dailyMacros) {
		this.dbName = 'food';
		this.dbVersion = 6;
		this.foodItemSchema = {
			name: 'foodItems',
			items: [
				{ indexName: 'name', keyPath: 'name', options: { unique: false } },
				{ indexName: 'servingName', keyPath: 'servingName', options: { unique: false } },
				{ indexName: 'servingSize', keyPath: 'servingSize', options: { unique: false } },
				{ indexName: 'calories', keyPath: 'calories', options: { unique: false } },
				{ indexName: 'protein', keyPath: 'protein', options: { unique: false } },
				{ indexName: 'carbs', keyPath: 'carbs', options: { unique: false } },
				{ indexName: 'fat', keyPath: 'fat', options: { unique: false } }
			]
		};
		this.foodLogSchema = {
			name: 'foodLogs',
			items: [
				{ indexName: 'foodId', keyPath: 'foodId', options: { unique: false } },
				{ indexName: 'food', keyPath: 'food', options: { unique: false } },
				{ indexName: 'brand', keyPath: 'brand', options: { unique: false } },
				{ indexName: 'servingName', keyPath: 'servingName', options: { unique: false } },
				{ indexName: 'servingSize', keyPath: 'servingSize', options: { unique: false } },
				{ indexName: 'amount', keyPath: 'amount', options: { unique: false } },
				{ indexName: 'grams', keyPath: 'grams', options: { unique: false } },
				{ indexName: 'calories', keyPath: 'calories', options: { unique: false } },
				{ indexName: 'protein', keyPath: 'protein', options: { unique: false } },
				{ indexName: 'carbs', keyPath: 'carbs', options: { unique: false } },
				{ indexName: 'fat', keyPath: 'fat', options: { unique: false } },
				{ indexName: 'date', keyPath: 'date', options: { unique: false } },
				{ indexName: 'time', keyPath: 'time', options: { unique: false } }
			]
		};
		this.itemsStore = itemsStore;
		this.currentDate = currentDate;
		this.currentDateLogs = currentDateLogs;
		this.dailyMacros = dailyMacros;
		this.onReadyQueue = [];
		if (browser) {
			this.start(itemsStore).then(this.onReady);
		}
	}
	updateCurrentDateLogs = async () => {
		const date = this.date;
		const logs = await this.getLogs(date);
		this.currentDateLogs.set(logs);
		// compute macros
		const currentDateMacros = logs.reduce(
			(macros, item) => {
				macros.calories += item.calories;
				macros.protein += item.protein;
				macros.carbs += item.carbs;
				macros.fat += item.fat;
				return macros;
			},
			{ calories: 0, protein: 0, carbs: 0, fat: 0 }
		);
		this.dailyMacros.set(currentDateMacros);
	};
	onReady = () => {
		this.currentDate.subscribe(async (date) => {
			if (!date) return;
			this.date = date;
			this.updateCurrentDateLogs();
		});
		this.onReadyQueue.forEach((f) => {
			f();
		});
	};
	start = async (itemsStore) => {
		const { dbName, dbVersion } = this;
		const stores = [this.foodItemSchema, this.foodLogSchema];
		const db = await openDatabase(dbName, dbVersion, stores);
		this.db = db;
		// load food items
		const items = await getAllFoodItems(db);
		if (items.length) {
			this.items = items;
		} else {
			this.items = [];
		}
		itemsStore.set(this.items);
	};
	addFood = async (food) => {
		const { db } = this;
		const { _, error } = await addFoodItem(db, food);
		if (!error) {
			this.items.push(food);
			this.itemsStore.set(this.items);
			return true;
		}
	};
	getFood = async (id) => {
		const { db } = this;
		const { item, error } = await getFoodItemById(db, id);
		if (!error) {
			return item;
		}
	};
	getLogs = async (date) => {
		if (!this.db) {
			// wait for db to start
			await new Promise((resolve) => {
				this.onReadyQueue.push(resolve);
			});
		}
		const { db } = this;
		const logs = await getFoodLogs(db, date);
		// save logs to cache
		logsCache.set(date, logs);
		return logs;
	};
	getLogsInRange = async (startDate, endDate) => {
		if (!this.db) {
			// wait for db to start
			await new Promise((resolve) => {
				this.onReadyQueue.push(resolve);
			});
		}
		const { db } = this;
		const logs = await getFoodLogsInRange(db, startDate, endDate);
		// save logs to cache
		return logs;
	};
	logFood = async (foodLog) => {
		const { db } = this;
		const { _, error } = await addFoodLog(db, foodLog);
		if (error) {
			console.error(error);
			return;
		}
		if (foodLog.date === this.date) {
			await this.updateCurrentDateLogs();
		}
		return true;
	};
	updateLog = async (foodLog) => {
		const { db } = this;
		const { _, error } = await updateFoodLog(db, foodLog);
		if (error) {
			console.error(error);
			return;
		}
		return true;
	};
	deleteLog = async (logId) => {
		console.log('deleteLog', logId);
		const { db } = this;
		const { _, error } = await deleteFoodLog(db, logId);
		if (error) {
			console.error(error);
			return;
		}
		return true;
	};
}

export const foodItems = writable([]);
export const foodLogs = readable(logsCache);
export const currentDate = writable(dateToISO());
export const currentDateLogs = writable([]);
export const dailyMacros = writable({});

const dbManager = new FoodDB(foodItems, currentDate, currentDateLogs, dailyMacros);

export const foodDb = readable(dbManager);
