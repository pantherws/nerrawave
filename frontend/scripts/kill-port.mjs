import { execSync } from "node:child_process"

const port = process.argv[2] ?? "3000"

if (process.platform === "win32") {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
      shell: true,
    })
    const pids = new Set()
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue
      const parts = line.trim().split(/\s+/)
      const procId = parts[parts.length - 1]
      if (procId && /^\d+$/.test(procId)) pids.add(procId)
    }
    for (const procId of pids) {
      console.log(`Stopping PID ${procId} on port ${port}…`)
      execSync(`taskkill /PID ${procId} /F`, { stdio: "inherit", shell: true })
    }
    if (pids.size === 0) console.log(`No listener on port ${port}.`)
  } catch {
    console.log(`No listener on port ${port}.`)
  }
} else {
  execSync(`npx --yes kill-port ${port}`, { stdio: "inherit", shell: true })
}
