$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = "C:\Users\Bonzo2\Desktop\JIMBO-Pro.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "T:\Jimbo_devzAssist_hub\RUN_JIMBO_PRO.bat"
$Shortcut.WorkingDirectory = "T:\Jimbo_devzAssist_hub"
$Shortcut.IconLocation = "T:\Jimbo_devzAssist_hub\public\favicon.ico"
$Shortcut.Description = "Launch JIMBO-Pro Desktop Hub"
$Shortcut.Save()

Write-Host "Shortcut created on desktop: $ShortcutPath" -ForegroundColor Green
