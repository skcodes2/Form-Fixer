// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Extend the asset extensions to include '.tflite'
config.resolver.assetExts = ['tflite', ...(config.resolver.assetExts || [])];

module.exports = config;
