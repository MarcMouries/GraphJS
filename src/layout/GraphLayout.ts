import Graph from "../graph/Graph";
import Node from "../graph/Node";


        export default abstract class GraphLayout {
            constructor(shapeType, x, y, width, height) {        }

            calculate_Positions (graph: Graph, starting_vertex: Node, center: string) : void {
                console.error("not implemented")
            }
        }