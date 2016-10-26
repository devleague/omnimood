// assigning var dataset to the bar chart

 var values = [1, 2, 3, 4,5,6,7,8,9, 10, 11];
var piedata = [
    {
        label: "Carcinogens",
        value: 0.122932,
        image: "./emojis/1f602.png"

    },
    {
        label: "Resporganics",
        value: 0.000938,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Respinorganics",
        value: 0.378316,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Climatechange",
        value: 0.087208,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Radiation",
        value: 0.002408,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Ozonelayer",
        value: 3.04E-05,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Ecotoxicity",
        value: 0.062962,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Acidification_Eutrophication",
        value: 0.020112,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Landuse",
        value: 0.015027,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },

    {
        label: "Minerals",
        value: 0.189932,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    },
    {
        label: "Fossilfuels",
        value: 0.447283,
        image: "https://cdn1.iconfinder.com/data/icons/industry-2/96/Mine-512.png"

    }
  ];



// margins on top n bottom

var margin = {
    top: 20,
    right: 120,
    bottom: 30,
    left: 40
},

// assigning width and height

width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// assign var x, y and colors

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

 var color = d3.scale.ordinal()
    .range(["red", "blue", "yellow", "steelblue", "orange", "pink", "grey", "green", "brown", "purple", "lightgreen" ]);

// var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y0 = 0;
var y1 = 0;
piedata.forEach(function (d) {
    d.color =
    d.y0 = y0;
    d.y1 = y0 + d.value;
    y0 = y0+d.value;
});
    console.log(piedata)



// data.sort(function(a, b) { return b.total - a.total; });

x.domain("0.00");
y.domain([0, y0]);



var mygroups = svg.selectAll("g")
    .data(piedata)
    .enter().append("g");





mygroups
    .append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function (d) {
    return y(d.y1);
})
    .attr("height", function (d) {
    return y(d.y0) - y(d.y1);
})
    .attr("class", "rectangle")
    .style("fill", function (d) {
    return color(d.label);
});
mygroups
    .append("svg:image")
    .attr("xlink:href",function(d) {return d.image})
    .attr("height", function (d) {
    return y(d.y0) - y(d.y1);
}).attr("width", x.rangeBand())
    .attr("y", function (d) {
    return y(d.y1);
});







