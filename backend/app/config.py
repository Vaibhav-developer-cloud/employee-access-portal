from dotenv import load_dotenv
import os

load_dotenv()

# JWT / Auth settings (read from environment with sensible defaults)
SECRET_KEY = os.getenv("SECRET_KEY", "MYSECRETKEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
except ValueError:
    ACCESS_TOKEN_EXPIRE_MINUTES = 60
