export const decimal = (num) => parseFloat(num.toFixed(2));

export const dbscan = (data, eps, minPts) => {
	const clusters = [];
	const visited = new Set();
	const noise = [];

	function regionQuery(point) {
		// Find all points within `eps` distance of `point`
		return data.filter((otherPoint) => Math.abs(otherPoint - point) <= eps);
	}

	function expandCluster(point, neighbors) {
		const cluster = [point];
		visited.add(point);

		for (let i = 0; i < neighbors.length; i++) {
			const neighbor = neighbors[i];
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				const newNeighbors = regionQuery(neighbor);
				if (newNeighbors.length >= minPts) {
					neighbors = neighbors.concat(newNeighbors);
				}
			}

			// Add to cluster if not already assigned to one
			if (!clusters.some((cluster) => cluster.includes(neighbor))) {
				cluster.push(neighbor);
			}
		}
		return cluster;
	}

	for (const point of data) {
		if (visited.has(point)) continue;

		const neighbors = regionQuery(point);
		if (neighbors.length < minPts) {
			noise.push(point);
		} else {
			const cluster = expandCluster(point, neighbors);
			clusters.push(cluster);
		}
	}

	return { clusters, noise };
};

export const getCalendarInfo = (year, month) => {
	// Month is zero-based (0 = January, 11 = December)

	// Get the number of days in the month
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// Get the day of the week for the 1st day of the month
	const firstDay = new Date(year, month, 1).getDay();

	// Return the number of days and the starting position (1-based index)
	return {
		daysInMonth,
		startPlace: firstDay + 1 // Adding 1 to make it 1-based for the calendar
	};
};
