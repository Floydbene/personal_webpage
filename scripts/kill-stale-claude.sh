#!/usr/bin/env bash
# Kill stale Claude Code sessions (older than 1 hour)
# Preserves the current session (identified by $PPID ancestry)

set -euo pipefail

THRESHOLD_SECONDS=3600 # 1 hour
CURRENT_PID=$$
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "DRY RUN — no processes will be killed"
  echo
fi

# Find the claude process that is an ancestor of this script
find_ancestor_claude() {
  local pid=$CURRENT_PID
  while [[ $pid -gt 1 ]]; do
    pid=$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')
    [[ -z "$pid" ]] && break
    local cmd
    cmd=$(ps -o comm= -p "$pid" 2>/dev/null | tr -d ' ')
    if [[ "$cmd" == "claude" ]]; then
      echo "$pid"
      return
    fi
  done
}

ANCESTOR_CLAUDE=$(find_ancestor_claude)
NOW=$(date +%s)
KILLED=0

echo "Scanning for stale Claude Code sessions (older than 1 hour)..."
echo

while IFS= read -r line; do
  pid=$(echo "$line" | awk '{print $1}')
  elapsed=$(echo "$line" | awk '{print $2}')

  # Skip our ancestor claude process
  if [[ -n "$ANCESTOR_CLAUDE" && "$pid" == "$ANCESTOR_CLAUDE" ]]; then
    echo "  SKIP  PID $pid (current session) — age: $elapsed"
    continue
  fi

  # Parse elapsed time (formats: MM:SS, HH:MM:SS, D-HH:MM:SS)
  # Use 10# prefix to force base-10 (avoids octal interpretation of leading zeros)
  seconds=0
  if [[ "$elapsed" =~ ^([0-9]+)-([0-9]+):([0-9]+):([0-9]+)$ ]]; then
    seconds=$(( 10#${BASH_REMATCH[1]} * 86400 + 10#${BASH_REMATCH[2]} * 3600 + 10#${BASH_REMATCH[3]} * 60 + 10#${BASH_REMATCH[4]} ))
  elif [[ "$elapsed" =~ ^([0-9]+):([0-9]+):([0-9]+)$ ]]; then
    seconds=$(( 10#${BASH_REMATCH[1]} * 3600 + 10#${BASH_REMATCH[2]} * 60 + 10#${BASH_REMATCH[3]} ))
  elif [[ "$elapsed" =~ ^([0-9]+):([0-9]+)$ ]]; then
    seconds=$(( 10#${BASH_REMATCH[1]} * 60 + 10#${BASH_REMATCH[2]} ))
  fi

  if [[ $seconds -ge $THRESHOLD_SECONDS ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "  WOULD KILL  PID $pid — age: $elapsed"
    else
      kill "$pid" 2>/dev/null && echo "  KILLED  PID $pid — age: $elapsed" || echo "  FAILED  PID $pid — age: $elapsed"
    fi
    KILLED=$((KILLED + 1))
  else
    echo "  SKIP  PID $pid (too recent) — age: $elapsed"
  fi
done < <(ps -eo pid,etime,comm 2>/dev/null | awk '$3 == "claude" {print $1, $2}')

echo
if [[ $KILLED -eq 0 ]]; then
  echo "No stale sessions found."
else
  echo "$KILLED stale session(s) ${DRY_RUN:+would be }cleaned up."
fi
