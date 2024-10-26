import buildNewUrl from "./string-utils";
import findRequestId from "./string-utils";

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
  console.log("iframe1", iframe);
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
    console.log("selection", selection);
    if (selection) {
      const requestId = findRequestId(selection);
      console.log("requestId", requestId);

      if (requestId) {
        const currentUrl = window.location.href;
        const newUrl = buildNewUrl(currentUrl, requestId);
        console.log("newUrl", newUrl);

        updateAnchor(newUrl, `New tab by @requestId=${requestId}`);
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

  console.log("iframe2", iframe);
  if (!iframe) return false;

  const runQueryButton = iframe.contentWindow.document.querySelector(
    "div.query-workspace button[data-testid='scroll-run-query']"
  );
  console.log("runQueryButton", runQueryButton);
  if (!runQueryButton) return;

  runQueryButton.addEventListener("click", function () {
    if (initExtension()) {
      console.log("Extension is running");
    }
  });
  return true;
}

window.addEventListener("load", function () {
  const maxtries = 30;
  console.log("onload");
  let tries = 0;
  const intervalID = setInterval(() => {
    document
      .getElementById("microConsole-Logs")
      .addEventListener("load", function () {
        alert("iframe loaded");
      });
    console.log("try attachEvent");
    if (attachEvent() || tries >= maxtries) {
      clearInterval(intervalID);
      console.log("attached!");
    } else {
      console.log("failed!" + tries);
    }
    tries++;
  }, 5000);
});
