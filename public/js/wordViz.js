console.log("wordViz.js connected")

fetch("https://api.datamuse.com/words?rel_trg=power")
  .then(response => response.json()).then(response => {
    let data = response;
    // console.log(data);
    return data;
  }).then(data => {

    let scores = data.map(word => word.score).sort((a, b) => a > b);
    let minRange = scores[scores.length - 1];
    let maxRange = scores[0];

    // console.log(minRange, maxRange);

    const width = 500;
    const height = 500;

    const svg = d3.select('#viz')
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", "translate(0,0)");

    const radiusScale = d3.scaleSqrt().domain([minRange, maxRange]).range([10, 70])

    const simulation = d3.forceSimulation()
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collide", d3.forceCollide(function (d) {
        return radiusScale(d.score)
      }))

    d3.queue()
      // .defer(d3.json, data)
      .await(ready);

    function ready(error, datapoints) {
      const circles = svg.selectAll(".circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("r", function (d) {
          return radiusScale(d.score)
        })
        .attr("fill", "gray")
        .on("click", function (d) {
          console.log(d.word);
        })

      simulation.nodes(data).on('tick', ticked);

      function ticked() {
        circles
          .attr('cx', function (d) {
            return d.x
          })
          .attr("cy", function (d) {
            return d.y
          })
      }
      //end of ready()
    }
    //end of .then(data)
  })

