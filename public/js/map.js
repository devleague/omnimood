 var svg = d3.select("svg"),
   width = +svg.attr("width"),
   height = +svg.attr("height");

  var outlineDefault="#eeeeee";
  var outlineHighlight="#1221ee";
  var fillDefault="#00bb00";

  var testText=d3.select("body").append("div").attr("id","testText");



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
     .attr("stroke",outlineDefault)
     .style("fill", fillDefault)
     .on("mouseover",function() {
       d3.select(this)
       .attr("stroke",outlineHighlight)
     })
     .on("mouseout",function(){
       d3.select(this)
       .attr("stroke",outlineDefault)
     })
     .append("svg:title")
   .text(function(d) { return "TEST"; });

    setCountryMood(840,"#0ff0d0");
    setCountryMood(258, "#fff0d0");
    setCountryMood(124,"#f0d0ff");
 });


 function setCountryMood(id,mood){
  console.log("TEst In Mood");
  svg.select("path#cc"+id)
  .data([1,1,2])
  .style("fill", mood);
 }

 /*
 
 .on("mouseover", function() {
  d3.select(this)
    .attr('fill', '') // Un-sets the "explicit" fill (might need to be null instead of '')
    .classed("active", true ) // should then accept fill from CSS
})
.on("mouseout",  function() {
  d3.select(this)
    .classed("active", false)
    .attr('fill', function(d) { return z(d.count_shipments); }) // Re-sets the "explicit" fill
  });
  */