angular.module('omniMood')
  .directive('globe', function () {
    return {
      restrict: 'E',
      templateUrl: '../views/globe.html',
      link: link
    };

    function link (scope, element, attr) {
      var width = 800,
          height = 700,
          velocity = ['.007', 0],
          rotate = [180, 0],
          time = Date.now(),
          timer_ret_val = false,
          countryById,
          mouseCoords,
          rotateCoords;

      var projection = d3.geoOrthographic()
        .translate([width / 2, height / 2])
        .scale(250)
        .clipAngle(90)
        .precision(0.1)
        .rotate(rotate);

      var path = d3.geoPath()
        .projection(projection);

      var drag = d3.drag()
        .on('start', function () {
          timer_ret_val = true;
          var proj = projection.rotate();
          mouseCoords = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
          rotateCoords = [-proj[0], -proj[1]];
        })
        .on('drag', function () {
          if(mouseCoords) {
            var mouseCoords2 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
            var rotateCoords2 = [rotateCoords[0] + (mouseCoords[0] - mouseCoords2[0])/4, rotateCoords[1] + (mouseCoords2[1] - mouseCoords[1])/4];
            projection.rotate([-rotateCoords2[0], -rotateCoords2[1]]);
          }

          path = d3.geoPath().projection(projection)
          d3.select('.globe').selectAll('path')
            .attr('d', path);
        });

      var svg = d3.select(element[0]).select('.globeContainer')
        .append('svg')
        .attr('class', 'globe')
        .attr('width', width)
        .attr('height', height)
        .call(drag)
        .call(autoRotateGlobe);

      var features = svg.append('g');

      features.append('path')
        .datum({ type: 'Sphere' })
        .attr('class', 'background')
        .attr('d', path);

      var graticule = d3.geoGraticule();

      features.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path);

      var countryToolTip = d3.select(element[0])
        .select('.globeContainer')
        .append('div')
        .attr('class', 'countryToolTip')
        .style('position', 'absolute');

      d3.json('../json/world-50m.json', function (err, world) {
        countries = topojson.feature(world, world.objects.countries).features;

        drawCountries('country', countries);
      });

      function drawCountries(className, countries) {
        var set = features.selectAll('.' + className)
          .data(countries)
          .enter().append('g')
          .attr('class', className)
          .attr('id', function (d) {
            return 'cc' + d.id;
          })
          .on('mouseover', function (d) {
            countryToolTip.text([d.id])
              .style('left', (d3.event.pageX + 7) + 'px')
              .style('top', (d3.event.pageY - 15) + 'px')
              .style('display', 'block')
              .style('opacity', 1);
          })
          .on('mouseout', function (d) {
            countryToolTip
              .style('opacity', 0)
              .style('display', 'none');
          })
          .on('mousemove', function (d) {
            countryToolTip
              .style('left', (d3.event.pageX + 10) + 'px')
              .style('top', (d3.event.pageY - 10) + 'px');
          })
          .on('click', function (d) {
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
          .tween('rotate', function () {
            var r = d3.interpolate(projection.rotate(), coords);
            return function (t) {
              projection.rotate(r(t));
              svg.selectAll('path')
                .attr('d', path);
            };
          })
          .transition();
      }

      function autoRotateGlobe() {
        d3.timer(function () {
          if(!timer_ret_val) {
            var dt = Date.now() - time;
            projection.rotate([rotate[0] + velocity[0] * parseFloat(dt) - 100, rotate[1] + velocity[1] * parseFloat(dt)]);
            svg.selectAll('path').attr('d', path);
          }
          return timer_ret_val;
        });
      }
    }
  });