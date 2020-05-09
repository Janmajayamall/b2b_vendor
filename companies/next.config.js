const assetPrefix = process.env.BUILDING_FOR_NOW ? "/companies" : ""

module.exports = {
    assetPrefix,
    env: {
        ASSET_PREFIX: assetPrefix
    }
}
