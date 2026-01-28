from fastapi import FastAPI, Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import base64
import io
import os
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

# === 1. 安全加载环境变量 ===
load_dotenv() # 这会自动读取同目录下的 .env 文件
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("❌ 警告: 未找到 GEMINI_API_KEY，请检查 .env 文件")

# === 2. 配置 Gemini 2.5 ===
genai.configure(api_key=API_KEY)

# 🔥 使用最新的 2.5 Flash Image 模型
# 这个模型原生支持：[图+文] 输入 -> [图+文] 输出
# 也就是它能直接听懂 "把背景扣掉" 并吐出一张透明底的图，不需要外挂
model = genai.GenerativeModel('gemini-2.5-flash-image')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "⚡️ Gemini 2.5 Flash Image 引擎已就绪"}

@app.post("/run_node")
async def run_node(
    prompt: str = Form(...), 
    image: UploadFile = File(None), 
    is_image_mode: str = Form("false")
):
    print(f"🧠 [Gemini 2.5] 收到任务: {prompt[:30]}...")

    try:
        # 1. 处理输入图片
        pil_image = None
        if image:
            content = await image.read()
            pil_image = Image.open(io.BytesIO(content))
            print("📸 图片已加载")
        
        # 2. 构造 2.5 多模态请求
        # 现在的 prompt 可以非常直接，比如 "Remove background" 或者 "Change the cat to a dog"
        inputs = [prompt]
        if pil_image:
            inputs.append(pil_image)
            
        print("🚀 发送给 Gemini 2.5 Flash Image...")
        
        # 3. 调用生成 (注意：2.5 的 output 可能包含 image)
        response = model.generate_content(inputs)
        
        # 4. 解析结果 (混合模态解析)
        # Gemini 2.5 Flash Image 返回的 part 可能包含 text 也可能包含 inline_data (图片)
        
        output_text = ""
        output_image_b64 = None
        
        # 遍历返回的每一个部分
        if response.parts:
            for part in response.parts:
                if part.text:
                    output_text += part.text
                if part.inline_data:
                    # 🔥 抓到了！模型直接生成了图片！
                    print("🎨 模型返回了原生图片数据")
                    # inline_data 通常是 raw bytes，我们需要转成 base64 传给前端
                    # 注意：这里假设 SDK 返回的是 bytes 或者包含 data 属性的对象
                    # 具体取决于 google-generativeai 的版本，通常是 part.inline_data.data
                    img_data = part.inline_data.data
                    output_image_b64 = base64.b64encode(img_data).decode('utf-8')

        # 5. 构造返回给前端的数据
        # 如果模型生成了图，优先返回图；否则返回字
        if output_image_b64:
            print("✅ 返回生成图")
            return {
                "status": "success", 
                "type": "image", 
                "output": output_image_b64
            }
        else:
            print(f"✅ 返回文本: {output_text[:20]}...")
            return {
                "status": "success", 
                "type": "text", 
                "output": output_text if output_text else "模型处理完成，但未返回内容。"
            }

    except Exception as e:
        print(f"❌ 2.5 报错: {e}")
        # 容错：如果 2.5 Image 挂了或者 Key 不对，返回一个错误提示
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)