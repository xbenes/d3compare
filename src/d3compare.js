(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('d3compare', function() {
    'use strict';
    /* global d3 */


    var visualize = function(element, data, options) {

        // enrich options with defaults
        options = options || {
            color: '#ff0000'
        };

        // d3.js is a dependency, check whether d3 is loaded
        // abort if not found
        if (!d3) {
            console.log('Error: d3.js library not found!');
            return;
        }

        // check whether the user supplied an element for rendering
        // and whether the element is present in DOM
        if (!element || d3.select(element).empty()) {
            console.log('Error: element for rendering not found!');
            return;
        }

        // element present, measure its dimensions to fit in
        var el = d3.select(element);

        // clear the element first
        el.html('');

        var w = Math.max(0, parseInt(el.style('width'), 10)),
            h = Math.max(0, parseInt(el.style('height'), 10));

        // append necessary styles
        d3.select(element).append('style').html(
        ".d3compare-svg { font-family: Arial; font-size: 12px;} " +
        ".axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; } " +
        ".x.axis .tick line { display: none; } " +
        ".x.axis path {  display: none; } ");

        // extract values from data: set of month names supplied and
        // years from individual values
        var monthNames = data.map(function(d) { return d.monthName; });
        var years = data.map(function(d) {
            return d.values.map(function(v) {
                return v.year;
            });
        });

        // need numbers for further measures, keep them sorted
        var yearNames = d3.set(d3.merge(years)).values().map(function(y) {
            return +y;
        }).sort();


        // dimensions, margins hardcoded, currently sufficient
        var margin = {top: 20, right: 70, bottom: 30, left: 70};
        var width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        // shorten labels, if are too narrow, have a set of levels,
        // simple solution without real font measuring
        var maxLetters = Math.max.apply(Math, monthNames.map(function(m) {
            return m.length;
        }));
        // experimentally derived number of pixels per letter,
        // if shortened, we shorten to certain number of letters
        var pixelsPerLetter = 7,
            shortenTo = 3,
            labelMargin = 2;

        var largestLabelApproxWidth = maxLetters * pixelsPerLetter,
            shortenedLargestLabelApproxWidth = shortenTo * pixelsPerLetter;

        // label shortening constants
        var SHORTEN_NONE = 0,
            SHORTEN_IDX = 1,
            SHORTEN_CUSTOM = 2;

        var shorten = SHORTEN_NONE;

        // shortening logick, determine which shortening to use,
        // used later in tick formatter
        var requestedMargin = monthNames.length * 2 * labelMargin;
        if (width < monthNames.length * shortenedLargestLabelApproxWidth + requestedMargin) {
            shorten = SHORTEN_IDX;
        } else if (width < monthNames.length * largestLabelApproxWidth + requestedMargin) {
            shorten = SHORTEN_CUSTOM;
        }

        // scales and axes
        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1)
            .domain(monthNames);
        var x1 = d3.scale.ordinal()
            .domain(yearNames)
            .rangeRoundBands([0, x0.rangeBand()]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(data, function(d) {
                return d3.max(d.values, function(d) {
                    return d.value;
                });
            })]);

        var gradient = d3.scale.linear()
            .domain([Math.min.apply(Math, yearNames), Math.max.apply(Math, yearNames)])
            .range(['#000000', options.color]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient('bottom')
            .tickFormat(function(l, idx) {
                if (shorten === SHORTEN_CUSTOM) {
                    return l.substring(0, shortenTo);
                } else if (shorten === SHORTEN_IDX) {
                    return idx + 1;
                }
                return l;
            });

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(d3.format('.1f'));

        // prepare visualization
        var svg = d3.select(element)
            .append('svg')
            .classed('d3compare-svg', true)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height/2)
            .attr('y', -70)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Value');

        var monthBox = svg.selectAll('.monthBox')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'g')
            .attr('transform', function(d) {
                return 'translate(' + x0(d.monthName) + ',0)';
            });

        monthBox.selectAll('rect')
            .data(function(d) { return d.values; })
            .enter()
            .append('rect')
            .attr('class', function(d) {
                return 'bar-' + d.year;
            })
            .classed('value-bar', true)
            .attr('width', x1.rangeBand() - 1)
            .attr('x', function(d) {
                return x1(d.year);
            })
            .attr('y', function(d) {
                return y(d.value || 0);
            })
            .attr('height', function(d) {
                    return height - y(d.value || 0);
            })
            .style('fill', function(d) {
                return gradient(d.year);
            });

        var legend = svg.selectAll('.legend')
            .data(yearNames.slice().reverse())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

        // legend mouseover should fade inactive bars, if set via options flag
        if (options.legendMouse) {
            legend
            .on('mouseover', function(d) {
                svg.selectAll('.value-bar:not(.bar-' + d + ')').transition().style('fill', '#efefef').duration(200);
            })
            .on('mouseout', function() {
                svg.selectAll('.value-bar').transition().style('fill', function(d) {
                    return gradient(d.year);
                }).duration(200);
            });
        }

        legend.append('rect')
            .attr('x', width + 8)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', gradient);

        legend.append('text')
            .attr('x', width + 30)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'start')
            .text(function(d) { return d; });

    };

    return {
        visualize: visualize
    };

}));
