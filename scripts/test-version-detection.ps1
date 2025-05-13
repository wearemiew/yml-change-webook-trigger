# test-version-detection.ps1
# A PowerShell script to test the version detection logic locally

Write-Host "Testing version detection logic"
Write-Host "------------------------------"

# Create a fake PR title to test
$PR_TITLE = "feat(webhooks): enhance execution with retry logic and parallel"
Write-Host "Testing with PR title: $PR_TITLE"

# Create a fake PR body
$PR_BODY = @"
This is a test PR body
Some details about the change

Here's a line with BREAKING CHANGE to test detection
"@

Write-Host "PR body contains breaking change: $PR_BODY"

# Initialize highest bump type
$HIGHEST_BUMP = "none"

# Check for breaking changes in PR title
$PR_TITLE_HAS_BREAKING_MARKER = 0
if ($PR_TITLE -match "^feat.*!:") { $PR_TITLE_HAS_BREAKING_MARKER = 1 }
if ($PR_TITLE -match "BREAKING CHANGE") { $PR_TITLE_HAS_BREAKING_MARKER = 1 }

# Check for breaking changes in PR body
$PR_BODY_HAS_BREAKING_CHANGE = 0
if ($PR_BODY -match "BREAKING CHANGE") { $PR_BODY_HAS_BREAKING_CHANGE = 1 }

# Simulate git log output for testing
Write-Host "Simulating git log output..."
$COMMITS = @(
    "feat(webhooks): enhance execution with retry logic and parallel",
    "feat(ci): implement comprehensive GitHub Actions improvements",
    "fix(ci): resolve syntax error in auto-version workflow",
    "chore(build): exclude dist folder from regular commits",
    "feat!: breaking change example",
    "fix: minor issue with BREAKING CHANGE in body"
)

# Check for breaking changes in commit messages
$COMMITS_HAVE_BREAKING_CHANGE = 0
foreach ($commit in $COMMITS) {
    Write-Host "Checking commit: $commit"
    if ($commit -match "^feat.*!:") { 
        $COMMITS_HAVE_BREAKING_CHANGE = 1 
        Write-Host "  - Breaking change marker found!" -ForegroundColor Yellow
    }
    if ($commit -match "^[a-z]*.*!:") { 
        $COMMITS_HAVE_BREAKING_CHANGE = 1 
        Write-Host "  - Breaking change marker found!" -ForegroundColor Yellow
    }
    if ($commit -match "BREAKING CHANGE") { 
        $COMMITS_HAVE_BREAKING_CHANGE = 1 
        Write-Host "  - BREAKING CHANGE found in message!" -ForegroundColor Yellow
    }
}

# Check for features
$COMMITS_HAVE_FEATURE = 0
foreach ($commit in $COMMITS) {
    if ($commit -match "^feat") { 
        $COMMITS_HAVE_FEATURE = 1 
        Write-Host "  - Feature commit found!" -ForegroundColor Green
    }
}

# Check for fixes
$COMMITS_HAVE_FIX = 0
foreach ($commit in $COMMITS) {
    if ($commit -match "^fix") { 
        $COMMITS_HAVE_FIX = 1 
        Write-Host "  - Fix commit found!" -ForegroundColor Cyan
    }
    if ($commit -match "^perf") { 
        $COMMITS_HAVE_FIX = 1 
        Write-Host "  - Performance commit found!" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Detection Results:"
Write-Host "PR title has breaking marker: $PR_TITLE_HAS_BREAKING_MARKER"
Write-Host "PR body has BREAKING CHANGE: $PR_BODY_HAS_BREAKING_CHANGE"
Write-Host "Commits have breaking change: $COMMITS_HAVE_BREAKING_CHANGE"
Write-Host "Commits have feature: $COMMITS_HAVE_FEATURE"
Write-Host "Commits have fix: $COMMITS_HAVE_FIX"

# Determine bump type based on the checks
if ($PR_TITLE_HAS_BREAKING_MARKER -eq 1 -or $PR_BODY_HAS_BREAKING_CHANGE -eq 1 -or $COMMITS_HAVE_BREAKING_CHANGE -eq 1) {
    Write-Host "Found breaking change indicator"
    $HIGHEST_BUMP = "major"
}
elseif ($HIGHEST_BUMP -eq "none" -and $COMMITS_HAVE_FEATURE -eq 1) {
    Write-Host "Found feature commit"
    $HIGHEST_BUMP = "minor"
}
elseif ($HIGHEST_BUMP -eq "none" -and $COMMITS_HAVE_FIX -eq 1) {
    Write-Host "Found fix or performance commit"
    $HIGHEST_BUMP = "patch"
}
else {
    Write-Host "No conventional commits found"
}

Write-Host ""
Write-Host "Final result: $HIGHEST_BUMP bump detected" -ForegroundColor Magenta
