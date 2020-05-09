const assetPrefix = process.env.BUILDING_FOR_NOW ? "/vendors" : ""

module.exports = {
    assetPrefix,
    env: {
        ASSET_PREFIX: assetPrefix
    }
}
