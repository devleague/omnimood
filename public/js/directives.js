angular.module('omniMood')
  .directive('whateveryouwant', function() {
    return {
      restrict: 'E',
      scope: {

      },
      link: somethingelse
    };

    function somethingelse(scope, element, attr) {
      var mapSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = (document.body.clientWidth * .85),
        height = (document.body.clientHeight * .83),
        outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000",
        moodMin = -10,
        moodMid = 0,
        moodMax = 10,
        countryArrayIndex = 0;

      var moodScale = d3.scaleLinear()
        .domain([moodMin, moodMid, moodMax])
        .range(["red", "yellow", "green"]);

      var g = mapSVG
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-container");

      g
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue");

      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          .scale((height - 3) / (1.4 * Math.PI))
          .translate([width / 2, height / 2]);

        var path = d3.geoPath()
          .projection(projection);

        g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "cc" + (d.properties.iso_n3 / 1);
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

            mapSVG
              .append("g")
              .attr("id", "countryInfo");

            d3.select("svg.legend")
              .attr("visibility", "hidden");

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

            d3.json("../json/REST-countries.json", function (objects) {

              var alpha3code = d.properties.iso_a3;

              for(k in objects) {
                var object = objects[k];

                if(alpha3code === object.alpha3Code) {
                  var info = countryInfo.append("g");

                  info
                    .append("text")
                    .text("Country Name: " + object.name)
                    .attr("transform", "translate(325, 70)");

                  info
                    .append("text")
                    .text("Capital: " + object.capital)
                    .attr("transform", "translate(325, 120)");

                  info
                    .append("text")
                    .text("Population: " + object.population)
                    .attr("transform", "translate(325, 170)");

                  info
                    .append("text")
                    .text("ISO ALPHA-3 Code: " + object.alpha3Code)
                    .attr("transform", "translate(50, 240)");

                  info
                    .append("text")
                    .text("Calling Code: " + object.callingCodes[0])
                    .attr("transform", "translate(50, 290)");

                  info
                    .append("text")
                    .text("Demonym: " + object.demonym)
                    .attr("transform", "translate(50, 340)");

                  info
                    .append("text")
                    .text("Region: " + object.region)
                    .attr("transform", "translate(50, 390)");

                  info
                    .append("text")
                    .text("Sub-Region: " + object.subregion)
                    .attr("transform", "translate(50, 440)");

                  info
                    .append("text")
                    .text("Currency: " + object.currencies)
                    .attr("transform", "translate(50, 490)");

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

            countryContainer
              .append("a")
              .attr("xlink:href", "http://www.localhost:3000/graphs")
              .append("rect")
              .attr("x", 730)
              .attr("y", 25)
              .attr("height", 50)
              .attr("width", 160)
              .attr("rx", 5)
              .attr("ry", 5)
              .style("fill", "#eeeeee");

            countryContainer
              .append("text")
              .text("Show Graph")
              .attr("x", 740)
              .attr("y", 55)
              .style("font-size", "25")
              .style("font-family", "serif")
              .style("font-weight", "bold")
              .style("pointer-events", "none")
              .style("fill", "#000000");

            InitChart();

            countryInfo
              .on("click", backToMap);
        })
        .append("svg:title")
        .text(function(d) {
          return d.properties.name;
        });
      });

      setInterval(function() {
        d3.json('http://localhost:3000/api/countries', function(error, moodData) {

          countryArrayIndex = (countryArrayIndex >= moodData.length) ? 0 : countryArrayIndex;
          if (moodData[countryArrayIndex].countryId == '10') {
            countryArrayIndex++;
          }
          var thisMoodValue = moodData[countryArrayIndex];
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
              .style("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .transition()
              .duration(2000)
              .attr("stroke", outlineDefault)
              .attr("stroke-width", 1)
              .style("fill", moodScale(thisMoodValue.mood * 10));
          }

          countryArrayIndex++;
        });
      }, 200);
    }

    function backToMap () {
      d3.selectAll("g#country-container").select("path")
        .transition()
        .delay(75)
        .attr("transform", "translate(0, 0)");

      d3.select("g#countryInfo")
        .remove();

      d3.select("svg.legend")
        .attr("visibility", "visible");

      d3.select("g#map-container")
        .attr("visibility", "visible");
    }

    function InitChart() {

      var lineData = [{
        'x': 1,
      }, {
        'x': 20,
      }, {
        'x': 40,
      }, {
        'x': 60,
      }, {
        'x': 80
      }, {
        'x': 100
      }];

      var vis = d3.select("g#countryInfo"),
        WIDTH = 700,
        HEIGHT = 300,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        },
        xRange = d3.scaleLinear()
          .range([MARGINS.left, WIDTH - MARGINS.right])
          .domain([d3.min(lineData, function (d) {
            return d.x;
          }),
          d3.max(lineData, function (d) {
            return d.x;
          })
        ]),

        yRange = d3.scaleLinear()
          .range([HEIGHT - MARGINS.top, MARGINS.bottom])
          .domain([d3.min(lineData, function (d) {
            return d.y;
          }),
          d3.max(lineData, function (d) {
            return d.y;
          })
        ]),

        xAxis = d3.axisBottom()
          .scale(xRange)
          .tickSize(5),

        yAxis = d3.axisLeft()
          .scale(yRange);


        vis.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (HEIGHT + (MARGINS.top * 26)) + ")")
          .call(xAxis);

        vis.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (MARGINS.left) + ", " + (HEIGHT + (MARGINS.top * 12)) + ")")
          .call(yAxis);
    }
  })
  .directive('globe', function() {
    return {
      restrict: 'E',
      scope: {
        coordinates: '='
      },
      link: link
    };

    function link(scope, element, attr) {
      var width = 900,
        height = 500,
        velocity = [.015, 0],
        rotate = [0, 0],
        time = Date.now(),
        timer_ret_val = false,
        countryById = {},
        mouseCoords,
        rotateCoords;

      var projection = d3.geoOrthographic()
        .translate([width / 2, height / 2])
        .scale(245)
        .clipAngle(90)
        .precision(0.1)
        .rotate(rotate);

      var path = d3.geoPath()
        .projection(projection);

      var drag = d3.drag()
        .on('start', function() {
          timer_ret_val = true;
          var proj = projection.rotate();
          mouseCoords = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
          rotateCoords = [-proj[0], -proj[1]];
        })
        .on('drag', function() {
          if (mouseCoords) {
            var mouseCoords2 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
            var rotateCoords2 = [rotateCoords[0] + (mouseCoords[0] - mouseCoords2[0]) / 4, rotateCoords[1] + (mouseCoords2[1] - mouseCoords[1]) / 4];
            projection.rotate([-rotateCoords2[0], -rotateCoords2[1]]);
          }

          path = d3.geoPath().projection(projection);
          d3.select('.globe').selectAll('path')
            .attr('d', path);
        });

      var svg = d3.select(element[0])
        .append('svg')
        .attr('class', 'globe')
        .attr('width', width)
        .attr('height', height)
        .call(drag)
        .call(autoRotateGlobe);

      var features = svg.append('g');

      features.append('path')
        .datum({
          type: 'Sphere'
        })
        .attr('class', 'background')
        .attr('d', path);

      var graticule = d3.geoGraticule();

      features.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path);

      var countryToolTip = d3.select(element[0])
        .append('div')
        .attr('class', 'countryToolTip')
        .style('position', 'absolute');

      d3.json('../json/countries.json', function(err, world) {
        countries = topojson.feature(world, world.objects.countries).features;

        countries.forEach(function(country) {
          countryById[country.properties.iso_n3] = country.properties.name;
        });
        drawCountries('country', countries);
      });

      scope.$watch('coordinates', function(coordinates) {
        if (coordinates) {
          //   console.log(coordinates);
          var coordArr = [];
          coordArr.push(coordinates);
          svg.selectAll('path.ping')
            .data(coordArr)
            .enter()
            .append('path', '.ping')
            .datum(function(d) {
              return {
                type: 'Point',
                coordinates: [d.long, d.lat],
                radius: 0.1
              };
            })
            .style('fill', 'white')
            .style('fill-opacity', 0.1)
            .style('stroke-width', 0)
            .attr('d', path);
        }
      });

      function drawCountries(className, countries) {
        var set = features.selectAll('.' + className)
          .data(countries)
          .enter().append('g')
          .attr('class', className)
          .attr('id', function(d) {
            return 'cc' + d.properties.iso_n3;
          })
          .on('mouseover', function(d) {
            countryToolTip.text(countryById[d.properties.iso_n3])
              .style('left', (d3.event.pageX - 95) + 'px')
              .style('top', (d3.event.pageY - 100) + 'px')
              .style('display', 'block')
              .style('opacity', 1);
          })
          .on('mouseout', function(d) {
            countryToolTip
              .style('opacity', 0)
              .style('display', 'none');
          })
          .on('mousemove', function(d) {
            countryToolTip
              .style('left', (d3.event.pageX - 95) + 'px')
              .style('top', (d3.event.pageY - 100) + 'px');
          })
          .on('click', function(d) {
            timer_ret_val = true;
            d3.selectAll('.selected')
              .classed('selected', false);

            d3.select(this)
              .select('path')
              .classed('selected', true);
            rotateToFocus(d);
          });

        set.append('path')
          .attr('class', 'land')
          .attr('d', path);

        set.append('path')
          .attr('class', 'overlay')
          .attr('d', path);

        return set;
      }

      function rotateToFocus(d) {
        var coords = d3.geoCentroid(d);
        coords[0] = -coords[0];
        coords[1] = -coords[1];

        d3.transition()
          .duration(1250)
          .tween('rotate', function() {
            var r = d3.interpolate(projection.rotate(), coords);
            return function(t) {
              projection.rotate(r(t));
              svg.selectAll('path')
                .attr('d', path);
            };
          })
          .transition();
      }

      function autoRotateGlobe() {
        d3.timer(function() {
          if (!timer_ret_val) {
            var dt = Date.now() - time;
            projection.rotate([rotate[0] + velocity[0] * dt - 100, rotate[1] + velocity[1] * dt]);
            svg.selectAll('path').attr('d', path);
          }
          return timer_ret_val;
        });
      }
    }
  })
  .directive('legend', function() {
    return {
      restrict: 'E',
      link: link
    };

    function link(scope, element, attr) {
      var width = 170,
        height = 170;

      var svgLegend = d3.select(element[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'legend');

      svgLegend.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

      var moodInfo = [{
        color: 'green',
        mood: 'Happy',
        y_position: height * .15,
        image: '/emojis/1f601.png'
      }, {
        color: 'yellow',
        mood: 'So so',
        y_position: height * .5,
        image: '/emojis/1f610.png'
      }, {
        color: 'red',
        mood: 'Mad',
        y_position: height * .81,
        image: '/emojis/1f621.png'
      }, ];

      svgLegend.selectAll('circle')
        .data(moodInfo)
        .enter().append('circle')
        .attr('r', 5)
        .attr('cx', width * .1)
        .attr('cy', function(d) {
          return d.y_position;
        })
        .style('fill', function(d) {
          return d.color;
        });

      svgLegend.selectAll('text')
        .data(moodInfo)
        .enter().append('text')
        .attr('x', width * .3)
        .attr('y', function(d) {
          return d.y_position + 5;
        })
        .text(function(d) {
          return d.mood;
        })
        .attr('fill', 'white');

      svgLegend.selectAll('image')
        .data(moodInfo)
        .enter().append('image')
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', width * .7)
        .attr('y', function(d) {
          return d.y_position - 14;
        })
        .attr('xlink:href', function(d) {
          return d.image;
        });
    }
  });