param(
    [Parameter(Mandatory = $true)]
    [string[]]$Symbols
)

function Convert-ToSecId {
    param([string]$Symbol)

    if ($Symbol -match '^[01]\.\d{6}$') {
        return $Symbol
    }

    $code = $Symbol.Trim()
    if ($code -match '^\d{1,5}$') {
        $code = $code.PadLeft(6, '0')
    }
    if ($code -match '^(600|601|603|605|688|689)\d{3}$') {
        return "1.$code"
    }
    if ($code -match '^(000|001|002|003|300|301)\d{3}$') {
        return "0.$code"
    }

    throw "Cannot infer A-share market for symbol: $Symbol. Pass secid like 1.600900 or 0.000400."
}

$normalizedSymbols = foreach ($item in $Symbols) {
    $item -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}

$secids = ($normalizedSymbols | ForEach-Object { Convert-ToSecId $_ }) -join ','
$fields = 'f12,f14,f2,f3,f4,f9,f10,f20,f23'
$url = "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=$fields&secids=$secids"

$response = Invoke-RestMethod -Uri $url -TimeoutSec 15
if (-not $response.data -or -not $response.data.diff) {
    throw "No quote data returned from Eastmoney."
}

$response.data.diff | ForEach-Object {
    [pscustomobject]@{
        Code       = $_.f12
        Name       = $_.f14
        Price      = $_.f2
        ChangePct  = $_.f3
        Change     = $_.f4
        PE         = $_.f9
        Turnover   = $_.f10
        MarketCap  = $_.f20
        PB         = $_.f23
    }
} | ConvertTo-Json -Depth 3
