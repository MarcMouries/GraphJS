// =============================================================
//  Minimal headless SVG renderer for the examples.
// -------------------------------------------------------------
//  Reads node.x / node.y (set by any GraphJS layout) plus the graph's links
//  and returns a self-contained SVG document string. Pure string building —
//  no DOM — so it runs under `bun`/Node and the output can be written straight
//  to a .svg file for the README.
// =============================================================

const escapeXml = (s) =>
	String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

export function renderGraphSVG(graph, options = {}) {
	const nodes = graph.getNodes();
	// Use the graph's links, or derive parent→child edges for tree structures.
	let links = graph.linkList && graph.linkList.length ? graph.linkList : [];
	if (!links.length) {
		for (const n of nodes) for (const c of n.children || []) links.push({ source: n, target: c });
	}

	const padding = options.padding ?? 70;
	const radius = options.radius ?? 20;
	const background = options.background ?? "#0d1117";
	const linkColor = options.linkColor ?? "#30363d";
	const labelColor = options.labelColor ?? "#e6edf3";
	const defaultFill = options.nodeFill ?? "#1f6feb";
	const nodeFill = options.nodeFill instanceof Function ? options.nodeFill : () => defaultFill;
	const nodeRadius = options.nodeRadius instanceof Function ? options.nodeRadius : () => radius;
	const label = options.label ?? ((n) => (n.data && n.data.name) || n.id);
	const showLinkLabels = options.showLinkLabels ?? false;

	// Fit the content to a padded box, shifting every coordinate into positive space.
	const xs = nodes.map((n) => n.x);
	const ys = nodes.map((n) => n.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const width = Math.round(maxX - minX + padding * 2);
	const height = Math.round(maxY - minY + padding * 2);
	const X = (n) => (n.x - minX + padding).toFixed(1);
	const Y = (n) => (n.y - minY + padding).toFixed(1);

	const parts = [];
	parts.push(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="-apple-system, Segoe UI, Roboto, sans-serif">`,
	);
	parts.push(`<rect width="${width}" height="${height}" rx="10" fill="${background}"/>`);

	// Links
	for (const link of links) {
		const s = link.source;
		const t = link.target;
		if (!s || !t) continue;
		const color = link.color || linkColor;
		const w = link.width || 1.5;
		const dash = link.dashArray ? ` stroke-dasharray="${link.dashArray}"` : "";
		parts.push(`<line x1="${X(s)}" y1="${Y(s)}" x2="${X(t)}" y2="${Y(t)}" stroke="${color}" stroke-width="${w}"${dash}/>`);
		if (showLinkLabels && link.label) {
			const mx = ((Number(X(s)) + Number(X(t))) / 2).toFixed(1);
			const my = ((Number(Y(s)) + Number(Y(t))) / 2).toFixed(1);
			parts.push(
				`<text x="${mx}" y="${my}" fill="${labelColor}" font-size="10" text-anchor="middle" dy="-3" opacity="0.8">${escapeXml(link.label)}</text>`,
			);
		}
	}

	// Nodes
	for (const node of nodes) {
		const r = nodeRadius(node);
		parts.push(
			`<circle cx="${X(node)}" cy="${Y(node)}" r="${r}" fill="${nodeFill(node)}" stroke="#0d1117" stroke-width="2"/>`,
		);
		parts.push(
			`<text x="${X(node)}" y="${Y(node)}" fill="${labelColor}" font-size="11" text-anchor="middle" dy="${r + 14}">${escapeXml(label(node))}</text>`,
		);
	}

	parts.push(`</svg>`);
	return parts.join("\n");
}
