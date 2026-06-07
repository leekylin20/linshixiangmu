param(
  [Parameter(Mandatory = $true)]
  [string]$Query,

  [int]$Context = 1,
  [int]$Limit = 30
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$matches = Get-ChildItem -LiteralPath $root -Recurse -File -Include *.md, *.jsonl |
  Select-String -SimpleMatch -Pattern $Query -Context $Context |
  Select-Object -First $Limit

foreach ($match in $matches) {
  $relative = Resolve-Path -LiteralPath $match.Path -Relative
  Write-Output ("{0}:{1}: {2}" -f $relative, $match.LineNumber, $match.Line.Trim())
  if ($match.Context.PreContext) {
    foreach ($line in $match.Context.PreContext) {
      Write-Output ("  < {0}" -f $line.Trim())
    }
  }
  if ($match.Context.PostContext) {
    foreach ($line in $match.Context.PostContext) {
      Write-Output ("  > {0}" -f $line.Trim())
    }
  }
  Write-Output ""
}

if (-not $matches) {
  Write-Output "No memory match for: $Query"
}

