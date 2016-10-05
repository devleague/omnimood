/**
 * Calculate the mood value of a country (2 different calculations)
 * @param {Number} currentMood - the current mood of the country (from calc 1)
 * @param {Object} countryEmojis - the list of emojis and their amounts
 * @return {Object} moodValues - The moodValues from calculation 1 and 2
 */
function calcMood (currentMood, countryEmojis) {
  var sum = 0;
  var totalEmoji = 0;
  var positive = 0;
  for (var emoji in countryEmojis) {
    // do not include prototype props
    if(!countryEmojis.hasOwnProperty(emoji)) continue;

    // Calculation 1: Increment or decrement the sum according to emoji value
    sum += emoji[value]

    // Calculation 2: Get average mood of country
    emojiArray.push(emoji);
    if(emoji[value] > 0) {
      positive+=emoji[value];
    }
    total+=emoji[value];
  }

  // Calculation 1 value
  var moodValue1 = currentMood + sum;

  // Calculation 2 value: the positive percentage (1 - 100)
  var moodValue2 = Math.round(positive / total * 100);

  var moodvalue = {
    moodValue1: moodValue1,
    moodValue2: moodValue2
  }

  return moodValue;
}