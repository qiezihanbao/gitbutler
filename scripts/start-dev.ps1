# 设置工作目录
Set-Location "D:\Git\gitbutler"

# 1. 启用 corepack
Write-Host "=== 启用 corepack ==="
corepack enable

# 2. 检查并结束占用端口的进程
Write-Host "=== 检查端口 1420 占用情况 ==="
$portProcess = netstat -ano | findstr :1420
if ($portProcess) {
    Write-Host "端口 1420 被占用："
    $portProcess
    $pid = ($portProcess -split '\s+')[-1]
    Write-Host "结束进程 PID: $pid"
    taskkill /PID $pid /F
    Start-Sleep -Seconds 2
}

# 3. 清理缓存
Write-Host "=== 清理缓存 ==="
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue

# 4. 重新安装依赖
Write-Host "=== 重新安装依赖 ==="
pnpm install

# 5. 启动前端并捕获输出
Write-Host "=== 启动前端开发服务器 ==="
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Git\gitbutler"
    $env:VITE_BUTLER_PORT = "6978"
    $env:VITE_BUTLER_HOST = "localhost"
    $env:VITE_BUILD_TARGET = "web"
    pnpm --filter @gitbutler/desktop dev
}

# 6. 等待并检查输出
Write-Host "等待前端启动（30秒）..."
for ($i = 1; $i -le 30; $i++) {
    Start-Sleep -Seconds 1
    $jobOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
    if ($jobOutput) {
        Write-Host $jobOutput
    }
    
    # 检查端口是否被监听
    $portStatus = netstat -ano | findstr ":1420"
    if ($portStatus -and $portStatus -match "LISTENING") {
        Write-Host "前端服务已启动成功 ✓"
        break
    }
    
    Write-Host "等待中... $i/30 秒"
}

# 7. 最终检查
$finalCheck = netstat -ano | findstr ":1420"
if ($finalCheck) {
    Write-Host "=== 前端服务状态 ==="
    $finalCheck
    
    # 8. 启动 Tauri
    Write-Host "=== 启动 Tauri 桌面应用 ==="
    Stop-Job -Job $frontendJob
    Remove-Job -Job $frontendJob
    pnpm tauri dev
} else {
    Write-Host "=== 前端启动失败，获取详细错误信息 ==="
    $errorOutput = Receive-Job -Job $frontendJob -ErrorAction Continue
    Write-Host $errorOutput
    Stop-Job -Job $frontendJob
    Remove-Job -Job $frontendJob
}