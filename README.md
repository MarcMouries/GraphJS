# GraphJS

GraphJS is a framework for representing and displaying graphs in JavaScript. 

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
  <thead>
    <tr>
      <th>Org Chart</th>
      <th>Forced Layout</th>
      <th>Radial Layout</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Name</td><td>John Doe </td></tr><tr><td>Location</td><td>The Fox Hollow </td></tr>
    <tr><td>Priority</td><td>Urgent </td></tr><tr><td>Phonenumber</td><td>123-456-7890 </td></tr>
    <tr><td>Address</td><td>7725 Jericho Turnpike </td></tr>
  </tbody>
</table>

<table>
	<tr>
		<td>
			<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/6n-graf.svg/250px-6n-graf.svg.png">
			<p>This is a graph</p>
		</td>
		<td>
			<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Multigraph.svg/125px-Multigraph.svg.png">
			<p>This is a Multigraph</p>
		</td>
	</tr>

</table>
