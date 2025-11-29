# apply_proxy_patch.ps1
# Searches for the first .csproj under the repo, copies proxy.config.json into that project,
# ensures the .csproj copies the file to output, and patches Program.cs to load the config
# and map the reverse proxy. Creates backups before modifying files.

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Repo scripts dir: $RepoRoot"

# Find the first .csproj under the repo root (recursively)
$csproj = Get-ChildItem -Path $RepoRoot -Filter *.csproj -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $csproj) {
  Write-Error "No .csproj found under $RepoRoot. Run this script from the repo or move it into your ASP.NET project folder."
  exit 1
}
$projectDir = $csproj.DirectoryName
Write-Host "Found project: $($csproj.FullName)"

# Copy proxy.config.json into project directory
$proxySrc = Join-Path $RepoRoot 'proxy.config.json'
if (-not (Test-Path $proxySrc)) {
  Write-Error "proxy.config.json not found in $RepoRoot. Ensure file exists."
  exit 1
}
$proxyDest = Join-Path $projectDir 'proxy.config.json'
Copy-Item -Path $proxySrc -Destination $proxyDest -Force
Write-Host "Copied proxy.config.json -> $proxyDest"

# Backup .csproj
$csprojPath = $csproj.FullName
$csprojBak = "$csprojPath.bak"
Copy-Item -Path $csprojPath -Destination $csprojBak -Force
Write-Host "Backed up csproj to $csprojBak"

# Ensure .csproj contains CopyToOutputDirectory for proxy.config.json
$csprojText = Get-Content $csprojPath -Raw
if ($csprojText -notmatch 'proxy.config.json') {
  $itemGroup = "`n  <ItemGroup>`n    <None Include=\"proxy.config.json\">`n      <CopyToOutputDirectory>Always</CopyToOutputDirectory>`n    </None>`n  </ItemGroup>`n"
  # Insert before closing </Project>
  $csprojText = $csprojText -replace "</Project>\s*$", "$itemGroup</Project>"
  Set-Content -Path $csprojPath -Value $csprojText -Encoding utf8
  Write-Host "Updated csproj to copy proxy.config.json to output"
} else {
  Write-Host "csproj already references proxy.config.json"
}

# Find Program.cs in project directory (recursive)
$prog = Get-ChildItem -Path $projectDir -Filter Program.cs -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $prog) {
  Write-Error "Program.cs not found under project directory $projectDir. Please add the proxy config manually."
  exit 1
}
$progPath = $prog.FullName
$progBak = "$progPath.bak"
Copy-Item -Path $progPath -Destination $progBak -Force
Write-Host "Backed up Program.cs to $progBak"

$progText = Get-Content $progPath -Raw

# Insert AddJsonFile and AddReverseProxy after CreateBuilder line
$builderPattern = 'var\s+builder\s*=\s*WebApplication\.CreateBuilder\(args\);'
if ($progText -match $builderPattern) {
  if ($progText -notmatch 'AddReverseProxy\(') {
    $insert = "`n// Load proxy config and register reverse proxy (added by apply_proxy_patch.ps1)`nbuilder.Configuration.AddJsonFile(\"proxy.config.json\", optional: true, reloadOnChange: true);`nbuilder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection(\"ReverseProxy\"));`n"
    $progText = [regex]::Replace($progText, $builderPattern, "$&`n$insert", 1)
    Write-Host "Inserted AddJsonFile and AddReverseProxy into Program.cs"
  } else {
    Write-Host "Program.cs already registers reverse proxy"
  }
} else {
  Write-Warning "Could not find the CreateBuilder statement in Program.cs. Manual edit may be required."
}

# Ensure app.MapReverseProxy() exists before app.Run()
if ($progText -notmatch 'MapReverseProxy\(') {
  if ($progText -match 'app\.Run\(') {
    $progText = $progText -replace 'app\.Run\(', "app.MapReverseProxy();`n`napp.Run("
    Write-Host "Inserted app.MapReverseProxy() before app.Run()"
  } else {
    Write-Warning "Could not find app.Run() to insert MapReverseProxy(); manual edit required."
  }
} else {
  Write-Host "app.MapReverseProxy() already present in Program.cs"
}

# Save Program.cs
Set-Content -Path $progPath -Value $progText -Encoding utf8
Write-Host "Patched Program.cs saved: $progPath"

Write-Host "Done. Please restart your ASP.NET app (dotnet run) and your Node backend, then test the frontend requests.`nIf something still fails, copy the browser console lines beginning with 'apiPost -> requesting:' and the last 20 lines of your Node backend terminal and paste them here."