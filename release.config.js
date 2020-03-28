const spruceSemanticRelease = require('@sprucelabs/semantic-release')

const config = spruceSemanticRelease.default({
	config: spruceSemanticRelease.ReleaseConfiguration.Package
})

module.exports = config
