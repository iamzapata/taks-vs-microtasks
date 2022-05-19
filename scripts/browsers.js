fs = require("fs")
const { chromium, firefox, webkit } = require("playwright")

const PAGE_URL = "http://localhost:1234"

const engines = [chromium, firefox, webkit]

engines.forEach(async (engine) => {
  try {
    const browser = await engine.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto(PAGE_URL)

    await page.locator("text=World!").click()

    const name = engine.name()
    const version = browser.version()

    await page
      .screenshot({ path: `src/browsers/screenshot-${name}-${version}.png` })

    const logs = await page.locator("#console-logs").innerHTML()

    let html = `<div class='browser-snapshot ${name}'> <h3>`
    html += name.slice(0, 1).toUpperCase() + name.slice(1)
    html += " Version: " + version
    html += "</h3>"
    html += "<ul>" + logs + "</ul>"
    html += "</div>"

    fs.writeFile(
      `src/browsers/${name}-Version-${version}.html`,
      html,
      function (err) {
        if (err) return console.log(err)
        console.log(`${name} html saved!`)
      }
    )

    await browser.close()
  } catch (e) {
    console.error(e)
  }
})
