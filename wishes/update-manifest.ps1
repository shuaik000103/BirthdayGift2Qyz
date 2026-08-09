$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$imageRoot = Join-Path $scriptRoot "friends"
$manifestPath = Join-Path $scriptRoot "manifest.json"
$extensions = @(".jpg", ".jpeg", ".png", ".webp", ".gif")

if (-not (Test-Path -LiteralPath $imageRoot)) {
  New-Item -ItemType Directory -Path $imageRoot | Out-Null
}

$files = Get-ChildItem -LiteralPath $imageRoot -File |
  Where-Object { $extensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object Name

$images = New-Object System.Collections.ArrayList

for ($index = 0; $index -lt $files.Count; $index += 1) {
  $file = $files[$index]

  [void]$images.Add(
    [ordered]@{
      file = $file.Name
    }
  )
}

$manifest = New-Object System.Collections.Specialized.OrderedDictionary
$manifest.Add("basePath", "wishes/friends/")
$manifest.Add("images", @($images))

$json = $manifest | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($manifestPath, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host ("Updated {0}; {1} wish image(s)." -f $manifestPath, $images.Count)
