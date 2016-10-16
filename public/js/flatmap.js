var countryArrayIndex=0;
var countries={};
var         outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000";

 function setCountryMood() {

    d3.json('http://localhost:3000/countries/api', function(error, moodData) {

       countryArrayIndex = (countryArrayIndex >= moodData.length) ? 0 : countryArrayIndex;

       if (moodData[countryArrayIndex].countryId == '10') {
          countryArrayIndex++;
       }


       var thisMoodValue = moodData[countryArrayIndex];
    //  console.log("countryArrayIndex=" + countryArrayIndex + "," + "path#cc" + thisMoodValue.countryId);
       moodChanged = true;

       if (countries[thisMoodValue.countryId]) {
          if (countries[thisMoodValue.countryId] == thisMoodValue.mood) {
             moodChanged = false;
          }
       } else {
          countries[thisMoodValue.countryId] = thisMoodValue.mood;
       }

       if (moodChanged) {

          d3.select("path#cc" + thisMoodValue.countryId)
             .data([1, 1, 2])
             .style("fill", "white")
             .attr("stroke", "black")
             .attr("stroke-width", 1)
             .transition()
             .duration(2000)
             .attr("stroke", outlineDefault)
             .attr("stroke-width", 1)
             .style("fill", moodScale(thisMoodValue.mood * 10))
       }

       countryArrayIndex++;
    })
 }
setInterval(function() {
   setCountryMood();
}, 50);