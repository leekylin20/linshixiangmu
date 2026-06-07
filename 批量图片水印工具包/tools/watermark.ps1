param(
    [string]$InputPath,
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

try {
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
} catch {}

Add-Type -AssemblyName System.Drawing

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$ConfigPath = Join-Path $RootDir 'config.ini'
$PrivateFonts = $null

function Read-Config {
    param([string]$Path)

    $config = @{}
    if (-not [System.IO.File]::Exists($Path)) {
        return $config
    }

    foreach ($line in [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8)) {
        $trimmed = $line.Trim()
        if ($trimmed.Length -eq 0) { continue }
        if ($trimmed.StartsWith('#') -or $trimmed.StartsWith(';')) { continue }

        $match = [regex]::Match($trimmed, '^([^=]+)=(.*)$')
        if ($match.Success) {
            $key = $match.Groups[1].Value.Trim()
            $value = $match.Groups[2].Value.Trim()
            $config[$key] = $value
        }
    }

    return $config
}

function Get-ConfigValue {
    param(
        [hashtable]$Config,
        [string]$Name,
        [string]$Default = ''
    )

    if ($Config.ContainsKey($Name) -and -not [string]::IsNullOrWhiteSpace($Config[$Name])) {
        return [string]$Config[$Name]
    }

    return $Default
}

function Resolve-ToolPath {
    param(
        [string]$Path,
        [string]$BaseDir
    )

    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $null
    }

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return [System.IO.Path]::GetFullPath($Path)
    }

    return [System.IO.Path]::GetFullPath((Join-Path $BaseDir $Path))
}

function Get-BoolValue {
    param(
        [string]$Value,
        [bool]$Default = $false
    )

    if ([string]::IsNullOrWhiteSpace($Value)) { return $Default }
    return $Value -match '^(1|true|yes|y|on)$'
}

function Get-IntValue {
    param(
        [string]$Value,
        [int]$Default,
        [int]$Min,
        [int]$Max
    )

    $parsed = 0
    if (-not [int]::TryParse($Value, [ref]$parsed)) {
        $parsed = $Default
    }

    return [Math]::Min($Max, [Math]::Max($Min, $parsed))
}

function Get-TextSizePixels {
    param(
        [string]$Spec,
        [int]$ShortSide
    )

    $value = if ([string]::IsNullOrWhiteSpace($Spec)) { 'small4' } else { $Spec.Trim().ToLowerInvariant() }

    if ($value -match '^(small4|xiao4|xiao-4|小四|小四号|12pt)$') {
        return 16
    }

    if ($value -match '^(small5|xiao5|xiao-5|小五|小五号|9pt)$') {
        return 12
    }

    $matchPx = [regex]::Match($value, '^(\d+)\s*px$')
    if ($matchPx.Success) {
        return [Math]::Max(8, [int]$matchPx.Groups[1].Value)
    }

    $matchPt = [regex]::Match($value, '^(\d+)\s*pt$')
    if ($matchPt.Success) {
        return [Math]::Max(8, [int][Math]::Round(([int]$matchPt.Groups[1].Value) * 96 / 72))
    }

    $percent = 0
    if ([int]::TryParse($value, [ref]$percent)) {
        return [Math]::Max(8, [int][Math]::Round($ShortSide * $percent / 100))
    }

    return 16
}

function Get-RelativePath {
    param(
        [string]$BasePath,
        [string]$TargetPath
    )

    $base = [System.IO.Path]::GetFullPath($BasePath).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    $target = [System.IO.Path]::GetFullPath($TargetPath)

    try {
        return [System.IO.Path]::GetRelativePath($base, $target)
    } catch {
        $baseUri = [Uri]::new($base)
        $targetUri = [Uri]::new($target)
        return [Uri]::UnescapeDataString($baseUri.MakeRelativeUri($targetUri).ToString()).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    }
}

function Apply-ExifOrientation {
    param([System.Drawing.Image]$Image)

    try {
        $orientationId = 274
        if ($Image.PropertyIdList -notcontains $orientationId) {
            return
        }

        $orientation = [BitConverter]::ToUInt16($Image.GetPropertyItem($orientationId).Value, 0)
        switch ($orientation) {
            2 { $Image.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
            3 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            4 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
            5 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
            6 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            7 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
            8 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
        try { $Image.RemovePropertyItem($orientationId) } catch {}
    } catch {}
}

function Get-ImageFiles {
    param(
        [string]$Path,
        [bool]$Recursive,
        [string]$OutputRoot
    )

    $extensions = @('.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff')

    if ([System.IO.File]::Exists($Path)) {
        $item = Get-Item -LiteralPath $Path
        if ($extensions -contains $item.Extension.ToLowerInvariant()) {
            return @($item)
        }
        return @()
    }

    if (-not [System.IO.Directory]::Exists($Path)) {
        throw "输入路径不存在：$Path"
    }

    $outputFull = [System.IO.Path]::GetFullPath($OutputRoot).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar

    return @(Get-ChildItem -LiteralPath $Path -File -Recurse:$Recursive | Where-Object {
        $ext = $_.Extension.ToLowerInvariant()
        if ($extensions -notcontains $ext) { return $false }

        $fileFull = [System.IO.Path]::GetFullPath($_.FullName)
        if ($fileFull.StartsWith($outputFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            return $false
        }

        return $true
    })
}

function New-WatermarkFont {
    param(
        [float]$Size,
        [string]$BundledFontPath
    )

    $style = [System.Drawing.FontStyle]::Bold

    if ([System.IO.File]::Exists($BundledFontPath)) {
        if ($script:PrivateFonts -eq $null) {
            $script:PrivateFonts = [System.Drawing.Text.PrivateFontCollection]::new()
            $script:PrivateFonts.AddFontFile($BundledFontPath)
        }

        foreach ($family in $script:PrivateFonts.Families) {
            $useStyle = if ($family.IsStyleAvailable($style)) { $style } else { [System.Drawing.FontStyle]::Regular }
            try {
                return [System.Drawing.Font]::new($family, $Size, $useStyle, [System.Drawing.GraphicsUnit]::Pixel)
            } catch {}
        }
    }

    foreach ($name in @('Noto Sans SC', 'Noto Sans SC Medium', 'Source Han Sans SC', 'Source Han Sans CN', 'Sarasa Gothic SC', 'WenQuanYi Micro Hei', 'SimHei', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Arial')) {
        try {
            $font = [System.Drawing.Font]::new($name, $Size, $style, [System.Drawing.GraphicsUnit]::Pixel)
            if ($font.Name -eq $name -or $font.FontFamily.Name -eq $name) {
                return $font
            }
            $font.Dispose()
        } catch {}
    }

    return [System.Drawing.Font]::new([System.Drawing.FontFamily]::GenericSansSerif, $Size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-RotatedText {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [System.Drawing.Brush]$ShadowBrush,
        [float]$CenterX,
        [float]$CenterY,
        [float]$TextWidth,
        [float]$TextHeight,
        [float]$Angle
    )

    $state = $Graphics.Save()
    try {
        $Graphics.TranslateTransform($CenterX, $CenterY)
        $Graphics.RotateTransform($Angle)
        $x = -$TextWidth / 2
        $y = -$TextHeight / 2
        $Graphics.DrawString($Text, $Font, $ShadowBrush, [float]($x + 1), [float]($y + 1))
        $Graphics.DrawString($Text, $Font, $Brush, [float]$x, [float]$y)
    } finally {
        $Graphics.Restore($state)
    }
}

function Draw-TextWatermark {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$CanvasWidth,
        [int]$CanvasHeight,
        [string]$Text,
        [string]$Position,
        [int]$OpacityPercent,
        [string]$FontSizeSpec,
        [float]$Angle,
        [string]$BundledFontPath
    )

    $shortSide = [Math]::Min($CanvasWidth, $CanvasHeight)
    $fontSize = Get-TextSizePixels -Spec $FontSizeSpec -ShortSide $shortSide
    $maxWidth = [Math]::Max(80, [Math]::Round($CanvasWidth * 0.72))

    $font = $null
    $size = $null
    do {
        if ($font) { $font.Dispose() }
        $font = New-WatermarkFont -Size $fontSize -BundledFontPath $BundledFontPath
        $size = $Graphics.MeasureString($Text, $font)
        if ($size.Width -le $maxWidth) { break }
        $fontSize -= 1
    } while ($fontSize -gt 8)

    $markWidth = [int][Math]::Ceiling($size.Width)
    $markHeight = [int][Math]::Ceiling($size.Height)
    $opacity = [Math]::Min(100, [Math]::Max(1, $OpacityPercent)) / 100.0
    $alpha = [int](255 * $opacity)
    $shadowAlpha = [int]([Math]::Min(255, $alpha * 0.60))

    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($shadowAlpha, 0, 0, 0))
    $positionMode = $Position.ToLowerInvariant()

    try {
        if ($positionMode -in @('middle-sides', 'midsides', 'middle-sides-only', 'sides')) {
            foreach ($spot in @(
                [PSCustomObject]@{ X = 0.18; Y = 0.50 },
                [PSCustomObject]@{ X = 0.50; Y = 0.50 },
                [PSCustomObject]@{ X = 0.82; Y = 0.50 }
            )) {
                Draw-RotatedText -Graphics $Graphics -Text $Text -Font $font -Brush $brush -ShadowBrush $shadowBrush -CenterX ([float]($CanvasWidth * $spot.X)) -CenterY ([float]($CanvasHeight * $spot.Y)) -TextWidth ([float]$markWidth) -TextHeight ([float]$markHeight) -Angle $Angle
            }
            return
        }

        if ($positionMode -in @('tile', 'diamond')) {
            $state = $Graphics.Save()
            try {
                $tileAngle = if ($positionMode -eq 'diamond') { -45 } else { $Angle }
                $Graphics.TranslateTransform($CanvasWidth / 2, $CanvasHeight / 2)
                $Graphics.RotateTransform($tileAngle)
                $Graphics.TranslateTransform(-$CanvasWidth / 2, -$CanvasHeight / 2)

                if ($positionMode -eq 'diamond') {
                    $stepX = [Math]::Max($markWidth * 3, [int][Math]::Round($CanvasWidth * 0.45))
                    $stepY = [Math]::Max($markHeight * 6, [int][Math]::Round($CanvasHeight * 0.28))
                } else {
                    $stepX = [Math]::Max($markWidth * 2, 260)
                    $stepY = [Math]::Max($markHeight * 4, 140)
                }

                $row = 0
                for ($y = -$CanvasHeight; $y -lt ($CanvasHeight * 2); $y += $stepY) {
                    $startX = -$CanvasWidth
                    if ($positionMode -eq 'diamond' -and ($row % 2 -eq 1)) {
                        $startX += $stepX / 2
                    }

                    for ($x = $startX; $x -lt ($CanvasWidth * 2); $x += $stepX) {
                        $Graphics.DrawString($Text, $font, $shadowBrush, [float]($x + 1), [float]($y + 1))
                        $Graphics.DrawString($Text, $font, $brush, [float]$x, [float]$y)
                    }
                    $row += 1
                }
            } finally {
                $Graphics.Restore($state)
            }
            return
        }

        $marginX = [int][Math]::Round($CanvasWidth * 0.03)
        $marginY = [int][Math]::Round($CanvasHeight * 0.03)

        switch ($positionMode) {
            { $_ -in @('tl', 'top-left', 'left-top') } {
                $x = $marginX; $y = $marginY
            }
            { $_ -in @('tr', 'top-right', 'right-top') } {
                $x = $CanvasWidth - $markWidth - $marginX; $y = $marginY
            }
            { $_ -in @('bl', 'bottom-left', 'left-bottom') } {
                $x = $marginX; $y = $CanvasHeight - $markHeight - $marginY
            }
            { $_ -in @('center', 'middle', 'c') } {
                $x = [int](($CanvasWidth - $markWidth) / 2); $y = [int](($CanvasHeight - $markHeight) / 2)
            }
            default {
                $x = $CanvasWidth - $markWidth - $marginX; $y = $CanvasHeight - $markHeight - $marginY
            }
        }

        $Graphics.DrawString($Text, $font, $shadowBrush, [float]($x + 1), [float]($y + 1))
        $Graphics.DrawString($Text, $font, $brush, [float]$x, [float]$y)
    } finally {
        $brush.Dispose()
        $shadowBrush.Dispose()
        if ($font) { $font.Dispose() }
    }
}

function Save-OutputImage {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$OutputPath,
        [string]$Extension,
        [int]$JpegQuality
    )

    $directory = [System.IO.Path]::GetDirectoryName($OutputPath)
    if (-not [System.IO.Directory]::Exists($directory)) {
        [System.IO.Directory]::CreateDirectory($directory) | Out-Null
    }

    if ([System.IO.File]::Exists($OutputPath)) {
        [System.IO.File]::Delete($OutputPath)
    }

    switch ($Extension.ToLowerInvariant()) {
        { $_ -in @('.jpg', '.jpeg') } {
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
            $encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
            $encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [int64]$JpegQuality)
            try {
                $Bitmap.Save($OutputPath, $codec, $encoderParams)
            } finally {
                $encoderParams.Dispose()
            }
        }
        '.png' {
            $Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        '.bmp' {
            $Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
        }
        { $_ -in @('.tif', '.tiff') } {
            $Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Tiff)
        }
        default {
            throw "不支持的图片格式：$Extension"
        }
    }
}

function Invoke-Watermark {
    $config = Read-Config -Path $ConfigPath

    $inputResolved = if ([string]::IsNullOrWhiteSpace($InputPath)) {
        Resolve-ToolPath -Path (Get-ConfigValue -Config $config -Name 'InputPath' -Default 'input') -BaseDir $RootDir
    } else {
        Resolve-ToolPath -Path $InputPath -BaseDir (Get-Location).Path
    }

    $outputBase = if ([string]::IsNullOrWhiteSpace($OutputPath)) {
        Resolve-ToolPath -Path (Get-ConfigValue -Config $config -Name 'OutputPath' -Default 'output') -BaseDir $RootDir
    } else {
        Resolve-ToolPath -Path $OutputPath -BaseDir (Get-Location).Path
    }

    $timestampOutput = Get-BoolValue -Value (Get-ConfigValue -Config $config -Name 'CreateTimestampFolder' -Default 'true') -Default $true
    $outputResolved = if ($timestampOutput -and [string]::IsNullOrWhiteSpace($OutputPath)) {
        Join-Path $outputBase ('水印结果_' + (Get-Date -Format 'yyyyMMdd_HHmmss'))
    } else {
        $outputBase
    }

    $watermarkText = Get-ConfigValue -Config $config -Name 'WatermarkText' -Default 'Watermark'
    $position = Get-ConfigValue -Config $config -Name 'Position' -Default 'middle-sides'
    $opacity = Get-IntValue -Value (Get-ConfigValue -Config $config -Name 'Opacity' -Default '80') -Default 80 -Min 1 -Max 100
    $fontSize = Get-ConfigValue -Config $config -Name 'FontSize' -Default 'small4'
    $angleRaw = Get-ConfigValue -Config $config -Name 'Angle' -Default '-35'
    $angle = -35.0
    [double]::TryParse($angleRaw, [ref]$angle) | Out-Null
    $recursive = Get-BoolValue -Value (Get-ConfigValue -Config $config -Name 'Recursive' -Default 'false') -Default $false
    $jpegQuality = Get-IntValue -Value (Get-ConfigValue -Config $config -Name 'JpegQuality' -Default '92') -Default 92 -Min 1 -Max 100
    $fontPath = Join-Path $RootDir 'fonts\NotoSansSC-VF.ttf'

    $files = Get-ImageFiles -Path $inputResolved -Recursive $recursive -OutputRoot $outputResolved
    if ($files.Count -eq 0) {
        Write-Host "没有找到可处理的图片。"
        Write-Host "输入路径：$inputResolved"
        return 0
    }

    Write-Host "输入路径：$inputResolved"
    Write-Host "输出目录：$outputResolved"
    Write-Host "图片数量：$($files.Count)"
    Write-Host "水印文字：$watermarkText"
    Write-Host "位置/透明度/字号：$position / $opacity% / $fontSize"
    if ([System.IO.File]::Exists($fontPath)) {
        Write-Host "字体：Noto Sans SC（随包字体）"
    } else {
        Write-Host "字体：系统黑体兜底"
    }
    Write-Host ""

    $success = 0
    $failed = 0
    $index = 0
    $inputIsDirectory = [System.IO.Directory]::Exists($inputResolved)

    foreach ($file in $files) {
        $index += 1
        Write-Progress -Activity '批量加水印' -Status $file.Name -PercentComplete (($index / [double]$files.Count) * 100)

        $sourceImage = $null
        $canvas = $null
        $graphics = $null

        try {
            $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)
            Apply-ExifOrientation -Image $sourceImage

            $ext = $file.Extension.ToLowerInvariant()
            $pixelFormat = if ($ext -in @('.jpg', '.jpeg')) {
                [System.Drawing.Imaging.PixelFormat]::Format24bppRgb
            } else {
                [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
            }

            $canvas = [System.Drawing.Bitmap]::new($sourceImage.Width, $sourceImage.Height, $pixelFormat)
            $graphics = [System.Drawing.Graphics]::FromImage($canvas)
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

            if ($ext -in @('.jpg', '.jpeg')) {
                $graphics.Clear([System.Drawing.Color]::White)
            } else {
                $graphics.Clear([System.Drawing.Color]::Transparent)
            }

            $graphics.DrawImage($sourceImage, 0, 0, $sourceImage.Width, $sourceImage.Height)
            Draw-TextWatermark -Graphics $graphics -CanvasWidth $canvas.Width -CanvasHeight $canvas.Height -Text $watermarkText -Position $position -OpacityPercent $opacity -FontSizeSpec $fontSize -Angle ([float]$angle) -BundledFontPath $fontPath

            if ($inputIsDirectory -and $recursive) {
                $relative = Get-RelativePath -BasePath $inputResolved -TargetPath $file.FullName
                $outputFile = Join-Path $outputResolved $relative
            } else {
                $outputFile = Join-Path $outputResolved $file.Name
            }

            Save-OutputImage -Bitmap $canvas -OutputPath $outputFile -Extension $ext -JpegQuality $jpegQuality
            $success += 1
            Write-Host "[OK] $($file.Name)"
        } catch {
            $failed += 1
            Write-Warning "[失败] $($file.FullName)：$($_.Exception.Message)"
        } finally {
            if ($graphics) { $graphics.Dispose() }
            if ($canvas) { $canvas.Dispose() }
            if ($sourceImage) { $sourceImage.Dispose() }
        }
    }

    Write-Progress -Activity '批量加水印' -Completed
    Write-Host ""
    Write-Host "完成：成功 $success，失败 $failed。"
    Write-Host "输出目录：$outputResolved"

    if ($failed -gt 0) { return 1 }
    return 0
}

try {
    $exitCode = Invoke-Watermark
    exit $exitCode
} finally {
    if ($PrivateFonts) { $PrivateFonts.Dispose() }
}
