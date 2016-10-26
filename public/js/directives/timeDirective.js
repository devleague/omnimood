angular.module("omniMood")
  .directive("killerqueen", function() {
    return {
      restrict: "E",
      scope: {

      },
      link: timeelse
    };

    function timeelse(scope, element, attr) {
      var timeSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = window.innerWidth * .65,
        height = window.innerHeight * .70,
        outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000",
        moodMin = -10,
        moodMid = 0,
        moodMax = 10,
        countryArrayIndex = 0;
      var timeScale = d3.scaleLinear()
        .domain([-10, 0, 10])
        .range(["red", "yellow", "green"]);

      var g = timeSVG
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-container");

      g
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue")
        .attr("rx",10);

      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          .scale((height + 50) / (1.55 * Math.PI))
          .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
          .projection(projection);

        g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "dd" + (d.properties.iso_n3 / 1);
          })
          .attr("d", path)
          .attr("stroke", outlineDefault)
          .on("mouseover", function(d) {
            d3.select(this)
            .attr("stroke", outlineHighlight);
          })
          .on("mouseout", function() {
            d3.select(this)
              .attr("stroke", outlineDefault);
          })
          .on("click", function (d) {

            var w = width;
            var h = height;
            var centroid = path.centroid(d);
            var x = w / 2 - centroid[0];
            var y = h / 2 - centroid[1];

            countryId = "path#cc" + d.properties.iso_n3;

            timeSVG
              .append("g")
              .attr("id", "countryInfo");

            d3.select("g#map-container")
              .transition()
              .delay(75)
              .attr("visibility", "hidden");

            var countryInfo = d3.select("g#countryInfo");

            countryInfo
              .append("g")
              .attr("id", "country-container")
              .insert("path", countryId)
              .attr("d", this.attributes.d.value)
              .attr("stroke", "red")
              .transition()
              .delay(75)
              .attr("transform", "translate(" + x + "," + y + ")")
              .style("stroke", "#eeeeee")
              .style("fill", "#000000");

            var countryContainer = d3.select("g#country-container");

            d3.json("/json/info-countries.json", function (error, objects) {

              var alpha3code = d.properties.iso_a3;

              for(var k in objects) {

                var object = objects[k];

                if(alpha3code === object.alpha3Code) {

                  var info = countryInfo.append("g");

                  info
                    .append("text")
                    .html("Country Name: " + object.name)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(325, 70)");

                  info
                    .append("text")
                    .text("Capital: " + object.capital)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(325, 120)");

                  info
                    .append("text")
                    .text("Population: " + object.population)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(325, 170)");

                  info
                    .append("text")
                    .text("GDP (billions of $): " + object.GDP)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(50, 240)");

                  info
                    .append("text")
                    .text("Rank (based on GDP): " + object.rank)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(50, 290)");

                  info
                    .append("text")
                    .text("Demonym: " + object.demonym)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(50, 340)");

                  info
                    .append("text")
                    .text("Region: " + object.region)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(50, 390)");

                  info
                    .append("text")
                    .text("Sub-Region: " + object.subregion)
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(50, 440)");

                  info
                    .append("text")
                    .text("Country Mood (Y) over time (X)")
                    .transition()
                    .delay(75)
                    .attr("transform", "translate(975, 130)");

                  info.selectAll("text")
                    .style("font-size", "20")
                    .style("font-family", "serif")
                    .style("fill", "orange");
                }
              }
            });

            countryInfo
              .append("svg:image")
              .transition()
              .delay(75)
              .attr("xlink:href", "/flags/" + d.properties.iso_a3 + ".png")
              .attr("width", "250")
              .attr("height", "225")
              .attr("transform", "translate(50, 0)");

            d3.json("http://localhost:3000/api/timeline", function(error, data) {

              var isoN3 = parseInt(d.properties.iso_n3, 10);
              var getCountries = data.countries[isoN3];
              var xDataGet = data.times;

              var line = d3.line()
                .x(function(d, i) {
                  return xRange(i);
                })
                .y(function (d) {
                  return yRange(d);
                });

              console.log(getCountries);
              console.log(xDataGet);
              var lineData = [{"y": -1}, {"y":0}, {"y":1}];

              var vis = d3.select("g#countryInfo"),
                WIDTH = 450,
                HEIGHT = 300,
                MARGINS = {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 50
                },
                xRange = d3.scaleOrdinal()
                  .range([MARGINS.left, WIDTH - MARGINS.right])
                  .domain(xDataGet),

                yRange = d3.scaleLinear()
                  .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                  .domain([d3.min(lineData, function(d) {
                    return d.y;
                  }),
                d3.max(lineData, function(d) {
                  return d.y;
                })
              ]),

              xAxis = d3.axisBottom()
                .scale(xRange)
                .ticks(3)
                .tickSize(5)
                .tickFormat(function (date) {
                  var format = d3.timeFormat(date);
                  return format;
                }),

              yAxis = d3.axisLeft()
                .scale(yRange)
                .ticks(3)
                .tickSize(5);

            vis.append("svg:g")
              .attr("class", "x axis")
              .transition()
              .delay(75)
              .attr("transform", "translate(" + (MARGINS.left * 17) + "," + (MARGINS.left * 8.5) + ")")
              .call(xAxis);

            vis.append("svg:g")
              .attr("class", "y axis")
              .transition()
              .delay(75)
              .attr("transform", "translate(" + (MARGINS.left * 18) + ", " + (MARGINS.left * 2.90) + ")")
              .call(yAxis);

            vis.append("svg:path")
              .attr("d", line(getCountries))
              .style("fill", "steelblue")
              .attr("stroke-width", 1);
            });

            countryInfo
              .on("click", backToMap);
          })
        .append("svg:title")
        .text(function(d) {
          return d.properties.name;
        });
      });

      d3.json('/api/timeline', function(error, timeData) {

          var countries = timeData.countries;
          var timeSelect = document.getElementById("timeRange");
          var textSelect = document.getElementById("timeDisplay");
          textSelect.innerHTML = timeData.times[9];
          for(var country in countries){
            d3.select("path#dd" + country)
                .attr("stroke","#eeeeee")
                .attr("stroke-width", 1)
                .style("fill", timeScale(countries[country][9] * 10));
          }
          d3.select(timeSelect);
            on('mousemove', function(){
              var timePlace = document.getElementById("timeRange").value;
              textSelect.innerHTML = timeData.times[timePlace];
            })
            .on('change', function(stuff){
              var timePlace = document.getElementById("timeRange").value;
              textSelect.innerHTML = timeData.times[timePlace];
              for(var country in countries){
                d3.select("path#dd" + country)
                    .attr("stroke","#eeeeee")
                    .attr("stroke-width", 1)
                    .style("fill", timeScale(countries[country][timePlace] * 10));
              }
          });
      });
    }

    function backToMap () {
      d3.selectAll("g#country-container").select("path")
        .transition()
        .delay(75)
        .attr("transform", "translate(0, 0)");

      d3.select("g#countryInfo")
        .remove();

      d3.select("g#map-container")
        .attr("visibility", "visible");
    }
  });