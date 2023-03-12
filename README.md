# GraphJS
[![npm](https://img.shields.io/npm/v/graphjs.svg)](https://www.npmjs.com/package/graphjs)
[![release](https://img.shields.io/github/v/release/marcmouries/Graphjs?include_prereleases)](https://img.shields.io/github/v/release/marcmouries/Graphjs?include_prereleases)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/marcmouries/GraphJS?style=plastic)

GraphJS is a framework for easily representing and displaying graphs in JavaScript. 

## Objective

Very easy to use.

```JavaScript

// Load the graph
let graph = new graphJS.Graph();
graph.loadJSON(json_graph);

// Display the graph
let chart = new graphJS.Chart( graph );
let layout = new graphJS.ForceDirected( graph );
chart.display();

```

<table id="result_table" class="result_table">
  <caption></caption>
  <thead><tr><th>Org Chart</th>          <th>Forced Layout</th>          <th>Radial Layout</th></tr></thead>
  <tbody>
    <tr>
	<td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Departments_in_advertising_agencies.jpg/440px-Departments_in_advertising_agencies.jpg"></td>
	<td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/SocialNetworkAnalysis.png/500px-SocialNetworkAnalysis.png"></td>	
	<td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Radial-graph-schematic.svg/400px-Radial-graph-schematic.svg.png"></td>
    </tr>
  </tbody>
</table>
