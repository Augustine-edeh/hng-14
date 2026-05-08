const plugins = {};

function optionalPlugin(name) {
  try {
    const runtimeRequire = eval("require");
    runtimeRequire.resolve(name);
    return {};
  } catch {
    return null;
  }
}

try {
  const tailwind = optionalPlugin("tailwindcss");
  if (tailwind) plugins.tailwindcss = tailwind;
} catch {
  // Keep dev server usable if dependencies were not installed yet.
}

try {
  const autoprefixer = optionalPlugin("autoprefixer");
  if (autoprefixer) plugins.autoprefixer = autoprefixer;
} catch {
  // Optional until npm install completes.
}

module.exports = { plugins };
