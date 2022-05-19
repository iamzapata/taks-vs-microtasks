const fs = require("fs")
const path = require("path")
const parse = require("node-html-parser").parse

try {
  const allFiles = fs.readdirSync("src/browsers")
  const fileNames = []

  allFiles.forEach((file) => {
    const filename = path.join("src/browsers", file)

    if (filename.endsWith("html")) {
      fileNames.push(filename)
      console.log("found html file: ", filename)
    }
  })

  let html = ""

  fileNames.forEach((file) => {
    const fileContents = fs.readFileSync(file, "utf8")
    const engine = file.split("src/browsers/")[1]
    console.log("getting contents from: ", engine)

    html += fileContents
  })

  fs.readFile("src/index-template.html", "utf8", (err, index) => {
    if (err) {
      throw err
    }

    const root = parse(index)

    const container = root.getElementById("browsers-list")
    container.appendChild(parse(html))

    console.log(root.toString())

    fs.writeFile(`src/index.html`, root.toString(), function (err) {
      if (err) return console.log(err)
      console.log(`index.html generated!`)
    })
  })

} catch (err) {
  console.error(err)
}
