import { rmSync } from "node:fs"
import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const DEV_PORT = process.env.PORT ?? "3000"

console.log(`Stopping anything on port ${DEV_PORT}…`)
execSync(`node scripts/kill-port.mjs ${DEV_PORT}`, { cwd: webRoot, stdio: "inherit" })

console.log("Removing .next cache…")
rmSync(join(webRoot, ".next"), { recursive: true, force: true })

console.log(`Starting Next.js dev on http://localhost:${DEV_PORT} …`)
const child = spawn(`npx next dev -p ${DEV_PORT}`, {
  cwd: webRoot,
  stdio: "inherit",
  shell: true,
})

child.on("exit", (code) => process.exit(code ?? 0))
