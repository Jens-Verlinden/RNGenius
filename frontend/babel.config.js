// Configuration for Babel, a transpiler that converts modern JavaScript code into a backwards-compatible version of JavaScript that can run in older environments
module.exports = function (api) {
  // Enables caching of the configuration for better performance
  api.cache(true);

  // Return the configuration object
  return {
    // Presets tell Babel how to transform the code
    presets: [
      'babel-preset-expo' // This preset is specific for Expo projects, providing necessary transformations and optimizations
    ],
    plugins: [
      'nativewind/babel' // This plugin allows the use of NativeWind, enabling Tailwind CSS utility classes in React Native projects
    ]
  };
};
