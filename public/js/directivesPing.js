angular.module('omniMood')
  .directive('whateveryouwant', function() {
    return {
      restrict: 'E',
      scope: {
        "tweet": '='
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

      /*
            var latLng = [{
              "long": -57.50617017,
              "lat": -25.24155981
            }];
      */
      var latLng = [
        [-57.50617017, -25.24155981]
      ];

      latLng = [
        [107.75749781, -6.9674592]
      ];
      /*
            5.0173889, long: -73.9980482
            -57.50617017 -25.24155981
      directivesPing.js:210 -57.5049322 -25.34336822
      directivesPing.js:210 -157.81175 21.25972222
      directivesPing.js:210 -74.002591 40.757777
      directivesPing.js:210 -87.61707064 41.86619339
      */

      mapSVG
        .attr("width", width)
        .attr("height", height)
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue");

      //  var codeToCountry; // You are on your own!  10/15/16

      var emojiList;
      d3.json("/json/codeEmoji.json", function(error, thisEmojiList) {
        emojiList = thisEmojiList;
      });



      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          //.scale((height - 3) / (1.4 * Math.PI))
          .scale(280)
          .translate([width / 2.28, height / 3.6])
          .center([-40, 50]); //[-106, 37.5]

        var path = d3.geoPath()
          .projection(projection);

        mapSVG.selectAll(".country")
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
          .append("svg:title")
          .text(function(d) {
            return d.properties.name;
          });

        /*

                mapSVG.selectAll('path.ping')
                  .data(latLng)
                  .enter()
                  .append('path', '.ping')
                  .datum(function(d) {
                    console.log(d.long, d.lat);
                    return {
                      type: 'Point',
                      coordinates: [d.long, d.lat],
                      radius: 0.1
                    };
                  })
                  .style('fill', 'white')
                  .style('fill-opacity', 1.0)
                  .attr('stroke-width', 1)
                  .attr('d', path);

        */


        scope.$watch('tweet', function(tweet) {
          if (tweet) {
            //    console.log(coordinates);

            var latLngData = [
              [tweet.coordinates.long, tweet.coordinates.lat]
              //  [coordinates.lat, coordinates.long]
            ];

            mapSVG.append('circle')
              .data(latLngData)
              //.attr('class', 'test')
              .attr("cx", function(d) {
                return projection(d)[0];
              })
              .attr("cy", function(d) {
                return projection(d)[1];
              })
              .attr("r", "300px")
              .attr("fill", moodScale(tweet.moodValue * 10)) //"white")
              .style("fill-opacity", 0.5)
              .transition()
              .duration(2000)
              .attr("r", "3px")
              .attr("fill", moodScale(tweet.moodValue * 10))
              .style("fill-opacity", 0.3);

            var emojiX = projection(latLngData[0])[0]; //-120;
            var emojiY = projection(latLngData[0])[1]; //-140;
            //var thisEmoji = tweet.emojis[0];


            var surrogate = tweet.emojis.map((emoji) => {
              return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
            });
            surrogate.forEach(function(surrogate) {
              if (emojiList[surrogate]) {
                mapSVG.append('image')
                  .data(latLngData)
                  .attr('xlink:href', '../emojis/' + emojiList[surrogate].code.toLowerCase() + '.png')
                  .attr('x', 0)
                  .attr('y', 0)
                  .attr("x", function(d) {
                    return emojiX;
                  })
                  .attr("y", function(d) {
                    return emojiY;
                  })
                  .attr('height', 300)
                  .attr('width', 200)
                  .style('fill-opacity', 0.5)
                  .transition()
                  .duration(1000)
                  .attr('height', 3)
                  .attr('width', 2);
              }
              else
              {
                console.log(surrogate);
              }
            });

            /*
              console.log(latLng);
            
            mapSVG.selectAll('circle.test')
              .data(latLngData)
              .enter()
              .append('circle')
              .attr('class', 'test')
              .attr("cx", function(d) {
                console.log("long " + d[0] + " @ ");
                console.log(d);
                console.log(projection(d));
                return projection(d)[0];
              })
              .attr("cy", function(d) {
                return projection(d)[1];
              })
              .attr("r", "10px")
              .attr("fill", "white")
              .transition()
              .duration(2000)
              .attr("r", "5px")
              .attr("fill", "blue");
              */

          }
        })



      });



      /*

            mapSVG.selectAll('circle')
              .data(latLng)
              .enter()
              .append('circle')
              .attr("r",25)
              .style("fill","red");

      */



      /*
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
            }, 200);
      */

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
          var coordArr = [];
          coordArr.push(coordinates);
          svg.selectAll('path.ping')
            .data(coordArr)
            .enter()
            .append('path', '.ping')
            .datum(function(d) {
              //   console.log(d.long, d.lat);
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
            return 'cc' + d.id;
          })
          .on('mouseover', function(d) {
            countryToolTip.text(countryById[d.properties.iso_n3])
              .style('left', (d3.event.pageX + 7) + 'px')
              .style('top', (d3.event.pageY - 15) + 'px')
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
              .style('left', (d3.event.pageX + 10) + 'px')
              .style('top', (d3.event.pageY - 10) + 'px');
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