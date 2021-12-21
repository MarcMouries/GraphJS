export default class Link {
	constructor(source, target) {
		if (source.id & target.id) {
			this.id = source.id + "-" + target.id;
		}
		else {
			this.id = source + "-" + target;
		}
		this.source = source;
		this.target = target;
	}
}
