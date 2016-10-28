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

// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json(emojiArray, function(error, data) {
  for(var i = 0; i < emojiArray.length; i++) {
      data = emojiArray;
      data[i].name = emojiArray[i].name;
      data[i].percentage = emojiArray[i].percentage;
    }

// scale the range of the data
x.domain(data.map(function(d) { return d.name; }));
y.domain([0, d3.max(data, function(d) { return d.percentage + 0.05; })]);

// add axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "1em")
    .attr("dy", "3em");
    // .attr("transform", "rotate(-90)" );

svg.selectAll("x axis")
  .append("text")
    .style("text-achor", "end")
    .text("emoji");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("percentage");


// Add bar chart
svg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.name); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.percentage); })
    .attr("height", function(d) { return height - y(d.percentage); });

svg.selectAll("bar")
    .data(data)
    .enter()
    .append("image")
    .attr("class", "emoji")
    .attr("x", function(d, index) {
      return x(d.name) + 40;
    })
    .attr("y", function(d, index) {
      return height + 5;
    })
    .attr("width", 20)
    .attr("height", 20)
    .attr("xlink:href", function(d) {
      console.log("d: ");
      console.log(d);
      return "emojis/" + d.name + ".png"
    });
});