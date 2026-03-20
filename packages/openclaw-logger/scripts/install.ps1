# ============================================================================
# OpenClaw Logger — Install Script (Windows)
# ============================================================================
# Usage (PowerShell as Administrator):
#   .\install.ps1 -Source "windows-laptop" -Url "https://your.supabase.co" -Key "eyJhbGc..."
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Source,

    [Parameter(Mandatory=$true)]
    [string]$Url,

    [Parameter(Mandatory=$true)]
    [string]$Key,

    [string]$Type = "laptop",
    [string]$WatchProcesses = "",
    [string]$WatchPaths = "",
    [string]$MetricsInterval = "30000",
    [string]$HeartbeatInterval = "60000"
)

$ErrorActionPreference = "Stop"
$InstallDir = "C:\openclaw-logger"
$ServiceName = "OpenClawCollector"

Write-Host "`n🐾 Installing OpenClaw Collector for: $Source" -ForegroundColor Green

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "  Node.js: $nodeVersion"
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Create install directory
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

# Copy files
$ScriptDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

if (Test-Path "$ScriptDir\dist") {
    Copy-Item -Path "$ScriptDir\dist" -Destination "$InstallDir\" -Recurse -Force
    Copy-Item -Path "$ScriptDir\package.json" -Destination "$InstallDir\" -Force
} else {
    Copy-Item -Path "$ScriptDir\src" -Destination "$InstallDir\" -Recurse -Force
    Copy-Item -Path "$ScriptDir\package.json" -Destination "$InstallDir\" -Force
    Copy-Item -Path "$ScriptDir\tsconfig.json" -Destination "$InstallDir\" -Force
}

Set-Location $InstallDir
npm install --production 2>$null
if (!(Test-Path "$InstallDir\dist") -and (Test-Path "$InstallDir\src")) {
    npm run build
}

# Create environment file
@"
OPENCLAW_SOURCE=$Source
OPENCLAW_SOURCE_TYPE=$Type
OPENCLAW_SUPABASE_URL=$Url
OPENCLAW_SUPABASE_KEY=$Key
OPENCLAW_METRICS_INTERVAL=$MetricsInterval
OPENCLAW_HEARTBEAT_INTERVAL=$HeartbeatInterval
OPENCLAW_WATCH_PROCESSES=$WatchProcesses
OPENCLAW_WATCH_PATHS=$WatchPaths
OPENCLAW_SYSTEM_LOGS=true
"@ | Set-Content "$InstallDir\.env"

# Set environment variables (persistent)
[System.Environment]::SetEnvironmentVariable("OPENCLAW_SOURCE", $Source, "Machine")
[System.Environment]::SetEnvironmentVariable("OPENCLAW_SUPABASE_URL", $Url, "Machine")
[System.Environment]::SetEnvironmentVariable("OPENCLAW_SUPABASE_KEY", $Key, "Machine")
[System.Environment]::SetEnvironmentVariable("OPENCLAW_METRICS_INTERVAL", $MetricsInterval, "Machine")
[System.Environment]::SetEnvironmentVariable("OPENCLAW_HEARTBEAT_INTERVAL", $HeartbeatInterval, "Machine")

# Create Windows Service using nssm or Task Scheduler
$nodePath = (Get-Command node).Source

# Try nssm first (better for services)
$nssmPath = Get-Command nssm -ErrorAction SilentlyContinue
if ($nssmPath) {
    # Stop existing service
    nssm stop $ServiceName 2>$null
    nssm remove $ServiceName confirm 2>$null

    # Install service
    nssm install $ServiceName $nodePath "$InstallDir\dist\collector-daemon.js"
    nssm set $ServiceName AppDirectory $InstallDir
    nssm set $ServiceName AppEnvironmentExtra "OPENCLAW_SOURCE=$Source" "OPENCLAW_SUPABASE_URL=$Url" "OPENCLAW_SUPABASE_KEY=$Key" "OPENCLAW_METRICS_INTERVAL=$MetricsInterval" "OPENCLAW_HEARTBEAT_INTERVAL=$HeartbeatInterval" "OPENCLAW_SYSTEM_LOGS=true"
    nssm set $ServiceName AppStdout "$InstallDir\collector.log"
    nssm set $ServiceName AppStderr "$InstallDir\collector.err"
    nssm set $ServiceName AppRotateFiles 1
    nssm set $ServiceName AppRotateBytes 10485760
    nssm start $ServiceName

    Write-Host "`n✅ Windows Service installed and started" -ForegroundColor Green
    Write-Host "  Commands:"
    Write-Host "    nssm status $ServiceName"
    Write-Host "    nssm stop $ServiceName"
    Write-Host "    nssm start $ServiceName"
} else {
    # Fallback: Task Scheduler
    $taskAction = New-ScheduledTaskAction -Execute $nodePath -Argument "$InstallDir\dist\collector-daemon.js" -WorkingDirectory $InstallDir
    $taskTrigger = New-ScheduledTaskTrigger -AtStartup
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 999

    Unregister-ScheduledTask -TaskName $ServiceName -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask -TaskName $ServiceName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "OpenClaw Log Collector ($Source)" -RunLevel Highest
    Start-ScheduledTask -TaskName $ServiceName

    Write-Host "`n✅ Scheduled Task installed and started" -ForegroundColor Green
    Write-Host "  Commands:"
    Write-Host "    Get-ScheduledTask -TaskName $ServiceName"
    Write-Host "    Stop-ScheduledTask -TaskName $ServiceName"
    Write-Host "    Start-ScheduledTask -TaskName $ServiceName"
}

# npm link for CLI
Set-Location $InstallDir
npm link 2>$null

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🐾 OpenClaw Collector installed successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Source:  $Source"
Write-Host "  Install: $InstallDir"
Write-Host ""
Write-Host "  CLI commands:"
Write-Host "    openclaw-log tail              # Live tail logs"
Write-Host "    openclaw-log sources           # List sources"
Write-Host "    openclaw-log stats             # Statistics"
Write-Host "    openclaw-log search <query>    # Search logs"
Write-Host ""
