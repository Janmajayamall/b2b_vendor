const assetPrefix = process.env.BUILDING_FOR_NOW ? "/buyers" : ""

module.exports = {
    assetPrefix,
    env: {
        ASSET_PREFIX: assetPrefix
    }
}
