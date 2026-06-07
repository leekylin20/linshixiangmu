@echo off
chcp 65001 >nul
setlocal EnableExtensions DisableDelayedExpansion

rem ============================================================
rem Batch image watermark tool
rem - No ImageMagick / ffmpeg required
rem - Supports jpg/jpeg/png/bmp/tif/tiff
rem - Default output: input_dir\watermarked
rem
rem Position values:
rem   br, bl, tr, tl, center
rem   tile = regular repeated watermark
rem   diamond = large diamond-style repeated watermark
rem   middle-sides = small marks around middle, left, center, right
rem ============================================================

rem Defaults. Leave blank to ask in interactive mode.
set "WM_INPUT_DIR="
set "WM_OUTPUT_DIR="
set "WM_LOGO_FILE="
set "WM_TEXT="
set "WM_POSITION=br"
set "WM_OPACITY=35"
set "WM_TEXT_SIZE=5"
set "WM_LOGO_WIDTH=18"
set "WM_MARGIN=3"
set "WM_RECURSIVE=N"
set "WM_JPEG_QUALITY=92"

rem CLI usage:
rem   batch-watermark.bat "D:\images" "watermark text"
rem   batch-watermark.bat "D:\images" "watermark text" "D:\output" br 35 5
rem   batch-watermark.bat "D:\images" "watermark text" "D:\output" middle-sides 35 small5
rem   batch-watermark.bat "D:\images" "watermark text" "D:\output" middle-sides 45 small4
set "WM_INTERACTIVE=Y"
if not "%~1"=="" set "WM_INTERACTIVE=N"
if not "%~1"=="" set "WM_INPUT_DIR=%~1"
if not "%~2"=="" set "WM_TEXT=%~2"
if not "%~3"=="" set "WM_OUTPUT_DIR=%~3"
if not "%~4"=="" set "WM_POSITION=%~4"
if not "%~5"=="" set "WM_OPACITY=%~5"
if not "%~6"=="" set "WM_TEXT_SIZE=%~6"

echo.
echo === Batch image watermark ===
echo.

if /I "%WM_INTERACTIVE%"=="Y" if not defined WM_INPUT_DIR (
  set /p "WM_INPUT_DIR=Input image folder (default: current folder): "
)
if not defined WM_INPUT_DIR set "WM_INPUT_DIR=%CD%"

if /I "%WM_INTERACTIVE%"=="Y" if not defined WM_OUTPUT_DIR (
  set /p "WM_OUTPUT_DIR=Output folder (default: input folder\watermarked): "
)
if not defined WM_OUTPUT_DIR set "WM_OUTPUT_DIR=%WM_INPUT_DIR%\watermarked"

if /I "%WM_INTERACTIVE%"=="Y" if not defined WM_LOGO_FILE (
  set /p "WM_LOGO_FILE=Logo watermark file path (optional): "
)

if /I "%WM_INTERACTIVE%"=="Y" if not defined WM_LOGO_FILE if not defined WM_TEXT (
  set /p "WM_TEXT=Text watermark (default: Watermark): "
)
if not defined WM_LOGO_FILE if not defined WM_TEXT set "WM_TEXT=Watermark"

if not defined WM_POSITION set "WM_POSITION=br"
if not defined WM_OPACITY set "WM_OPACITY=35"
if not defined WM_TEXT_SIZE set "WM_TEXT_SIZE=5"
if not defined WM_LOGO_WIDTH set "WM_LOGO_WIDTH=18"
if not defined WM_MARGIN set "WM_MARGIN=3"
if not defined WM_RECURSIVE set "WM_RECURSIVE=N"
if not defined WM_JPEG_QUALITY set "WM_JPEG_QUALITY=92"

set "WATERMARK_BAT=%~f0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$p=$env:WATERMARK_BAT; $s=[System.IO.File]::ReadAllText($p,[System.Text.Encoding]::UTF8); $m='# POWERSHELL'; $i=$s.LastIndexOf($m); if($i -lt 0){throw 'PowerShell block not found'}; Invoke-Expression $s.Substring($i+$m.Length)"
set "WM_EXIT_CODE=%ERRORLEVEL%"

if /I "%WM_INTERACTIVE%"=="Y" (
  echo.
  pause
)
exit /b %WM_EXIT_CODE%

# POWERSHELL
$ErrorActionPreference = 'Stop'

try {
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
} catch {}

Add-Type -AssemblyName System.Drawing

function Get-EnvValue {
    param(
        [string]$Name,
        [string]$Default = ''
    )

    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        return $Default
    }
    return $value.Trim()
}

function Get-IntValue {
    param(
        [string]$Name,
        [int]$Default,
        [int]$Min,
        [int]$Max
    )

    $raw = Get-EnvValue -Name $Name -Default $Default
    $parsed = 0
    if (-not [int]::TryParse([string]$raw, [ref]$parsed)) {
        $parsed = $Default
    }
    return [Math]::Min($Max, [Math]::Max($Min, $parsed))
}

function Get-FullPath {
    param([string]$Path)
    return [System.IO.Path]::GetFullPath((Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path)
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

function Get-WatermarkPoint {
    param(
        [string]$Position,
        [int]$CanvasWidth,
        [int]$CanvasHeight,
        [int]$MarkWidth,
        [int]$MarkHeight,
        [int]$MarginX,
        [int]$MarginY
    )

    switch ($Position.ToLowerInvariant()) {
        { $_ -in @('tl', 'top-left', 'left-top') } {
            return [PSCustomObject]@{ X = $MarginX; Y = $MarginY }
        }
        { $_ -in @('tr', 'top-right', 'right-top') } {
            return [PSCustomObject]@{ X = $CanvasWidth - $MarkWidth - $MarginX; Y = $MarginY }
        }
        { $_ -in @('bl', 'bottom-left', 'left-bottom') } {
            return [PSCustomObject]@{ X = $MarginX; Y = $CanvasHeight - $MarkHeight - $MarginY }
        }
        { $_ -in @('center', 'middle', 'c') } {
            return [PSCustomObject]@{ X = [int](($CanvasWidth - $MarkWidth) / 2); Y = [int](($CanvasHeight - $MarkHeight) / 2) }
        }
        default {
            return [PSCustomObject]@{ X = $CanvasWidth - $MarkWidth - $MarginX; Y = $CanvasHeight - $MarkHeight - $MarginY }
        }
    }
}

function New-TextFont {
    param(
        [float]$Size,
        [System.Drawing.FontStyle]$Style = [System.Drawing.FontStyle]::Bold
    )

    foreach ($name in @('Noto Sans SC', 'Noto Sans SC Medium', 'Source Han Sans SC', 'Source Han Sans CN', '思源黑体 CN', 'Sarasa Gothic SC', 'WenQuanYi Micro Hei', 'SimHei', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Arial')) {
        try {
            $font = [System.Drawing.Font]::new($name, $Size, $Style, [System.Drawing.GraphicsUnit]::Pixel)
            if ($font.Name -eq $name -or $font.FontFamily.Name -eq $name) {
                return $font
            }
            $font.Dispose()
        } catch {}
    }

    return [System.Drawing.Font]::new([System.Drawing.FontFamily]::GenericSansSerif, $Size, $Style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-RotatedWatermarkText {
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
        [float]$Angle = -35
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
        [float]$Opacity,
        [int]$TextSizePercent,
        [int]$TextSizePixels,
        [int]$MarginPercent
    )

    $shortSide = [Math]::Min($CanvasWidth, $CanvasHeight)
    if ($TextSizePixels -gt 0) {
        $fontSize = $TextSizePixels
    } else {
        $fontSize = [Math]::Max(12, [Math]::Round($shortSide * $TextSizePercent / 100))
    }
    $maxWidth = [Math]::Max(100, [Math]::Round($CanvasWidth * 0.72))

    $font = $null
    $size = $null
    do {
        if ($font) { $font.Dispose() }
        $font = New-TextFont -Size $fontSize
        $size = $Graphics.MeasureString($Text, $font)
        if ($size.Width -le $maxWidth) { break }
        $fontSize -= 1
    } while ($fontSize -gt 10)

    $markWidth = [int][Math]::Ceiling($size.Width)
    $markHeight = [int][Math]::Ceiling($size.Height)
    $marginX = [int][Math]::Round($CanvasWidth * $MarginPercent / 100)
    $marginY = [int][Math]::Round($CanvasHeight * $MarginPercent / 100)

    $alpha = [int](255 * $Opacity)
    $shadowAlpha = [int]([Math]::Min(255, $alpha * 0.65))
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($shadowAlpha, 0, 0, 0))

    $positionMode = $Position.ToLowerInvariant()

    try {
        if ($positionMode -in @('middle-sides', 'midsides', 'middle-sides-only', 'sides')) {
            $spots = @(
                [PSCustomObject]@{ X = 0.18; Y = 0.50 },
                [PSCustomObject]@{ X = 0.50; Y = 0.50 },
                [PSCustomObject]@{ X = 0.82; Y = 0.50 }
            )

            foreach ($spot in $spots) {
                Draw-RotatedWatermarkText -Graphics $Graphics -Text $Text -Font $font -Brush $brush -ShadowBrush $shadowBrush -CenterX ([float]($CanvasWidth * $spot.X)) -CenterY ([float]($CanvasHeight * $spot.Y)) -TextWidth ([float]$markWidth) -TextHeight ([float]$markHeight) -Angle -35
            }
        } elseif ($positionMode -in @('tile', 'diamond')) {
            $state = $Graphics.Save()
            try {
                $Graphics.TranslateTransform($CanvasWidth / 2, $CanvasHeight / 2)
                $angle = if ($positionMode -eq 'diamond') { -45 } else { -28 }
                $Graphics.RotateTransform($angle)
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
                        $Graphics.DrawString($Text, $font, $shadowBrush, [float]($x + 2), [float]($y + 2))
                        $Graphics.DrawString($Text, $font, $brush, [float]$x, [float]$y)
                    }
                    $row += 1
                }
            } finally {
                $Graphics.Restore($state)
            }
        } else {
            $point = Get-WatermarkPoint -Position $Position -CanvasWidth $CanvasWidth -CanvasHeight $CanvasHeight -MarkWidth $markWidth -MarkHeight $markHeight -MarginX $marginX -MarginY $marginY
            $Graphics.DrawString($Text, $font, $shadowBrush, [float]($point.X + 2), [float]($point.Y + 2))
            $Graphics.DrawString($Text, $font, $brush, [float]$point.X, [float]$point.Y)
        }
    } finally {
        $brush.Dispose()
        $shadowBrush.Dispose()
        if ($font) { $font.Dispose() }
    }
}

function Draw-ImageWatermark {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$CanvasWidth,
        [int]$CanvasHeight,
        [System.Drawing.Image]$Logo,
        [string]$Position,
        [float]$Opacity,
        [int]$LogoWidthPercent,
        [int]$MarginPercent
    )

    $markWidth = [Math]::Max(16, [int][Math]::Round($CanvasWidth * $LogoWidthPercent / 100))
    $markHeight = [int][Math]::Round($Logo.Height * ($markWidth / [double]$Logo.Width))

    $maxHeight = [int][Math]::Round($CanvasHeight * 0.45)
    if ($markHeight -gt $maxHeight) {
        $markHeight = $maxHeight
        $markWidth = [int][Math]::Round($Logo.Width * ($markHeight / [double]$Logo.Height))
    }

    $marginX = [int][Math]::Round($CanvasWidth * $MarginPercent / 100)
    $marginY = [int][Math]::Round($CanvasHeight * $MarginPercent / 100)

    $matrix = [System.Drawing.Imaging.ColorMatrix]::new()
    $matrix.Matrix33 = $Opacity
    $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
    $attributes.SetColorMatrix(
        $matrix,
        [System.Drawing.Imaging.ColorMatrixFlag]::Default,
        [System.Drawing.Imaging.ColorAdjustType]::Bitmap
    )

    try {
        if ($Position.ToLowerInvariant() -eq 'tile') {
            $stepX = [Math]::Max($markWidth * 2, 240)
            $stepY = [Math]::Max($markHeight * 2, 160)
            for ($y = $marginY; $y -lt $CanvasHeight; $y += $stepY) {
                for ($x = $marginX; $x -lt $CanvasWidth; $x += $stepX) {
                    $rect = [System.Drawing.Rectangle]::new([int]$x, [int]$y, [int]$markWidth, [int]$markHeight)
                    $Graphics.DrawImage($Logo, $rect, 0, 0, $Logo.Width, $Logo.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
                }
            }
        } else {
            $point = Get-WatermarkPoint -Position $Position -CanvasWidth $CanvasWidth -CanvasHeight $CanvasHeight -MarkWidth $markWidth -MarkHeight $markHeight -MarginX $marginX -MarginY $marginY
            $rect = [System.Drawing.Rectangle]::new([int]$point.X, [int]$point.Y, [int]$markWidth, [int]$markHeight)
            $Graphics.DrawImage($Logo, $rect, 0, 0, $Logo.Width, $Logo.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
        }
    } finally {
        $attributes.Dispose()
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

$inputDir = Get-EnvValue -Name 'WM_INPUT_DIR'
$outputDir = Get-EnvValue -Name 'WM_OUTPUT_DIR'
$logoFile = Get-EnvValue -Name 'WM_LOGO_FILE'
$watermarkText = Get-EnvValue -Name 'WM_TEXT' -Default 'Watermark'
$position = (Get-EnvValue -Name 'WM_POSITION' -Default 'br').ToLowerInvariant()
$opacityPercent = Get-IntValue -Name 'WM_OPACITY' -Default 35 -Min 1 -Max 100
$textSizeSpec = Get-EnvValue -Name 'WM_TEXT_SIZE' -Default '5'
$textSizePixels = 0
if ($textSizeSpec -match '^(small4|xiao4|xiao-4|小四|小四号|12pt)$') {
    $textSizePercent = 0
    $textSizePixels = 16
} elseif ($textSizeSpec -match '^(small5|xiao5|xiao-5|小五|小五号|9pt)$') {
    $textSizePercent = 0
    $textSizePixels = 12
} else {
    $textSizePercent = Get-IntValue -Name 'WM_TEXT_SIZE' -Default 5 -Min 1 -Max 20
}
$logoWidthPercent = Get-IntValue -Name 'WM_LOGO_WIDTH' -Default 18 -Min 1 -Max 80
$marginPercent = Get-IntValue -Name 'WM_MARGIN' -Default 3 -Min 0 -Max 25
$jpegQuality = Get-IntValue -Name 'WM_JPEG_QUALITY' -Default 92 -Min 1 -Max 100
$recursive = (Get-EnvValue -Name 'WM_RECURSIVE' -Default 'N') -match '^(Y|YES|TRUE|1)$'
$opacity = $opacityPercent / 100.0

if (-not [System.IO.Directory]::Exists($inputDir)) {
    throw "图片文件夹不存在：$inputDir"
}

$inputFull = [System.IO.Path]::GetFullPath($inputDir)
$outputFull = [System.IO.Path]::GetFullPath($outputDir)
$extensions = @('.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff')

$logo = $null
if (-not [string]::IsNullOrWhiteSpace($logoFile)) {
    if (-not [System.IO.File]::Exists($logoFile)) {
        throw "图片水印文件不存在：$logoFile"
    }
    $logo = [System.Drawing.Image]::FromFile($logoFile)
}

try {
    $files = Get-ChildItem -LiteralPath $inputFull -File -Recurse:$recursive |
        Where-Object {
            $ext = $_.Extension.ToLowerInvariant()
            if ($extensions -notcontains $ext) { return $false }

            $fileFull = [System.IO.Path]::GetFullPath($_.FullName)
            if ($fileFull.StartsWith($outputFull.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
                return $false
            }

            return $true
        }

    if ($files.Count -eq 0) {
        Write-Host "没有找到可处理的图片。"
        exit 0
    }

    Write-Host "输入目录：$inputFull"
    Write-Host "输出目录：$outputFull"
    Write-Host "图片数量：$($files.Count)"
    if ($logo) {
        Write-Host "水印类型：图片水印"
    } else {
        Write-Host "水印类型：文字水印 [$watermarkText]"
    }
    Write-Host "位置/透明度：$position / $opacityPercent%"
    Write-Host ""

    $success = 0
    $failed = 0
    $index = 0

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

            if ($logo) {
                Draw-ImageWatermark -Graphics $graphics -CanvasWidth $canvas.Width -CanvasHeight $canvas.Height -Logo $logo -Position $position -Opacity $opacity -LogoWidthPercent $logoWidthPercent -MarginPercent $marginPercent
            } else {
                Draw-TextWatermark -Graphics $graphics -CanvasWidth $canvas.Width -CanvasHeight $canvas.Height -Text $watermarkText -Position $position -Opacity $opacity -TextSizePercent $textSizePercent -TextSizePixels $textSizePixels -MarginPercent $marginPercent
            }

            if ($recursive) {
                $relative = Get-RelativePath -BasePath $inputFull -TargetPath $file.FullName
                $outputPath = Join-Path $outputFull $relative
            } else {
                $outputPath = Join-Path $outputFull $file.Name
            }

            $outputPath = [System.IO.Path]::GetFullPath($outputPath)
            if ([string]::Equals($outputPath, [System.IO.Path]::GetFullPath($file.FullName), [System.StringComparison]::OrdinalIgnoreCase)) {
                $outputPath = Join-Path ([System.IO.Path]::GetDirectoryName($outputPath)) ("{0}_watermarked{1}" -f $file.BaseName, $file.Extension)
            }

            Save-OutputImage -Bitmap $canvas -OutputPath $outputPath -Extension $ext -JpegQuality $jpegQuality
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
    Write-Host "输出目录：$outputFull"

    if ($failed -gt 0) {
        exit 1
    }
} finally {
    if ($logo) { $logo.Dispose() }
}
