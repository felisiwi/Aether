#!/usr/bin/env node
/**
 * Aether CLI — interactive menu for git, dev, and build tasks.
 * Run: npm run aether
 */

import readline from 'node:readline'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPO_ROOT = join(__dirname, '..')

function runGit(args, { printStdout = true } = {}) {
  const r = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
  })
  if (r.error) {
    console.error(`Error: ${r.error.message}`)
    return { ok: false, out: '' }
  }
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || '').trim()
    console.error(err || `git exited with code ${r.status}`)
    return { ok: false, out: '' }
  }
  const out = (r.stdout || '').trimEnd()
  if (printStdout && out) console.log(out)
  return { ok: true, out }
}

function runNpmScript(script, label) {
  console.log(`\n→ ${label} (npm run ${script})…\n`)
  const r = spawnSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', script],
    {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      shell: false,
    },
  )
  if (r.error) {
    console.error(`Error: ${r.error.message}`)
    return false
  }
  if (r.status === 0) {
    console.log(`\n✓ ${label} finished successfully.\n`)
    return true
  }
  console.error(`\n✗ ${label} failed (exit ${r.status}).\n`)
  return false
}

function runDevServer() {
  console.log('\n→ Starting dev server (npm run dev)…')
  console.log('  Press Ctrl+C to stop and return to the menu.\n')
  return new Promise((resolve) => {
    const child = spawn(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        shell: false,
      },
    )
    child.on('close', (code) => {
      console.log(`\nDev server exited (code ${code ?? 0}).\n`)
      resolve()
    })
  })
}

function promptLine(rl, q) {
  return new Promise((resolve) => {
    rl.question(q, resolve)
  })
}

function parseBranches(output) {
  return output
    .split('\n')
    .map((line) => line.replace(/^\*?\s+/, '').trim())
    .filter(Boolean)
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    while (true) {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║  Aether — project menu                                   ║
╠══════════════════════════════════════════════════════════╣
║  Git                                                     ║
║    1. Save current work (git add -A + commit)            ║
║    2. Push to GitHub (git push)                          ║
║    3. Save and push (commit + push)                      ║
║    4. View save history (git log --oneline -10)          ║
║    5. View current status (git status)                   ║
║    6. Switch branch (pick from list)                     ║
║    7. Create new branch                                  ║
║                                                          ║
║  Dev                                                     ║
║    8. Start dev server (npm run dev)                     ║
║    9. Type check (tsc --noEmit)                          ║
║   10. Build for production (vite build)                  ║
║                                                          ║
║  Deploy                                                  ║
║   11. Deploy to Railway + Vercel                         ║
║                                                          ║
║    0. Exit                                               ║
╚══════════════════════════════════════════════════════════╝
`)
      const raw = await promptLine(rl, 'Enter choice [0–11]: ')
      const choice = raw.trim()

      if (choice === '0') {
        console.log('Goodbye.\n')
        break
      }
      if (choice === '') {
        console.log('Please enter a number 0–11.\n')
        continue
      }

      switch (choice) {
        case '1': {
          const msg = await promptLine(rl, 'Commit message: ')
          if (!msg.trim()) {
            console.log('Aborted (empty message).\n')
            break
          }
          let r = runGit(['add', '-A'])
          if (!r.ok) break
          r = runGit(['commit', '-m', msg.trim()], { printStdout: true })
          if (r.ok) console.log('✓ Commit created.\n')
          break
        }
        case '2': {
          const r = runGit(['push'], { printStdout: true })
          if (r.ok) console.log('✓ Push completed.\n')
          break
        }
        case '3': {
          const msg = await promptLine(rl, 'Commit message: ')
          if (!msg.trim()) {
            console.log('Aborted (empty message).\n')
            break
          }
          let r = runGit(['add', '-A'])
          if (!r.ok) break
          r = runGit(['commit', '-m', msg.trim()])
          if (!r.ok) break
          r = runGit(['push'], { printStdout: true })
          if (r.ok) console.log('✓ Saved and pushed.\n')
          break
        }
        case '4': {
          runGit(['log', '--oneline', '-10'], { printStdout: true })
          break
        }
        case '5': {
          runGit(['status'], { printStdout: true })
          break
        }
        case '6': {
          const r = runGit(['branch', '-a'], { printStdout: false })
          if (!r.ok) break
          const branches = parseBranches(r.out)
          if (branches.length === 0) {
            console.log('No branches found.\n')
            break
          }
          branches.forEach((b, i) => console.log(`  ${i + 1}. ${b}`))
          const pick = await promptLine(
            rl,
            `Branch # (1–${branches.length}), or Enter to cancel: `,
          )
          const n = parseInt(pick.trim(), 10)
          if (!Number.isFinite(n) || n < 1 || n > branches.length) {
            console.log('Cancelled.\n')
            break
          }
          const name = branches[n - 1]
          const checkout = runGit(['checkout', name], { printStdout: true })
          if (checkout.ok) console.log(`✓ Switched to ${name}.\n`)
          break
        }
        case '7': {
          const name = await promptLine(rl, 'New branch name: ')
          if (!name.trim()) {
            console.log('Aborted (empty name).\n')
            break
          }
          const r = runGit(['checkout', '-b', name.trim()], {
            printStdout: true,
          })
          if (r.ok) console.log(`✓ Created and checked out ${name.trim()}.\n`)
          break
        }
        case '8':
          await runDevServer()
          break
        case '9':
          runNpmScript('typecheck', 'Type check')
          break
        case '10':
          runNpmScript('build', 'Production build')
          break
        case '11':
          console.log(`
┌────────────────────────────────────────────────────────────┐
│  Deploy to Railway + Vercel — not yet implemented        │
│  (placeholder for Phase 11)                                │
└────────────────────────────────────────────────────────────
`)
          break
        default:
          console.log('Unknown choice. Try 0–11.\n')
      }
    }
  } finally {
    rl.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
