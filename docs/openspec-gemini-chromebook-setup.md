# OpenSpec + Gemini CLI Setup on Chromebook
### Spec-Driven Development — Free, No Subscription

> **What you'll end up with:** A fully working spec-driven development environment
> where you write structured specs and Gemini CLI implements them — at zero ongoing cost.
> 
> **Two paths covered:**
> - **Path A** — VS Code (recommended, most stable on Chromebook)
> - **Path B** — Zed Editor (faster but has Chromebook GPU caveats — read the note first)

---

## Before You Begin: Important Notes

### Zed on Chromebook — Read This First
Zed requires Vulkan GPU support, which is off by default in Chrome OS's Linux container
(Crostini). Some Chromebooks work fine after a flag is enabled; others have persistent
display issues. **If you hit problems with Zed, VS Code will work reliably on any
Chromebook.** Instructions to fix the GPU issue are included in Path B.

### Free Tier Reality Check
Gemini CLI gives you 1,000 model requests/day and 60 requests/minute with a free Google
account. In agentic mode, one prompt can trigger 3–10 API calls internally. For light-to-
moderate daily development (a few features per session), this is sufficient. Heavy sessions
may exhaust the daily limit — if that happens, you can continue spec drafting in the
Gemini web app (gemini.google.com — no rate limits) and return to the CLI for implementation.

---

## Phase 1: Enable Linux on Your Chromebook

> Skip this if Linux is already enabled (you'll see a "Terminal" app in your launcher).

1. Click the clock/status area (bottom-right corner of screen)
2. Click the **gear icon** to open Settings
3. In the left menu, scroll to **Developers**
4. Click **Linux development environment** → **Turn On**
5. Follow the prompts (takes 5–10 minutes to download)
6. When complete, a **Terminal** app appears in your launcher — click it to open

You now have a Debian-based Linux environment (called Crostini/Penguin).

---

## Phase 2: Set Up the Linux Foundation (Both Paths)

All commands below are run in the **Linux Terminal**.

### Step 1: Update your Linux environment

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### Step 2: Install build essentials

```bash
sudo apt-get install -y curl wget git build-essential
```

### Step 3: Install Node.js via nvm

OpenSpec requires Node.js 20.19.0 or higher. The recommended way on Chromebook is via
nvm (Node Version Manager), which avoids permission issues with global npm installs.

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Reload your shell so nvm is available
source ~/.bashrc
```

Verify nvm installed:
```bash
nvm --version
# Should print something like: 0.40.0
```

Install Node.js 22 (LTS, exceeds the 20.19.0 minimum):
```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Verify Node and npm:
```bash
node --version    # Should show v22.x.x
npm --version     # Should show 10.x.x or higher
```

### Step 4: Install Git (and configure it)

Git is likely already installed, but set up your identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## Phase 3: Install Gemini CLI

### Step 1: Install globally via npm

```bash
npm install -g @google/gemini-cli
```

Verify:
```bash
gemini --version
```

### Step 2: Authenticate with your Google account

```bash
gemini
```

On first launch, Gemini CLI will open a browser window (Chrome) for Google OAuth.
Sign in with the Google account you want to use — this is what grants your free tier
access (1,000 requests/day). No API key or credit card needed.

After authentication, you'll see the Gemini CLI prompt (`>`). Type `/quit` to exit
for now.

> **Tip:** Your authentication persists between sessions. You won't need to log in again
> unless you explicitly sign out.

---

## Phase 4: Install OpenSpec CLI

### Step 1: Install globally

```bash
npm install -g @fission-ai/openspec
```

Verify:
```bash
openspec --version
```

### Step 2: Configure OpenSpec to use Gemini

OpenSpec generates AI-tool-specific context files (like GEMINI.md and AGENTS.md) during
project initialization. You'll choose Gemini as your tool in Step 5 when you set up your
first project.

---

## ── PATH A: VS Code Setup ──────────────────────────────────────

## Phase 5A: Install VS Code

### Step 1: Download the .deb package

Go to **code.visualstudio.com/download** in Chrome and download the **.deb** package
for **x64** (or **ARM64** if your Chromebook has an ARM chip — check with `dpkg --print-architecture` in terminal).

### Step 2: Install it

In your Linux terminal:
```bash
# Navigate to where Chrome downloads files (accessible from Linux)
cd ~/

# Install (replace filename with the actual version you downloaded)
sudo dpkg -i /home/<your-username>/Downloads/code_*.deb

# Fix any dependency issues
sudo apt-get install -f
```

> **Shortcut:** In your Chromebook Files app, navigate to Downloads, find the .deb file,
> and double-click it. A dialog will offer to install it in Linux — click Install.

### Step 3: Launch VS Code

Find "Visual Studio Code" in your Linux Apps folder in the launcher, or from terminal:
```bash
code .
```

### Step 4: Install the OpenSpec extension (optional but helpful)

In VS Code:
1. Click the **Extensions icon** in the left sidebar (or press `Ctrl+Shift+X`)
2. Search for **"OpenSpec"**
3. Install the extension by **Codder13** (the visualiser extension — adds an OpenSpec panel)

> Note: This extension is a viewer/manager for your OpenSpec files. The core workflow
> runs through Gemini CLI in the terminal, not through this extension.

---

## Phase 6A: Create Your First Project (VS Code Path)

### Step 1: Create a project folder

```bash
mkdir ~/projects/my-app
cd ~/projects/my-app
git init
```

### Step 2: Open it in VS Code

```bash
code .
```

### Step 3: Initialise OpenSpec in the project

Open VS Code's integrated terminal (`Ctrl+backtick`) and run:

```bash
openspec init
```

The interactive setup will ask:
- **Which AI tool are you using?** → Select **gemini** (use arrow keys, press Enter)
- **Which profile?** → Select **core** (the standard SDD workflow)
- **Which workflows?** → Accept the defaults (propose, apply, archive)

OpenSpec creates:
```
my-app/
├── openspec/
│   ├── changes/        ← active feature changes live here
│   ├── specs/          ← your project specs accumulate here
│   └── config.yaml     ← OpenSpec configuration
├── GEMINI.md           ← context file Gemini CLI reads automatically
└── AGENTS.md           ← universal agent context file
```

### Step 4: Seed your GEMINI.md with project context

Open `GEMINI.md` in VS Code and add your project's ground rules. This file is read
automatically every time Gemini CLI runs in this folder. Example:

```markdown
# My App — Project Context

## What we're building
A task management CLI tool in Python.

## Tech stack
- Language: Python 3.11+
- No frameworks unless necessary
- Tests: pytest
- Style: PEP8, type hints required

## Rules
- Never skip writing tests
- Commit after each task is complete
- Ask before adding new dependencies
```

---

## Phase 7A: Your Daily SDD Workflow (VS Code)

Open two VS Code panels side-by-side:
- **Left panel:** Your code/spec files
- **Right panel (integrated terminal):** Gemini CLI running

```bash
# Start Gemini CLI in your project
cd ~/projects/my-app
gemini
```

### The Core Loop

**1. Propose a change**

In the Gemini CLI prompt, type:
```
/opsx:propose add-user-authentication
```

Gemini reads your GEMINI.md context and creates:
```
openspec/changes/add-user-authentication/
├── proposal.md    ← why we're doing this, what's changing
├── specs/         ← requirements and scenarios
├── design.md      ← technical approach
└── tasks.md       ← implementation checklist
```

**2. Review and refine the spec**

Open the generated files in VS Code. Read them carefully. Edit anything that's wrong
or missing. This is the most important step — the spec is your contract with the AI.

Continue iterating with Gemini in the terminal:
```
The spec looks good but please add a scenario for invalid credentials
```

**3. Implement**

Once you're satisfied with the spec:
```
/opsx:apply
```

Gemini works through `tasks.md` sequentially, implementing each task and checking them off.
Watch the terminal for progress. Review each file change in VS Code before continuing.

**4. Archive**

When implementation is complete and reviewed:
```
/opsx:archive
```

This moves the change folder to `openspec/changes/archive/` and updates your central
specs — keeping the project's source of truth current.

**Rinse and repeat** for each new feature.

---

## ── PATH B: Zed Editor Setup ────────────────────────────────────

## ⚠️ Chromebook GPU Fix (Required for Zed)

Zed uses Vulkan for rendering. You must enable GPU support in Crostini first.

### Step 1: Enable the GPU flag in Chrome

1. In Chrome's address bar, go to: `chrome://flags/#crostini-gpu-support`
2. Set it to **Enabled**
3. Click **Restart** when prompted

### Step 2: Install Vulkan drivers in Linux

```bash
# Add backports for newer Mesa drivers
echo "deb http://deb.debian.org/debian bookworm-backports main" | \
  sudo tee /etc/apt/sources.list.d/backports.list

sudo apt-get update
sudo apt-get install -y mesa-vulkan-drivers/bookworm-backports
```

### Step 3: Restart your Linux container

In Chrome OS: right-click the Terminal app in the taskbar → **Shut down Linux** → reopen Terminal.

### Step 4: Test Vulkan (optional but recommended)

```bash
sudo apt-get install -y vulkan-tools
vulkaninfo --summary
# Should show your GPU without errors
```

If you see errors here, Zed will not work on your specific Chromebook. Fall back to
Path A (VS Code).

---

## Phase 5B: Install Zed

```bash
curl -f https://zed.dev/install.sh | sh
```

This installs Zed to `~/.local/bin/zed`. Add it to your PATH if needed:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Launch Zed:
```bash
zed
```

> **If Zed opens as a tiny unusable window:** Try running with X11 mode forced:
> ```bash
> WAYLAND_DISPLAY= zed
> ```
> If that works, add it as an alias:
> ```bash
> echo "alias zed='WAYLAND_DISPLAY= zed'" >> ~/.bashrc && source ~/.bashrc
> ```

---

## Phase 6B: Configure Zed with Gemini

Zed has built-in AI support. To use Gemini models:

1. In Zed, press `Ctrl+,` to open Settings
2. Add this to your `settings.json`:

```json
{
  "assistant": {
    "default_model": {
      "provider": "google",
      "model": "gemini-2.5-flash"
    },
    "version": "2"
  }
}
```

3. You'll need a **Gemini API key** for Zed's built-in assistant (this is separate from
   Gemini CLI's OAuth — Zed doesn't use the CLI's auth):
   - Go to **aistudio.google.com**
   - Click **Get API key** → Create API key (free, no credit card for Flash model)
   - In Zed: press `Ctrl+Shift+A` to open the AI panel → enter your key when prompted

> **Important:** The free Gemini API via AI Studio has more restrictive rate limits than
> Gemini CLI (100–500 requests/day depending on model, vs 1,000 via CLI auth). For
> implementation tasks, **keep using Gemini CLI in Zed's built-in terminal.** Use Zed's
> AI panel for quick questions and code review.

---

## Phase 7B: Create Your First Project (Zed Path)

### Step 1: Create and open a project

```bash
mkdir ~/projects/my-app
cd ~/projects/my-app
git init
zed .
```

### Step 2: Open the terminal in Zed

Press `` Ctrl+` `` or go to **View → Terminal**

### Step 3: Initialise OpenSpec

In Zed's integrated terminal:
```bash
openspec init
```

Select **gemini** as your tool. Same structure is created as in Path A.

### Step 4: Add your GEMINI.md context

In Zed's file panel (left sidebar), open `GEMINI.md` and populate it with your project
context (same as in Step 4 of Path A).

---

## Phase 8B: Your Daily SDD Workflow (Zed)

Zed's layout advantage: you can split the editor and have specs open alongside your code
with minimal chrome (no heavy sidebar). Use `Ctrl+\` to split panes.

The workflow is identical to Path A:

```bash
# In Zed's terminal
gemini

# Propose
/opsx:propose my-new-feature

# Review specs in Zed's editor pane (left)

# Implement
/opsx:apply

# Archive
/opsx:archive
```

Zed's **Outline panel** (`Ctrl+Shift+O`) is useful for navigating longer spec Markdown files.

---

## Quick Reference Card

### Daily workflow commands
| Command | What it does |
|---|---|
| `gemini` | Start the AI session in your project |
| `/opsx:propose <name>` | Create a new spec for a feature/change |
| `/opsx:apply` | Implement the current spec's tasks |
| `/opsx:archive` | Archive completed change, update specs |
| `/opsx:sync` | Reconcile specs if they've drifted from code |
| `/opsx:explore` | Explore the codebase before proposing |
| `/quit` | Exit Gemini CLI |

### Useful Gemini CLI slash commands (inside the session)
| Command | What it does |
|---|---|
| `/stats` | See token usage for the session |
| `/memory` | View what Gemini has remembered |
| `/chat save <tag>` | Save your conversation checkpoint |
| `/chat resume <tag>` | Resume a saved conversation |
| `@filename` | Reference a file in your prompt |
| `!command` | Run a shell command directly |

### If you hit the daily rate limit
The limit resets at midnight Pacific time. In the meantime:
- Continue writing/editing spec Markdown files manually in VS Code or Zed
- Use **gemini.google.com** (web app, no rate limits) to iterate on spec language
- Come back to the CLI for `/opsx:apply` once the limit resets

---

## Troubleshooting

**`openspec: command not found`**
```bash
# nvm installs npm globals per Node version — check your Node version is active
nvm use 22
openspec --version
```

**`gemini: command not found`**
```bash
# Same fix — ensure the right Node version is active
nvm use 22
gemini --version
```

**Gemini CLI asks me to log in every session**
```bash
# Check that you used OAuth (Google account) not API key auth during first launch
# OAuth credentials persist; API keys don't if not stored properly
gemini  # should reconnect without prompting
```

**OpenSpec init doesn't show 'gemini' as an option**
Update OpenSpec to the latest version:
```bash
npm update -g @fission-ai/openspec
```

**Zed won't open / tiny window on Chromebook**
Force X11 mode:
```bash
WAYLAND_DISPLAY= zed .
```
If Vulkan errors persist after the GPU fix, use VS Code (Path A) instead.

**VS Code doesn't launch from terminal**
```bash
# Re-source your shell and try again
source ~/.bashrc
code --version
```

---

## What's Next

Once comfortable with the basic propose → apply → archive loop:

1. **Customise your GEMINI.md** — the more context you give it (architecture decisions,
   coding standards, things to avoid), the better the specs it generates

2. **Try `/opsx:explore`** before proposing on an existing codebase — it lets Gemini
   map what already exists before writing specs for changes

3. **Add Aider for git discipline** — `pip install aider-chat` gives you auto git commits
   on every AI change, so you can `git revert` any step cleanly

4. **Learn OpenSpec profiles** — the `expanded` profile adds more workflow commands
   (`/opsx:new`, `/opsx:verify`) for stricter gate-keeping between phases

---

*Setup guide current as of May 2026. OpenSpec, Gemini CLI, and VS Code update frequently —
check their respective GitHub repos if any command behaves differently.*
