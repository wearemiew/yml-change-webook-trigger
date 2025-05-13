#!/bin/bash
# test-version-detection.sh
# A script to test the version detection logic locally

echo "Testing version detection logic"
echo "------------------------------"

# Create a fake PR title to test
PR_TITLE="feat(webhooks): enhance execution with retry logic and parallel"
echo "Testing with PR title: $PR_TITLE"

# Create a fake PR body
PR_BODY="This is a test PR body
Some details about the change

Here's a line with BREAKING CHANGE to test detection"

echo "PR body contains breaking change: $PR_BODY"

# Initialize highest bump type
HIGHEST_BUMP="none"

# Check for breaking changes in PR title
PR_TITLE_HAS_BREAKING_MARKER=0
echo "$PR_TITLE" | grep -q "^feat.*!:" && PR_TITLE_HAS_BREAKING_MARKER=1
echo "$PR_TITLE" | grep -q "BREAKING CHANGE" && PR_TITLE_HAS_BREAKING_MARKER=1

# Check for breaking changes in PR body
PR_BODY_HAS_BREAKING_CHANGE=0
echo "$PR_BODY" | grep -q "BREAKING CHANGE" && PR_BODY_HAS_BREAKING_CHANGE=1

# Simulate git log output for testing
echo "Simulating git log output..."
COMMITS=(
  "feat(webhooks): enhance execution with retry logic and parallel"
  "feat(ci): implement comprehensive GitHub Actions improvements"
  "fix(ci): resolve syntax error in auto-version workflow"
  "chore(build): exclude dist folder from regular commits"
  "feat!: breaking change example"
  "fix: minor issue with BREAKING CHANGE in body"
)

# Check for breaking changes in commit messages
COMMITS_HAVE_BREAKING_CHANGE=0
for commit in "${COMMITS[@]}"; do
  echo "Checking commit: $commit"
  echo "$commit" | grep -q "^feat.*!:" && COMMITS_HAVE_BREAKING_CHANGE=1 && echo "  - Breaking change marker found!"
  echo "$commit" | grep -q "^[a-z]*.*!:" && COMMITS_HAVE_BREAKING_CHANGE=1 && echo "  - Breaking change marker found!"
  echo "$commit" | grep -q "BREAKING CHANGE" && COMMITS_HAVE_BREAKING_CHANGE=1 && echo "  - BREAKING CHANGE found in message!"
done

# Check for features
COMMITS_HAVE_FEATURE=0
for commit in "${COMMITS[@]}"; do
  echo "$commit" | grep -q "^feat" && COMMITS_HAVE_FEATURE=1 && echo "  - Feature commit found!"
done

# Check for fixes
COMMITS_HAVE_FIX=0
for commit in "${COMMITS[@]}"; do
  echo "$commit" | grep -q "^fix" && COMMITS_HAVE_FIX=1 && echo "  - Fix commit found!"
  echo "$commit" | grep -q "^perf" && COMMITS_HAVE_FIX=1 && echo "  - Performance commit found!"
done

echo ""
echo "Detection Results:"
echo "PR title has breaking marker: $PR_TITLE_HAS_BREAKING_MARKER"
echo "PR body has BREAKING CHANGE: $PR_BODY_HAS_BREAKING_CHANGE"
echo "Commits have breaking change: $COMMITS_HAVE_BREAKING_CHANGE"
echo "Commits have feature: $COMMITS_HAVE_FEATURE"
echo "Commits have fix: $COMMITS_HAVE_FIX"

# Determine bump type based on the checks
if [[ $PR_TITLE_HAS_BREAKING_MARKER -eq 1 || $PR_BODY_HAS_BREAKING_CHANGE -eq 1 || $COMMITS_HAVE_BREAKING_CHANGE -eq 1 ]]; then
  echo "Found breaking change indicator"
  HIGHEST_BUMP="major"
elif [[ $HIGHEST_BUMP == "none" && $COMMITS_HAVE_FEATURE -eq 1 ]]; then
  echo "Found feature commit"
  HIGHEST_BUMP="minor"
elif [[ $HIGHEST_BUMP == "none" && $COMMITS_HAVE_FIX -eq 1 ]]; then
  echo "Found fix or performance commit"
  HIGHEST_BUMP="patch"
else
  echo "No conventional commits found"
fi

echo ""
echo "Final result: $HIGHEST_BUMP bump detected"
