module.exports = function (api) {
    api.cache(true); // Cache is set before any configuration

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ['react-native-worklets-core/plugin'],
        ],
    };
};