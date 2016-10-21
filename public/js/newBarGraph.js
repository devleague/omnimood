var emojis = {
    "1f60a": {
        percentage: 0.05,
        count: 2322
    },
    "2764": {
        percentage: 0.09,
        count: 4316
      },
    "2665": {
        percentage: 0,
        count: 0
    },
    "1f60d": {
      percentage: 0,
      count: 0
    },
    "1f602": {
      percentage: 0.14,
      count: 6450
    }
  };

var maxPercent = 0;

var emojiKeys = Object.keys(emojis);

var emojiObject = {};
var emojiArray = [];
emojiKeys.forEach(function(key) {
  emojiObject = {
    name: key,
    count: emojis[key].count,
    percentage: emojis[key].percentage
  }

  emojiArray.push(emojiObject);
});

emojiArray.sort(compare);

function compare(a,b) {
  if (a.percentage < b.percentage) {
    maxPercent = b.percentage;
    return -1;
  }
  if (a.percentage > b.percentage) {
    maxPercent = a.percentage;
    return 1;
  }
  return 0;
}

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".barGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json(emojiArray, function(error, data) {
  console.log("data: ");
  console.log("data");
  for(var i = 0; i < emojiArray.length; i++) {
      data = emojiArray;
      data[i].name = emojiArray[i].name;
      data[i].percentage = emojiArray[i].percentage;
    }

  if (error) throw error;

  // format the data
  // data.forEach(function(d) {
  //   d.percentage = +d.percentage;
  // });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.percentage); })
      .attr("height", function(d) { return height - y(d.percentage); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});