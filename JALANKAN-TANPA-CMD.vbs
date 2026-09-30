Set WshShell = CreateObject("WScript.Shell")

' 1. Jalankan sinkronisasi dan server di background tanpa jendela CMD (0 = Hidden)
WshShell.Run "cmd /c robocopy ""g:\My Drive\HEIMA.PROJECT\heima.creative"" ""D:\heima.creative"" /E /XD node_modules .next .git .claude .agents /XF *.ini *.log >nul 2>&1 & cd /d D:\heima.creative & npm.cmd run dev", 0, False

' 2. Beri jeda 3 detik lalu buka Microsoft Edge
WScript.Sleep 3000
WshShell.Run "cmd /c start """" ""C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"" ""http://localhost:3000""", 0, False
