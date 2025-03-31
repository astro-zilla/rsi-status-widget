// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: server;
async function getRSIStatus(webview) {
    let js = `
    var summary = document.querySelector(".summary")

    var res = {
        text: summary.firstChild.textContent.trim(),
        time: summary.querySelector(".summary__date").title,
        color: window.getComputedStyle(summary).backgroundColor
    }
    res
    `
    let res = await webview.evaluateJavaScript(js)
    const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
    res.color=rgb2hex(res.color)
    return res
}

let webview = new WebView()
await webview.loadURL("https://status.robertsspaceindustries.com")
const status = await getRSIStatus(webview)
let widget = new ListWidget()

let statusTitle = widget.addText(status.text)
widget.addSpacer()
let statusTime = widget.addText("Last updated: "+status.time)
statusTitle.font = Font.boldSystemFont(36)
statusTitle.centerAlignText()
statusTime.font = Font.systemFont(16)
statusTime.centerAlignText()
widget.backgroundColor = new Color(status.color)
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}

Script.complete()
