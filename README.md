# -RAG-
# 基于RAG的信息安全大语言模型问答系统开发
# 模块	          技术选型	                              作用
# 大模型服务	    vLLM + Qwen-0.5B-GGUF (Modelscope下载)	提供OpenAI兼容的API接口
# 后端框架        FastAPI + SQLAlchemy + JWT	            实现RESTful API和用户认证
# 向量数据库	    ChromaDB (轻量级)	                      存储知识库文档的向量
# 前端框架	      Vue3 + Pinia + Axios + Element Plus	    构建用户交互界面
