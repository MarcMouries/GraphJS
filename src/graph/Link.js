// =============================================================
//                          Link
// -------------------------------------------------------------
//  An edge between two nodes, carrying optional rendering metadata.
//
//   new Link(source, target, {
//     label: "Wife", type: "family",
//     color: "#58a6ff", width: 2.5, dashArray: "4,3",
//     opacity: 0.6, weight: 1, data: { caseId: 42 },
//   });
// =============================================================
export default class Link {
	constructor(source, target, attributes = {}) {
		if (source.id && target.id) {
			this.id = source.id + " → " + target.id;
		} else {
			this.id = source + " → " + target;
		}
		this.source = source;
		this.target = target;

		const attrs = attributes || {};
		this.label = attrs.label;
		this.type = attrs.type;
		this.color = attrs.color;
		this.width = attrs.width;
		this.dashArray = attrs.dashArray ?? null;
		this.opacity = attrs.opacity;
		this.weight = attrs.weight;
		// Free-form metadata bag for anything not covered above.
		this.data = attrs.data ?? {};
	}
}
