@echo off
title 个人网站服务器
color 0A

echo.
echo ===============================================
echo           🌸 个人网站服务器启动脚本 🌸
echo ===============================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js环境检测通过

REM 检查package.json是否存在
if not exist package.json (
    echo ❌ 错误：未找到package.json文件
    echo 请确保在正确的项目目录下运行此脚本
    pause
    exit /b 1
)

echo ✅ 项目文件检测通过

REM 检查是否已安装依赖
if not exist node_modules (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 正在启动服务器...
echo 💡 启动后请查看控制台显示的局域网访问地址
echo 💡 按 Ctrl+C 可以停止服务器
echo.

REM 启动服务器
npm start

pause 