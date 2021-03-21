/**
 * Get Id for a given self link
 * @param url
 */
export function getId(url: string) {
  url = clearUrl(url);
  return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * With self links there are projection information attached to it. This will block a direct url call. Clean those unwanted url things with this
 * @param url
 */
export function clearUrl(url: string) {
  let paraStart = url.indexOf('{?');
  if (paraStart > 0) url = url.substring(0, paraStart);
  return url;
}

/*** Extract the given feild given as a string path from the object */
export function getValueByField(path: string, obj: any, separator: string = '.') {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}
