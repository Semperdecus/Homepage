const moodMap = {
  awful: 1,
  bad: 2,
  meh: 3,
  good: 4,
  rad: 5,
};

/**
 * Filters the data to include only entries from certain year
 * and maps moods to their corresponding mood scores.
 *
 * @param {Array} data - The input array of objects.
 * @param {number} year - The desired year
 * @returns {Array} - Filtered and processed data with mood scores.
 */
function filterAndMapData(data, year = 2024) {
  return data
    .filter((entry) => entry.full_date.startsWith(year))
    .map((entry) => ({
      date: entry.full_date, // Use full_date for consistent date format
      moodScore: moodMap[entry.mood], // Convert mood to moodScore
    }));
}

/**
 * Groups the data by date and calculates the average mood score for each day.
 *
 * @param {Array} filteredData - Data that has been filtered and mapped.
 * @returns {Array} - Data grouped by date with averaged mood scores.
 */
function groupAndAverageMoodScores(filteredData) {
  return filteredData
    .reduce((acc, curr) => {
      // Group by date
      const existing = acc.find((e) => e.date === curr.date);
      if (existing) {
        existing.moodScores.push(curr.moodScore);
      } else {
        acc.push({ date: curr.date, moodScores: [curr.moodScore] });
      }
      return acc;
    }, [])
    .map((entry) => ({
      date: entry.date,
      moodScore:
        entry.moodScores.reduce((sum, score) => sum + score, 0) /
        entry.moodScores.length,
    }));
}

/**
 * Processes the data to filter by year, map mood to scores, and group by date with averages.
 *
 * @param {Array} data - The input array of objects.
 * @param {number} year - The number of the year we're processing, important apparently
 * @returns {Array} - Processed data with one entry per day and averaged mood scores.
 */
function processMoodData(data, year) {
  const filteredData = filterAndMapData(data, year);
  return groupAndAverageMoodScores(filteredData);
}

// Export the functions
module.exports = {
  processMoodData,
};
