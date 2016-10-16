var countryId;

var svg = d3.select("svg#svg_map");

var projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

d3.json("json/world-50m.json", function(error, world) {

  svg
    .selectAll("path")
    .on("click", function (d) {

      var width = 1600;
      var height = 700;
      var centroid = path.centroid(d);
      var x = width / 2 - centroid[0];
      var y = height / 2 - centroid[1];

      countryId = "path#cc" + d.id;

      svg
        .append("g")
        .attr("id", "countryInfo-wrapper")
        .attr("width", "800")
        .attr("height", "400");

      d3.select("g#mapContainer")
        .transition()
        .delay(250)
        .attr("visibility", "hidden");

      var g = d3.select("g#countryInfo-wrapper")
        .append("g")
        .attr("id", "country-wrapper")
        .insert("path", countryId)
        .attr("d", this.attributes.d.value)
        .attr("stroke", "red")
        .transition()
        .delay(250)
        .attr("transform", "translate(" + x + "," + y + ")")
        .style("stroke", "#eeeeee")
        .style("fill", "#000000");

      d3.select("g#country-wrapper")
        .append("text")
        .text(d3.select(this).text())
        .attr("transform", "translate(800, 50)")
        .transition()
        .delay(250)
        .style("font-size", "25")
        .style("font-family", "serif")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "orange");

      d3.select("g#countryInfo-wrapper")
        .on("click", backToMap);
  });
});

function backToMap () {
  d3.select("g#countryInfo-wrapper")
    .remove();
  d3.select("g#mapContainer")
    .attr("visibility", "visible");
}