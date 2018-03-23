/**
 * A bookmarklet to help create pull requests in a consistent mannner
 */
javascript: (function() {
	function getPullRequestUrl() {
		return prompt('Enter pull request URL');
	}

	function getTestingSteps() {
		var pullRequest = getPullRequestUrl();
		return `*Pull Request:*\n
${pullRequest}\n\n
*Testing steps:*\n
# Pull down the pull request branch.\n
# buildredemption refresh\n
# Open the .xcworkspace file, Clean and Run\n
# `;
	}

	function init() {
		var textarea;
		textarea = document.getElementById('customfield_10290');
		textarea.value = getTestingSteps();
		textarea.style.height = '370px';
	}

	init();

}());
