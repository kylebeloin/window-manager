// takes an instance of a class and returns an object with the class's properties and methods
// @ts-check

/**
 * @param {Object} instance
 * @returns {Object}
 */
export const getClassProperties = (instance) => {
  const proto = Object.getPrototypeOf(instance);
  const keys = Object.getOwnPropertyNames(proto);
  const properties = {};
  for (const key of keys) {
    properties[key] = instance[key];
  }
  return properties;
};
