$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$port = 8765

function Test-Port {
  param([int]$Port)
  $client = New-Object Net.Sockets.TcpClient
  try {
    $client.Connect("127.0.0.1", $Port)
    $true
  } catch {
    $false
  } finally {
    $client.Close()
  }
}

while (Test-Port -Port $port) {
  $port++
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "Node.js not found. Please install Node.js or open toolbox-dashboard\\index.html through another local static server."
}

$serverScript = Join-Path $scriptDir "static-server.js"

Write-Host "Starting toolbox dashboard at http://127.0.0.1:$port/toolbox-dashboard/"
Write-Host "Workspace root: $rootDir"

Start-Process -FilePath $node.Source -ArgumentList @($serverScript, $rootDir, $port) -WindowStyle Hidden
Start-Sleep -Milliseconds 800
Start-Process "http://127.0.0.1:$port/toolbox-dashboard/"
