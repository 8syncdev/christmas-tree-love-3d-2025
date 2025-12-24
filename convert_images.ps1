# Script to convert images to base64
$output = @"

// ============================================================================
// BASE64 ENCODED IMAGES - Auto-generated from images/ folder
// ============================================================================

const base64Images = [
"@

$folder = "D:\workspace2026\christmas-tree\images"
$files = @("1.jpg", "2.png", "3.jpg", "4.jpg", "5.jpg", "6.jpg")

foreach ($file in $files) {
    $path = Join-Path $folder $file
    if (Test-Path $path) {
        Write-Host "Converting $file..."
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $base64 = [System.Convert]::ToBase64String($bytes)

        # Detect MIME type
        $ext = [System.IO.Path]::GetExtension($file)
        $mime = if ($ext -eq ".png") { "image/png" } else { "image/jpeg" }

        $output += "  { name: '$file', mime: '$mime', data: 'data:$mime;base64,$base64' },`n"
    }
}

$output += @"

];

// Export for use in main script
window.embeddedImages = base64Images;
"@

# Write to file
$output | Out-File -FilePath "D:\workspace2026\christmas-tree\embedded_images.js" -Encoding UTF8
Write-Host "Done! Created embedded_images.js"
