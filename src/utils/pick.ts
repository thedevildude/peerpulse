/**
 * Pick the keys from the object
 * @param {object} obj - The object to pick from
 * @param {string[]} keys - The keys to pick
 * @returns {object} - The object with the picked keys
 */

const pick = (obj: object, keys: string[]): object => {
  return keys.reduce<{ [key: string]: unknown }>((finalObj, key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key as keyof typeof obj];
    }
    return finalObj;
  }, {});
};

export default pick;
