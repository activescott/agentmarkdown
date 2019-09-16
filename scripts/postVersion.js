const fs = require("fs")
const path = require("path")

function loadPackage() {
  const packagePath = path.join(__dirname, "..", "package.json")
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"))
  if (pkg.name !== "agentmarkdown")
    throw new Error(
      `Expected package name to be agentmarkdown but found "${pkg.name}".`
    )
  return pkg
}

function writePkg(packageJson) {
  const pkgInfoPath = path.join(__dirname, "..", "src", "pkg.json")
  fs.writeFileSync(pkgInfoPath, JSON.stringify(packageJson, null, 2), "utf8")
}

const pkg = loadPackage()
writePkg(pkg)
