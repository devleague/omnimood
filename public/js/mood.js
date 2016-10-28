/**
 * Calculate the average mood value of a country
 * @param {Object} countryEmojis - the list of emojis and their amounts
 * @return {Object} moodValue - The moodValue from calculation
 */
function calculateMood (countryEmojis) {
  var total = 0;
  var sum = 0;
  for (var emoji in countryEmojis) {
    if(!countryEmojis.hasOwnProperty(emoji)) continue;

    sum += emoji[value] * emoji[amount];

    total += emoji[amount];
  }

  var moodValue = sum / total;

  return moodValue;
}