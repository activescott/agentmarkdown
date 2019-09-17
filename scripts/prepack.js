const fs = require("fs")
const path = require("path")
const execSync = require("child_process").execSync

// All this is to support AgentMarkdown.version. All the shenanigans is due to the fact that if we reference package.json directly from TS, tsc puts it in the /dist folder. When `npm pack` finds package.json in the dist folder it stops including whole directories (interestingly `yarn pack` doesn't have this issue).

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
  console.log(`Updating src/pkg.json to version ${packageJson.version}...`)
  const pkgInfoPath = path.join(__dirname, "..", "src", "pkg.json")
  fs.writeFileSync(pkgInfoPath, JSON.stringify(packageJson, null, 2), "utf8")
}

function rebuild() {
  console.log("Running yarn build to rebuild package with new pkg.json...")
  execSync("yarn run build", { cwd: path.join(__dirname, "..") })
  console.log("Running yarn build complete.\n")
}

const pkg = loadPackage()
writePkg(pkg)
rebuild() // rebuild so tsc incorporates the pkg.json into the compiled dist/ files
