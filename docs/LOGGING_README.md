# Claude Session Prompt Logging System

## Overview
This logging system allows multiple Claude Code sessions to log their prompts to a centralized `prompt.log` file.

## Setup Instructions

### For Each Claude Session:

1. **Source the setup script** at the beginning of each session:
   ```bash
   source /home/azureuser/frai/worktrial-test-repos/template-ecom/setup-logging.sh
   ```

2. **Log prompts** using either command:
   ```bash
   log_claude_prompt "your prompt text here"
   # OR
   logprompt "your prompt text here"
   ```

### To Make Permanent (Optional):

Add this line to your `~/.bashrc`:
```bash
source /home/azureuser/frai/worktrial-test-repos/template-ecom/setup-logging.sh
```

## Manual Usage

You can also use the logging script directly:
```bash
./log-prompt.sh "session-name" "prompt text"
```

## Log Format

Prompts are logged to `prompt.log` with:
- Session ID (unique per session)
- Timestamp
- Full prompt text

## Example Workflow

In each Claude session:
```bash
# 1. Start of session
source setup-logging.sh

# 2. Before processing each user prompt
logprompt "Create a new React component for user authentication"

# 3. Continue with Claude's normal operation
```

## Notes
- Each session gets a unique ID based on process ID and timestamp
- Logs append to the existing prompt.log file
- The log file is human-readable markdown format