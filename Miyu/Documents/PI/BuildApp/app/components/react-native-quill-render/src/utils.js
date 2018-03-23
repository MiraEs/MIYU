function contains(insert, chunk) {
	return insert.indexOf(chunk) !== -1;
}

function expandBlots(blots) {
	const expanded = [];
	blots.forEach(blot => {
		if (blot.insert.replace(/\n/g, '') === '' || !contains(blot.insert, '\n')) {
			expanded.push(blot);
		} else {
			const splits = blot.insert.split('\n');
			splits.forEach((chunk, index) => {
				if (chunk) {
					const newLine = splits.length - 1 === index ? '' : '\n';
					expanded.push({
						insert: `${chunk}${newLine}`,
					});
				} else {
					expanded.push({
						insert: '\n',
					});
				}
			});
		}
	});
	return expanded;
}

function splitIntoBlocks(expandedBlots) {
	const blocks = [];
	let block = [];


	expandedBlots.forEach(blot => {
		if (contains(blot.insert, '\n')) {
			block.push(blot);
			blocks.push(block);
			block = [];
		} else {
			block.push(blot);
		}
	});

	// do some final clean up
	if (block.length) {
		blocks.push(block);
	}
	return blocks;
}

export default {
	contains,
	expandBlots,
	splitIntoBlocks,
};
