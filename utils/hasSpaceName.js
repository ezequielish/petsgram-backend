function hasName(name) {
  if (name.includes(" ")) {
    const result = name.replace(" ", "-");

    return result;
  }
  return name;
}

module.exports = hasName;
