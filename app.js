'use strict';

var app = angular.module('d3App', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'index.html',
            controller: 'd3Ctrl'
        })
});

app.controller('d3Ctrl', ['$scope', '$routeParams', '$route', function ($scope, $routeParams, $route) {
        console.log("Inside Controller");

        setTimeout(function () {
            "waiting for ui to load"
        }, 4000);

        var width = 900,
            height = 600;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .size([width, height])
            .charge(-1500)
            .linkDistance(200)
            .on("tick", tick);


        var drag = force.drag()
            .on("dragstart", dragstart);


        var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);


        var graph = document.getElementById('mainSvg');


        d3.json("microservices.json", function (error, graph) {
            if (error) throw error;

            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = svg.selectAll(".link").data(graph.links)
                .enter().append("line")
                .attr("class", "link");


            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr('cx', function (d) {
                    return d.x;
                })
                .attr('cy', function (d) {
                    return d.y;
                })
                .call(force.drag);

            node.append("circle")
                .attr("class", "node")
                .attr("r", (function (d) {
                    return d.size
                }))
                .on("dblclick", dblclick)
                .call(drag);

            node.append("text")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.name
                });


            force.on("tick", function () {
                link.attr("x1", function (d) {
                    return d.source.x;
                })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
                d3.selectAll("circle").attr("cx", function (d) {
                    return d.x;
                })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                d3.selectAll("text").attr("x", function (d) {
                    return d.x;
                })
                    .attr("y", function (d) {
                        return d.y;
                    });


            });

        });


        function tick(e) {
            var k = 6 + e.alpha;

            link.each(function (d) {
                d.source.y -= k, d.target.y += k;
            })
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }

        function mouseover() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 20);
        }

        function mouseout(d) {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 10);
        }

        function dblclick(d) {
            getDetails(d.name);
            d3.select(this).classed("fixed", d.fixed = false);
            document.getElementById('modal-slideright').className = "modal fade modal-slideright ng-scope in";
            document.getElementById('modal-slideright').style.display = "block";
            console.log("Displaying Modal");
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }


    }]
);