/**
 * Calculate the mood value of a country
 * @param {Number} currentMood - the current mood of the country
 * @param {Object} countryEmojis - the list of emojis and their amounts
 * @return {Number} moodValue - The mood value to be returned
 */
function calcMood (currentMood, countryEmojis) {
  var sum = 0;
  for (var emoji in countryEmojis) {
    // do not include prototype props
    if(!countryEmojis.hasOwnProperty(key)) continue;

    if(emoji[value] > 0) {
      sum++;
    }
    else if(emoji[value] < 0) {
      sum--;
    }
  }
  var newMood = currentMood + sum;
  return newMood;
}