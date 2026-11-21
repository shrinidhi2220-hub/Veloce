$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param([string[]]$GitArgs)
    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($GitArgs -join ' ')"
    }
}

function Invoke-External {
    # Do not name this parameter $Args: PowerShell reserves $args as an automatic variable.
    param([string]$File, [string[]]$ArgumentList, [string]$Label)
    Write-Host "`n--- $Label ---" -ForegroundColor Cyan
    Write-Host ("Command: {0} {1}" -f $File, ($ArgumentList -join ' ')) -ForegroundColor DarkGray
    & $File @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE"
    }
}

try {
    $expectedRoot = 'E:\VELOCE\VELOCE-NEW'
    $root = (& git rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $root) {
        throw 'Run this script from inside the VELOCE Git repository.'
    }
    # Git for Windows may report paths with forward slashes (E:/...).
    # Normalize separators before comparing to the Windows repository path.
    $root = $root.Trim().Replace('/', '\').TrimEnd('\')
    $expectedRoot = $expectedRoot.Replace('/', '\').TrimEnd('\')
    if ($root -ine $expectedRoot) {
        throw "Wrong repository root: $root. Expected: $expectedRoot"
    }
    Set-Location $root

    $branch = (& git branch --show-current).Trim()
    if ($branch -ne 'integration/velo-mvp') {
        throw "Current branch is '$branch'. Switch to integration/velo-mvp before publishing."
    }

    $origin = (& git remote get-url origin 2>$null).Trim()
    if ($LASTEXITCODE -ne 0 -or $origin -notmatch 'github\.com[:/]shrinidhi2220-hub/Veloce(\.git)?$') {
        throw "Unexpected or missing origin remote: '$origin'. Expected GitHub repository shrinidhi2220-hub/Veloce."
    }

    Write-Host 'Repository, remote and branch verified.' -ForegroundColor Green
    Write-Host "Remote: $origin"
    Write-Host "Branch: $branch"

    Invoke-Git -GitArgs @('fetch', 'origin')
    & git merge-base HEAD origin/main *> $null
    if ($LASTEXITCODE -ne 0) {
        throw 'The integration branch does not share history with origin/main. Stop for manual reconciliation; do not force-push.'
    }

    # Create Render Blueprint configuration only when it does not already exist.
    $renderYaml = Join-Path $root 'render.yaml'
    if (-not (Test-Path $renderYaml)) {
        $renderContent = @'
services:
  - type: web
    name: veloce-api
    runtime: node
    plan: free
    region: singapore
    branch: main
    rootDir: backend
    buildCommand: npm ci
    startCommand: npm start
    healthCheckPath: /health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        sync: false
      - key: CORS_ORIGIN
        value: https://veloce-storefront.onrender.com

  - type: web
    name: veloce-storefront
    runtime: static
    branch: main
    rootDir: frontend
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    autoDeploy: true
    envVars:
      - key: VITE_API_URL
        value: https://veloce-api.onrender.com/api
'@
        Set-Content -Path $renderYaml -Value $renderContent -Encoding ASCII
        Write-Host 'Created render.yaml for the VELOCE API and storefront.' -ForegroundColor Green
    }
    else {
        Write-Host 'Existing render.yaml found; leaving it untouched.' -ForegroundColor Yellow
    }

    # Ensure client-side routes work when a user refreshes a nested URL on Render Static Sites.
    $frontendPath = Join-Path $root 'frontend'
    if (-not (Test-Path $frontendPath -PathType Container)) {
        throw 'The frontend directory is missing. Verify that this is the complete VELOCE repository.'
    }

    $frontendPublicPath = Join-Path $frontendPath 'public'
    if (-not (Test-Path $frontendPublicPath -PathType Container)) {
        New-Item -ItemType Directory -Path $frontendPublicPath -Force | Out-Null
        Write-Host 'Created frontend/public directory.' -ForegroundColor Green
    }

    $redirectsPath = Join-Path $frontendPublicPath '_redirects'
    if (-not (Test-Path $redirectsPath -PathType Leaf)) {
        Set-Content -Path $redirectsPath -Value '/* /index.html 200' -Encoding ASCII
        Write-Host 'Created frontend/public/_redirects for SPA routing.' -ForegroundColor Green
    }
    else {
        $redirectContent = Get-Content $redirectsPath -Raw
        if ($redirectContent -notmatch '(?m)^/\*\s+/index\.html\s+200\s*$') {
            throw 'frontend/public/_redirects already exists with different rules. Review it manually before publishing.'
        }
    }

    # Production frontend build.
    Push-Location (Join-Path $root 'frontend')
    try {
        Invoke-External -File 'npm.cmd' -ArgumentList @('run', 'build') -Label 'Frontend production build'
    }
    finally {
        Pop-Location
    }

    # Prisma validation/client generation only; never migrate or seed the shared Aiven database here.
    Push-Location (Join-Path $root 'backend')
    try {
        Invoke-External -File 'npx.cmd' -ArgumentList @('prisma', 'validate') -Label 'Prisma schema validation'
        Invoke-External -File 'npx.cmd' -ArgumentList @('prisma', 'generate') -Label 'Prisma client generation'
    }
    finally {
        Pop-Location
    }

    Write-Host "`n--- Stage source changes (exclude accidental zero-byte helper file) ---" -ForegroundColor Cyan
    # Use a repository-root exclusion so the stray top-level file is never staged.
    Invoke-Git -GitArgs @('add', '-A', '--', '.', ':(exclude,top)-DestinationPath')

    # Older runs or manual staging may already have put this file in the index.
    # Only run restore when Git confirms the path is actually present in the index;
    # otherwise `git restore` reports a fatal pathspec error on Windows/Git.
    $accidentalPathInIndex = @(& git ls-files --cached -- '-DestinationPath' 2>$null)
    if ($LASTEXITCODE -eq 0 -and $accidentalPathInIndex.Count -gt 0) {
        Write-Host 'Removing accidental -DestinationPath helper from the index (keeping the local file).' -ForegroundColor Yellow
        Invoke-Git -GitArgs @('restore', '--staged', '--', '-DestinationPath')
    }

    $staged = @(& git diff --cached --name-only)
    $staged = @($staged | Where-Object { $_ -and $_.Trim() })

    $unsafe = @($staged | Where-Object {
        ($_ -match '(^|/)\.env($|\.)' -and $_ -notmatch '\.env\.(example|sample|template)$') -or
        ($_ -match '\.(pem|key|p12|pfx|crt|jks)$') -or
        ($_ -match '(^|/)(id_rsa|id_ed25519)$')
    })
    if ($unsafe.Count -gt 0) {
        $unsafe | ForEach-Object { Write-Host "BLOCKED SECRET/CERTIFICATE PATH: $_" -ForegroundColor Red }
        throw 'Potential secret or private certificate files are staged. Remove them from staging before publishing.'
    }

    $checkIgnored = (& git check-ignore 'backend/.env' 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $checkIgnored) {
        throw 'backend/.env is not ignored by Git. Stop and fix .gitignore before publishing.'
    }

    Invoke-Git -GitArgs @('diff', '--cached', '--check')

    Write-Host "`n--- STAGED FILE SUMMARY ---" -ForegroundColor Cyan
    & git diff --cached --stat
    Write-Host "`n--- STAGED PATHS ---" -ForegroundColor Cyan
    $staged | ForEach-Object { Write-Host $_ }

    $approval = Read-Host "`nReview the staged files above. Type PUSH to commit and push this integration branch"
    if ($approval -cne 'PUSH') {
        throw 'Publishing was cancelled. Changes remain local/staged; nothing was committed or pushed.'
    }

    if ($staged.Count -gt 0) {
        Invoke-Git -GitArgs @('commit', '-m', 'feat: integrate VELOCE MVP and Render deployment blueprint')
    }

    Invoke-Git -GitArgs @('push', '-u', 'origin', 'integration/velo-mvp')

    Write-Host "`nPUBLISH COMPLETE: integration/velo-mvp pushed to origin." -ForegroundColor Green
    Write-Host 'Next: create and review a PR from integration/velo-mvp to main, then merge it.' -ForegroundColor Green
    Write-Host 'Render deployment will use render.yaml: API (backend) + Static Site (frontend).' -ForegroundColor Green
    Write-Host 'DATABASE_URL is intentionally a manual Render secret; JWT_SECRET is generated by Render.' -ForegroundColor Yellow
    Write-Host 'No Aiven migration, db:setup, seed, reset, drop, truncate, or force-push command was run.' -ForegroundColor Green
}
catch {
    Write-Host "`nPUBLISH STOPPED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'No force-push was attempted. Review the error before retrying.' -ForegroundColor Yellow
    exit 1
}
