# Colab Keepalive Extension Packaging Script
# Automatically packages the extension into a ZIP file

param(
    [string]$Version = "1.0"
)

Write-Host "🔥 Colab Keepalive - Extension Packager" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Extension directory (current directory)
$ExtensionDir = $PSScriptRoot

# Files to include in the package
$FilesToPackage = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.js",
    "icon16.png",
    "icon48.png",
    "icon128.png",
    "README.md"
)

# Output filename
$OutputZip = "colab-keepalive-v$Version.zip"
$OutputPath = Join-Path $ExtensionDir $OutputZip

Write-Host "📦 Packaging extension..." -ForegroundColor Yellow

# Check if all required files exist
$MissingFiles = @()
foreach ($File in $FilesToPackage) {
    $FilePath = Join-Path $ExtensionDir $File
    if (-not (Test-Path $FilePath)) {
        $MissingFiles += $File
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Host "`n❌ Error: Missing required files:" -ForegroundColor Red
    $MissingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

# Remove old package if exists
if (Test-Path $OutputPath) {
    Write-Host "   Removing old package..." -ForegroundColor Gray
    Remove-Item $OutputPath -Force
}

# Create the ZIP package
try {
    $FullPaths = $FilesToPackage | ForEach-Object { Join-Path $ExtensionDir $_ }
    Compress-Archive -Path $FullPaths -DestinationPath $OutputPath -CompressionLevel Optimal
    
    Write-Host "`n✅ Package created successfully!" -ForegroundColor Green
    Write-Host "   File: $OutputZip" -ForegroundColor Green
    
    # Get file size
    $FileSize = (Get-Item $OutputPath).Length
    $FileSizeKB = [math]::Round($FileSize / 1KB, 2)
    Write-Host "   Size: $FileSizeKB KB" -ForegroundColor Green
    
    # Verify contents
    Write-Host "`n📋 Package contents:" -ForegroundColor Cyan
    $Archive = [System.IO.Compression.ZipFile]::OpenRead($OutputPath)
    $Archive.Entries | ForEach-Object {
        $Size = [math]::Round($_.Length / 1KB, 2)
        Write-Host "   ✓ $($_.Name) ($Size KB)" -ForegroundColor Gray
    }
    $Archive.Dispose()
    
    Write-Host "`n🎉 Ready for distribution!" -ForegroundColor Green
    Write-Host "   Install: Drag $OutputZip to chrome://extensions/" -ForegroundColor White
    Write-Host "   Publish: Upload to Chrome Web Store" -ForegroundColor White
    Write-Host "   Share: Send the ZIP file to users`n" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error creating package: $_" -ForegroundColor Red
    exit 1
}

# Optionally open the folder
$OpenFolder = Read-Host "Open folder? (Y/N)"
if ($OpenFolder -eq 'Y' -or $OpenFolder -eq 'y') {
    Invoke-Item $ExtensionDir
}
