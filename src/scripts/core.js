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
    // remove any filter then apply only requestId filter
    replaceValue += "*20*0a*7c";
    return currentUrl.replace(/filter\*20(.*)\*7c/, replaceValue);
  }

  replaceValue = `*0a*7c${replaceValue}~queryId~`;
  return currentUrl.replace(/~queryId~/, replaceValue);
}

const bubbleDOM = document.createElement("div");
const anchorDOM = document.createElement("a");

bubbleDOM.appendChild(anchorDOM);
document.body.appendChild(bubbleDOM);
bubbleDOM.classList.add("selection_bubble");
bubbleDOM.classList.add("triangle-isosceles");

function renderBubble(mouseX, mouseY) {
  bubbleDOM.style.top = mouseY + "px";
  bubbleDOM.style.left = mouseX + "px";
  bubbleDOM.style.visibility = "visible";
}

function updateAnchor(href, text) {
  anchorDOM.href = href;
  anchorDOM.textContent = text;
  anchorDOM.target = "_blank";
}

function initExtension() {
  const iframe = document.getElementById("microConsole-Logs");
  console.debug("iframe1", iframe);
  if (!iframe) return false;

  iframe.contentWindow.document.addEventListener("mouseup", function (e) {
    var win = iframe.contentWindow;
    var doc = win.document;

    let selection;
    if (win.getSelection) {
      selection = win.getSelection().toString();
    } else if (doc.selection && doc.selection.createRange) {
      selection = doc.selection.createRange().text;
    }
    console.debug("selection", selection);
    if (selection) {
      const requestId = findRequestId(selection);
      console.debug("requestId", requestId);

      if (requestId) {
        const currentUrl = window.location.href;
        const newUrl = buildNewUrl(currentUrl, requestId);
        console.debug("newUrl", newUrl);

        updateAnchor(newUrl, `New tab @requestId=${requestId}`);
        renderBubble(e.clientX, e.clientY);
      }
    }
  });

  iframe.contentWindow.document.addEventListener(
    "mousedown",
    function (e) {
      if (e.target !== anchorDOM) {
        bubbleDOM.style.visibility = "hidden";
      }
    },
    false
  );
  return true;
}

function attachEvent() {
  const iframe = document.getElementById("microConsole-Logs");

  console.debug("iframe2", iframe);
  if (!iframe) return false;

  const runQueryButton = iframe.contentWindow.document.querySelector(
    "div.query-workspace button[data-testid='scroll-run-query']"
  );
  console.debug("runQueryButton", runQueryButton);
  if (!runQueryButton) return;

  runQueryButton.addEventListener("click", function () {
    if (initExtension()) {
      console.debug("Extension is running");
    }
  });
  return true;
}

window.addEventListener("load", function () {
  const maxtries = 60;
  console.debug("onload");
  let tries = 0;
  const intervalID = setInterval(() => {
    document
      .getElementById("microConsole-Logs")
      .addEventListener("load", function () {
        console.debug("iframe loaded");
      });
    console.debug("try attachEvent");
    if (attachEvent() || tries >= maxtries) {
      clearInterval(intervalID);
      console.debug("attached!");
    } else {
      console.debug("failed!" + tries);
    }
    tries++;
  }, 5000);
});
