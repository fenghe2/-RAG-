from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from database import get_db
from schemas import Token, UserCreate, User
from config import settings
from dependencies import get_current_user
router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=User)
async def register(user: UserCreate, db=Depends(get_db)):
    # 使用 with 语句获取数据库连接
    with db as conn:
        try:
            # 检查用户名是否存在
            cursor = conn.execute("SELECT id FROM users WHERE username = ?", (user.username,))
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="用户名已存在！"
                )

            # 创建新用户
            hashed_password = get_password_hash(user.password)
            cursor = conn.execute(
                "INSERT INTO users (username, hashed_password) VALUES (?, ?)",
                (user.username, hashed_password)
            )
            conn.commit()

            # 获取新创建的用户
            cursor = conn.execute(
                "SELECT id, username FROM users WHERE username = ?",
                (user.username,)
            )
            new_user = cursor.fetchone()
            return dict(new_user)
        except Exception as e:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )


@router.post("/login", response_model=Token)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db=Depends(get_db)
):
    with db as conn:
        cursor = conn.execute("SELECT * FROM users WHERE username = ?", (form_data.username,))
        user = cursor.fetchone()

        if not user or not verify_password(form_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误！",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]},
            expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def read_current_user(
        username: str = Depends(get_current_user),
        db=Depends(get_db)
):
    with db as conn:  # 使用 with 语句获取连接
        cursor = conn.execute(
            "SELECT id, username FROM users WHERE username = ?",
            (username,)
        )
        user = cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return dict(user)