angular.module('omniMood')
  .directive('globe', function() {
      return {
        restrict: 'E',
        scope: {
          tweet: '=',
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
          rotateCoords,
          moodMin = -10,
          moodMid = 0,
          moodMax = 10;

        var projection = d3.geoOrthographic()
          .translate([width / 2, height / 2])
          .scale(245)
          .clipAngle(90)
          .precision(0.1)
          .rotate(rotate);

        var path = d3.geoPath()
          .projection(projection)
          .pointRadius(2);

        var moodScale = d3.scaleLinear()
          .domain([moodMin, moodMid, moodMax])
          .range(["red", "yellow", "green"]);

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
              .attr('d', path.pointRadius(2));
          });

        var svg = d3.select(element[0])
          .append('svg')
          .attr('class', 'globe')
          .attr('width', width)
          .attr('height', height)
          .call(drag)
          .call(autoRotateGlobe);

        var features = svg.append('g')
          .attr('class', 'globe-group');

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

        var countryList = d3.select('.sideBar')
          .append('select')
          .attr('class','countryList');

        var countryToolTip = d3.select(element[0])
          .append('div')
          .attr('class', 'countryToolTip')
          .style('position', 'absolute');

        d3.json('../json/countries.json', function(err, world) {
          countries = topojson.feature(world, world.objects.countries).features;
          countries.sort(function (a, b) {
            return a.properties.name > b.properties.name ? 1 : -1;
          });

          countryList.append('option')
          .text('Choose a country')
          .attr('disabled', true);

          countries.forEach(function(country) {
            countryById[country.properties.iso_n3] = country.properties.name;
            option = countryList.append('option');
            option.text(country.properties.name);
            option.property('value', country.properties.iso_n3);
          });

          drawCountries('country', countries);
        });

        scope.$watch('tweet', function(tweet) {
          if (tweet) {
              // console.log(tweet.coordinates);
            var coordArr = [];
            coordArr.push(tweet.coordinates);
            svg.selectAll('path.ping')
              .data(coordArr)
              .enter()
              .append('path', '.ping')
              .datum(function(d) {
                return {
                  type: 'Point',
                  coordinates: [d.long, d.lat],
                };
              })
              .style('fill', moodScale(tweet.moodValue*10))
              .style('fill-opacity', 0.2)
              .style('stroke-width', 5)
              .style('stroke-opacity', 0.1)
              .style('stroke', moodScale(tweet.moodValue*10))
              .attr('d', path.pointRadius(2));
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
                .style('left', (d3.event.pageX + 7) + 'px')
                .style('top', (d3.event.pageY + 10) + 'px')
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
                .style('left', (d3.event.pageX + 7) + 'px')
                .style('top', (d3.event.pageY + 10) + 'px');
            })
            .on('click', function(d) {
              d3.selectAll('.selected')
                .classed('selected', false);
              d3.select(this)
                .select('path')
                .classed('selected', true);
              rotateToFocus(d);
              countryList.property('value', this.id.slice(2));
            });

          set.append('path')
            .attr('class', 'land')
            .attr('d', path);

          set.append('path')
            .attr('class', 'overlay')
            .attr('d', path);

          countryList
            .on('change', function () {
              var selectedCountryId = countryList.node().value;
              var selectedCountry = getSelectedCountry(countries, selectedCountryId);
              d3.selectAll('.selected')
                .classed('selected', false);
              var selectedNode = d3.select('g#cc' + selectedCountryId).node();
              d3.select(selectedNode)
                .select('path')
                .classed('selected', true);
              rotateToFocus(selectedCountry);
            });

          return set;
        }

        function getSelectedCountry(countries, id) {
          for(var i = 0; i < countries.length; i++) {
            if(countries[i].properties.iso_n3 === id)
              return countries[i];
          }
        }

        function rotateToFocus(d) {
          timer_ret_val = true;
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

        function getCountryInfo() {
          var w = width;
          var h = height;
          var centroid = path.centroid(d);
          var x = w / 2 - centroid[0];
          var y = h / 2 - centroid[1];

          countryId = "path#cc" + d.properties.iso_n3;

          mapSVG
            .append("g")
            .attr("id", "countryInfo-wrapper");

          d3.select("g#map-container")
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
        }
      }
    });