angular.module('omniMood')
  .directive('flatmappings', function() {
    return {
      restrict: 'E',
      scope: {
        "tweet": '='
      },
      link: pingOnFlatMap
    };

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    function pingOnFlatMap(scope, element, attr) {

      var scaleWheelMin = 5;
      var scaleWheelMax = 20;

      var scaleZoomTo = 5;
      var isZoomed = false;
      var currentZoom = 1;
      var currentZoomMouseX = 0;
      var currentZoomMouseY = 0;
      var defaultMapBorder = 0.1;

      var mapSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = (window.innerWidth * .65),
        height = (window.innerHeight * .85),
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

      var flatMapScale = d3.scaleLinear()
        .domain([320, 1600])
        .range([50, 150]);

      var mapRect = mapSVG
        .attr("width", width)
        .attr("height", height)

      .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("rx", 10)
        .style("fill", "steelblue");

      var mapGroup = mapSVG.append("g").on('click', function() {
          zoomTo(this)
        })
        .on('dblclick', zoomOut)
        .on('wheel', zoomIn);

      var projection = d3.geoMercator()
        .scale(flatMapScale(window.innerWidth))
        .translate([width / 2, height / 2.3])
        .center([0, 50]);

      var path = d3.geoPath()
        .projection(projection);

      var codeToCountry;
      d3.json("./json/codeToCountry.json", function(error, thisCodeToCountry) {
        codeToCountry = thisCodeToCountry;
      });

      d3.select(window).on('resize.flatMap', resizeFlatMap);

      var emojiList;
      d3.json("./json/codeEmoji.json", function(error, thisEmojiList) {
        emojiList = thisEmojiList;
      });

      function getCenter(newPosition, objectCenter, toScale) {
        return (isZoomed ? 0 : (newPosition - (objectCenter * toScale)));
      }

      function zoomTo(scaleTo) {
        let mouse = d3.mouse(d3.event.currentTarget);
        currentZoomMouseX = mouse[0];
        currentZoomMouseY = mouse[1];

        mapGroup.transition()
          .duration(2000)
          .attr("transform", "translate(" + getCenter(width / 2, mouse[0], scaleZoomTo) + "," + getCenter(height / 2, mouse[1], scaleZoomTo) + ") scale (" + (isZoomed ? 1 : scaleZoomTo) + ")") //scaleZoomTo

        d3.select('#svg_map').selectAll("path")
          .attr("stroke-width", function() {
            return defaultMapBorder;
          });


        isZoomed = false;
        currentZoom = scaleZoomTo;
      }

      function zoomOut(scaleTo) {
        mapGroup.transition()
          .duration(2000)
          .attr("transform", "translate(" + 0 + "," + 0 + ") scale (" + 1 + ")")

        d3.select('#svg_map').selectAll("path")
          .attr("stroke-width", function() {
            return defaultMapBorder;
          });

        isZoomed = false;
      }

      function zoomIn() {
        var toZoomIn = false;

        if (currentZoom >= scaleWheelMin && currentZoom <= scaleWheelMax) {
          if (d3.event.wheelDelta == -120) {
            currentZoom = (currentZoom > scaleWheelMin) ? --currentZoom : currentZoom;
            toZoomIn = true;
          } else {
            currentZoom = (currentZoom < scaleWheelMax) ? ++currentZoom : currentZoom;
            toZoomIn = true;
          }


          if (toZoomIn) {
            mapGroup.transition()
              .duration(1000)
              .attr("transform", "translate(" + getCenter(width / 2, currentZoomMouseX, currentZoom) + "," + getCenter(height / 2, currentZoomMouseY, currentZoom) + ") scale (" + currentZoom + ")")

            d3.select('#svg_map').selectAll("path")
              .attr("stroke-width", function() {
                return defaultMapBorder;
              });
          }
        }

        d3.select('#svg_map').selectAll("path")
          .attr("stroke-width", function() {
            return defaultMapBorder;
          });

        isZoomed = false;
      }

      function resizeFlatMap() {
        var widthResized = window.innerWidth * .65;
        var heightResized = window.innerHeight * .85;

        mapSVG
          .attr("width", widthResized)
          .attr("height", heightResized);

        projection
          .translate([widthResized / 2, heightResized / 2.3])
          .scale(flatMapScale(window.innerWidth));

        d3.select('#svg_map').selectAll('path')
          .attr('d', path);
      }

      d3.json("../json/countries.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        mapGroup.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "cc" + (d.properties.iso_n3 / 1);
          })
          .attr("d", path)
          .attr("stroke", outlineDefault)
          .attr("stroke-width", defaultMapBorder)
          .on("mouseover", function(d) {
            d3.select(this)
              .attr("stroke", outlineHighlight)
              .style("fill", "green");
          })
          .on("mouseout", function() {
            d3.select(this)
              .attr("stroke", outlineDefault)
              .style("fill", fillDefault);
          })
          .append("svg:title")
          .text(function(d) {
            if (codeToCountry[(d.properties.iso_n3 / 1)]) {
              return (codeToCountry[(d.properties.iso_n3 / 1)]);
            }

            return "???";
          });


        scope.$watch('tweet', function(tweet) {
          if (tweet) {
            var latLngData = [
              [tweet.coordinates.long, tweet.coordinates.lat]
            ];

            mapGroup.append('circle')
              .data(latLngData)
              .attr("cx", function(d) {
                return projection(d)[0];
              })
              .attr("cy", function(d) {
                return projection(d)[1];
              })
              .attr("r", "300px")
              .attr("fill", moodScale(tweet.moodValue * 10))
              .style("fill-opacity", 0.5)
              .transition()
              .duration(2000)
              .attr("r", "3px")
              .attr("fill", moodScale(tweet.moodValue * 10))
              .style("fill-opacity", 0.3);

            var emojiX = projection(latLngData[0])[0];
            var emojiY = projection(latLngData[0])[1];


            var surrogate = tweet.emojis.map((emoji) => {
              return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
            });
            surrogate.forEach(function(surrogate) {
              if (emojiList[surrogate]) {
                mapGroup.append('image')
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
            });
          }
        })
      });
    }
  })