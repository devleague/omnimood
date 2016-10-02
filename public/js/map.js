 var svg = d3.select("svg"),
   width = +svg.attr("width"),
   height = +svg.attr("height");



 d3.json("json/world-50m.json", function(error, world) {

   var countries = topojson.feature(world, world.objects.countries).features

   var projection = d3.geoMercator()
     .scale((width - 3) / (2 * Math.PI))
     .translate([width / 2, height / 2]);

   var path = d3.geoPath()
     .projection(projection);

   svg.selectAll(".country")
     .data(countries)
     .enter().insert("path", ".graticule")
     .attr("id", function(d) {
       return "cc" + d.id;
     })
     .attr("d", path)
     .style("fill", "#000000");
 });