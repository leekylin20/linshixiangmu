$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$toolkit = Split-Path -Parent $PSScriptRoot
$repos = Join-Path $toolkit "repos"
$downloads = Join-Path $toolkit "downloads"
$tempRoot = Join-Path $toolkit "_extract_tmp"

New-Item -ItemType Directory -Force -Path $repos | Out-Null
New-Item -ItemType Directory -Force -Path $downloads | Out-Null
New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

$items = @(
    @{ Name = "hyperframes"; Repo = "heygen-com/hyperframes" },
    @{ Name = "video-use"; Repo = "browser-use/video-use" },
    @{ Name = "remotion-skills"; Repo = "remotion-dev/skills" },
    @{ Name = "generative-media-skills"; Repo = "SamurAIGPT/Generative-Media-Skills" },
    @{ Name = "videocut-skills"; Repo = "Ceeon/videocut-skills" },
    @{ Name = "seedance2-skill"; Repo = "dexhunter/seedance2-skill" }
)

$branches = @("main", "master")
$results = @()

foreach ($item in $items) {
    $zip = Join-Path $downloads ($item.Name + ".zip")
    $dest = Join-Path $repos $item.Name
    $downloaded = $false
    $usedBranch = $null
    $lastError = ""

    foreach ($branch in $branches) {
        $url = "https://gh-proxy.com/https://github.com/$($item.Repo)/archive/refs/heads/$branch.zip"
        try {
            Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing -TimeoutSec 90
            $extract = Join-Path $tempRoot ($item.Name + "-" + $branch)
            if (Test-Path -Path $extract) {
                Remove-Item -Path $extract -Recurse -Force
            }
            New-Item -ItemType Directory -Force -Path $extract | Out-Null
            Expand-Archive -Path $zip -DestinationPath $extract -Force
            $root = Get-ChildItem -Path $extract -Directory | Select-Object -First 1
            if (-not $root) {
                throw "No root directory found after extracting zip"
            }

            if (Test-Path -Path $dest) {
                $resolvedRepos = [IO.Path]::GetFullPath($repos)
                $resolvedDest = [IO.Path]::GetFullPath($dest)
                if (-not $resolvedDest.StartsWith($resolvedRepos, [StringComparison]::OrdinalIgnoreCase)) {
                    throw "Refusing to delete destination outside repos: $resolvedDest"
                }
                Remove-Item -Path $dest -Recurse -Force
            }

            Move-Item -Path $root.FullName -Destination $dest
            $downloaded = $true
            $usedBranch = $branch
            break
        } catch {
            $lastError = $_.Exception.Message
        }
    }

    $fileCount = 0
    if ($downloaded) {
        $fileCount = (Get-ChildItem -Path $dest -Recurse -Force -File | Measure-Object).Count
    }

    $results += [pscustomobject]@{
        Name = $item.Name
        Repo = $item.Repo
        Downloaded = $downloaded
        Branch = $usedBranch
        Files = $fileCount
        Error = $lastError
    }
}

if (Test-Path -Path $tempRoot) {
    Remove-Item -Path $tempRoot -Recurse -Force
}

$results | Format-Table -AutoSize
