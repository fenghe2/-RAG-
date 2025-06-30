from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from auth import router as auth_router

app = FastAPI()

# 初始化数据库
init_db()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # 添加前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)