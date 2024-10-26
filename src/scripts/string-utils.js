const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

function findRequestId(text) {
  if (!text?.match(UUID_REGEX)) return null;

  return text.match(UUID_REGEX)[0];
}

// *20 space
// *40 @
// *27 '
// *3d =
// *2c ,
// *0a new line
// *7c |
// *2f /
function buildNewUrl(currentUrl, requestId) {
  const isFilterPresent = currentUrl.includes("filter");

  // filter @requestId='9d86af5e-e7e5-5e87-aa10-f0057389f99d'
  let replaceValue = `filter*20*40requestId*3d*27${requestId}*27`;

  if (isFilterPresent) {
    replaceValue += "*20and*20*0a";
    return currentUrl.replace(/filter\*20/, replaceValue);
  }

  replaceValue = `*0a*7c${replaceValue}~queryId~`;
  return currentUrl.replace(/~queryId~/, replaceValue);
}

module.exports = { buildNewUrl, findRequestId };
