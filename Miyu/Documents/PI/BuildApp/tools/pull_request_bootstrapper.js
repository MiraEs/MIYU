/**
 * A bookmarklet to help create pull requests in a consistent mannner
 */
javascript: (function() {

	if (!window.$) {
		alert('jQuery is missing. Time to refactor.');
	}

	function get(selector) {
		try {
			return $(selector);
		} catch (error) {
			return {};
		}
	}

	var id = get('.js-select-button').filter('[title*="compare"]').text().toUpperCase(),
		title = prompt('What change does this introduce?'),
		pullInfo = '### JIRA\nhttps://jira.impdir.com/browse/' + id;

	get('#pull_request_body').val(pullInfo);
	get('#pull_request_title').val([id, title].join(' - '));
	get('[name="issue[body]"]').val(pullInfo);

}());
