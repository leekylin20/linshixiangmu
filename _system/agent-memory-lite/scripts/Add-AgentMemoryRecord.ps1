param(
  [Parameter(Mandatory = $true)]
  [string]$Summary,

  [string]$Type = "project_status",
  [string]$Layer = "semantic",
  [string[]]$Tags = @(),
  [string]$Source = "manual",
  [string[]]$LinkedDocs = @(),
  [double]$Importance = 0.7,
  [string]$Status = "active",
  [switch]$RawOnly
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$rawPath = Join-Path $root "raw\events.jsonl"
$factsPath = Join-Path $root "facts\facts.jsonl"

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $rawPath), (Split-Path -Parent $factsPath) | Out-Null

$now = Get-Date
$id = "AML-{0}-{1}" -f $now.ToString("yyyyMMdd"), $now.ToString("HHmmssfff")

$record = [ordered]@{
  id = $id
  created_at = $now.ToString("yyyy-MM-ddTHH:mm:sszzz")
  record_type = $Type
  layer = $Layer
  summary = $Summary
  tags = $Tags
  source = $Source
  linked_docs = $LinkedDocs
  importance = $Importance
  status = $Status
}

$json = $record | ConvertTo-Json -Compress -Depth 6
Add-Content -LiteralPath $rawPath -Value $json -Encoding UTF8

if (-not $RawOnly) {
  Add-Content -LiteralPath $factsPath -Value $json -Encoding UTF8
}

Write-Output "Wrote $id"

