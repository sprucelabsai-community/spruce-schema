const spruceSemanticRelease = require('@sprucelabs/semantic-release')

const config = spruceSemanticRelease({
	npmPublish: true
})

module.exports = config
