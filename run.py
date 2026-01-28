import subprocess
import time
import os
import signal
import sys
import platform

# 定义两个子进程
backend_process = None
frontend_process = None

def kill_port(port):
    """强力清理占用端口的僵尸进程"""
    try:
        if platform.system() == "Windows":
            cmd = f"netstat -ano | findstr :{port}"
            result = subprocess.check_output(cmd, shell=True).decode()
            for line in result.splitlines():
                parts = line.strip().split()
                if len(parts) > 4:
                    pid = parts[-1]
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, stderr=subprocess.DEVNULL)
        else:
            # Linux/Mac (Codespaces 环境)
            subprocess.run(f"fuser -k -n tcp {port}", shell=True, stderr=subprocess.DEVNULL)
    except:
        pass

def cleanup(signum=None, frame=None):
    """退出时的清理工作"""
    print("\n🛑 正在关闭系统，清理现场...")
    
    if backend_process:
        backend_process.terminate()
    
    if frontend_process:
        frontend_process.terminate()
        
    # 双重保险：再次强杀端口
    kill_port(8000)
    kill_port(3000)
    
    print("✅ 已退出。端口已释放。")
    sys.exit(0)

# 注册退出信号（按 Ctrl+C 时触发）
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    global backend_process, frontend_process

    print("🧹 1. 正在清理旧进程...")
    kill_port(8000)
    kill_port(3000)
    time.sleep(1)

    print("🧠 2. 启动后端大脑 (Port 8000)...")
    # 启动后端，不等待它结束，而是让它在后台跑
    backend_process = subprocess.Popen(
        ["python", "main.py"], 
        cwd="./backend",
        stdout=sys.stdout,
        stderr=sys.stderr
    )

    # 等待几秒，确保后端先跑起来
    time.sleep(2)

    print("🎨 3. 启动前端界面 (Port 3000)...")
    # 启动前端
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"], 
        cwd="./frontend",
        stdout=sys.stdout,
        stderr=sys.stderr
    )

    print("\n🚀 全系统已启动！")
    print("👉 后端: http://localhost:8000")
    print("👉 前端: http://localhost:3000")
    print("⚠️  按 Ctrl + C 可以一键关闭所有服务\n")

    # 保持主程序运行，直到用户按 Ctrl+C
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()