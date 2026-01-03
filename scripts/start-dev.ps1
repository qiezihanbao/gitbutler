# GitButler 开发环境启动脚本
# 用于在 Windows 上启动 GitButler 开发服务器

# 设置工作目录
Set-Location "D:\Git\gitbutler"

# 1. 检查端口占用
Write-Host "=== 检查端口 1420 占用情况 ==="
netstat -ano | findstr :1420

# 2. 如果有占用，结束进程（把 <PID> 替换为实际的进程ID）
# $port = netstat -ano | findstr :1420
# if ($port) {
#     $pid = ($port -split '\s+')[-1]
#     Write-Host "结束占用端口的进程 PID: $pid"
#     taskkill /PID $pid /F
# }

# 3. 启用 corepack
Write-Host "=== 启用 corepack ==="
corepack enable

# 4. 清理并重新安装依赖
Write-Host "=== 清理并重新安装依赖 ==="
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
pnpm install

# 5. 分步启动 - 先启动前端
Write-Host "=== 启动前端开发服务器 ==="
Start-Process -FilePath "pnpm" -ArgumentList "dev:internal-tauri" -PassThru

# 6. 等待前端启动（等待15秒）
Write-Host "等待前端服务器启动..."
Start-Sleep -Seconds 15

# 7. 检查前端是否启动成功
Write-Host "=== 检查前端服务状态 ==="
$frontendCheck = netstat -ano | findstr :1420

if ($frontendCheck) {
    Write-Host "前端服务已启动 ✓"

    # 8. 启动 Tauri 桌面应用
    Write-Host "=== 启动 Tauri 桌面应用 ==="
    pnpm tauri dev
} else {
    Write-Host "前端服务启动失败 ✗"
    Write-Host "请检查上面的错误信息"
}
