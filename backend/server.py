import logging
import os
import secrets
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
# serverSelectionTimeoutMS keeps a misconfigured/unreachable MONGO_URL from
# hanging the app's startup event forever — it fails fast instead, and the
# app still comes up to serve requests (returning 500s on DB operations)
# rather than never finishing "Waiting for application startup."
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="AAA Skhod-Razval API")
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Admin authentication (HTTP Basic)
#
# Credentials come from environment variables so they never live in source
# control. If they are not configured, admin-only endpoints are disabled
# (return 503) rather than silently falling back to an open or guessable
# default — this avoids accidentally shipping an unprotected /bookings
# route (the site's "leads" list — customer names and phone numbers).
# ---------------------------------------------------------------------------
security = HTTPBasic()

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def require_admin(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    if not ADMIN_USERNAME or not ADMIN_PASSWORD:
        logger.error(
            "ADMIN_USERNAME/ADMIN_PASSWORD is not configured — refusing admin request."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin access is not configured on this server.",
        )

    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


class BookingCreate(BaseModel):
    name: Optional[str] = Field(default="", max_length=120)
    phone: Optional[str] = Field(default="", max_length=32)
    service: Optional[str] = Field(default="", max_length=120)
    car_brand: Optional[str] = Field(default="", max_length=60)
    car_model: Optional[str] = Field(default="", max_length=60)
    car_class: Optional[str] = Field(default="", max_length=60)
    date: Optional[str] = Field(default="", max_length=20)
    time: Optional[str] = Field(default="", max_length=10)
    price: Optional[str] = Field(default="", max_length=40)
    when: Optional[str] = Field(default="", max_length=60)
    comment: Optional[str] = Field(default="", max_length=500)


class Booking(BookingCreate):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "AAA Skhod-Razval API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    booking = Booking(**input.model_dump())
    doc = booking.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.bookings.insert_one(doc)
    return booking


# ---------------------------------------------------------------------------
# Admin-only: GET /bookings exposes customer names and phone numbers, so it
# must never be publicly reachable. It now requires HTTP Basic auth via
# ADMIN_USERNAME / ADMIN_PASSWORD (see .env.example).
# ---------------------------------------------------------------------------
@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(admin: str = Depends(require_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


@api_router.get("/reviews")
async def get_reviews(page: int = Query(1, ge=1), limit: int = Query(24, ge=1, le=100)):
    skip = (page - 1) * limit
    total = await db.reviews.count_documents({})
    docs = await db.reviews.find({}, {"_id": 0}).sort("date", -1).skip(skip).limit(limit).to_list(limit)
    return {"items": docs, "total": total, "has_more": skip + len(docs) < total}


@api_router.get("/slots")
async def get_slots(date: str = Query("")):
    docs = await db.bookings.find({"date": date}, {"_id": 0, "time": 1}).to_list(500)
    return {"booked": [d["time"] for d in docs]}


app.include_router(api_router)

_cors_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Seed reviews (reconstructed verbatim from the original compiled server —
# see README for how; the .py source was missing from the uploaded project,
# only backend/__pycache__/server.cpython-311.pyc was present).
# ---------------------------------------------------------------------------
SEED_REVIEWS = [
    {"author": 'Дмитрий К.', "source": 'Google', "rating": 5, "date": '2026-08-14', "text": 'Сделал сход-развал после замены рычагов. Показали распечатку до и после, всё объяснили. Руль теперь ровно, машину не уводит.'},
    {"author": 'Алексей', "source": '2ГИС', "rating": 5, "date": '2026-08-09', "text": 'Приехал по записи — сразу заехал на стенд, без ожидания. Сорок минут и готово. Так держать!'},
    {"author": 'Игорь В.', "source": 'Yell', "rating": 5, "date": '2026-07-28', "text": 'Резину жрало с внутренней стороны. После регулировки развала проблема ушла. Спасибо мастеру за внимательность.'},
    {"author": 'Максим', "source": 'Google', "rating": 4, "date": '2026-07-21', "text": 'Нормальный 3D-стенд, адекватные цены. Единственное — в выходные лучше записываться заранее, народу много.'},
    {"author": 'Ольга С.', "source": '2ГИС', "rating": 5, "date": '2026-07-15', "text": 'Делала сход-развал на кроссовере. Всё быстро, показали значения на экране, посоветовали подкачать колёса.'},
    {"author": 'Сергей П.', "source": 'Google', "rating": 5, "date": '2026-07-06', "text": 'Отдельное спасибо за честность: сказали, что схождение в норме и регулировать не нужно. Не стали брать деньги впустую.'},
    {"author": 'Антон', "source": 'Yell', "rating": 5, "date": '2026-06-29', "text": 'После ям руль стоял криво. За полчаса выставили углы — руль ровно, вибрация ушла. Рекомендую.'},
    {"author": 'Павел', "source": '2ГИС', "rating": 5, "date": '2026-06-20', "text": 'Комната ожидания с кофе и телевизором — пока делали развал-схождение, спокойно поработал с ноутбуком.'},
    {"author": 'Роман Г.', "source": 'Google', "rating": 5, "date": '2026-06-11', "text": 'Записывался через WhatsApp, ответили за пару минут. Итоговая цена совпала с озвученной заранее.'},
    {"author": 'Владимир', "source": 'Yell', "rating": 5, "date": '2026-06-02', "text": 'Мастер заметил люфт шаровой и честно сказал: сначала замените, потом регулировка. Не стали делать на неисправной подвеске.'},
    {"author": 'Евгений', "source": '2ГИС', "rating": 5, "date": '2026-05-24', "text": 'Делаю здесь сход-развал каждую весну после переобувки. Стабильно хорошо уже третий год.'},
    {"author": 'Марина Л.', "source": 'Google', "rating": 5, "date": '2026-05-16', "text": 'Балансировка плюс развал-схождение за один заезд. Удобно, что всё в одном месте, и есть где подождать.'},
    {"author": 'Кирилл', "source": 'Yell', "rating": 4, "date": '2026-05-08', "text": 'Цены чуть выше гаражных сервисов, но и стенд современный, и результат с распечаткой. Стоит того.'},
    {"author": 'Андрей Н.', "source": 'Google', "rating": 5, "date": '2026-04-30', "text": 'Машину перестало тянуть вправо. Жалею только, что не приехал раньше — шины бы дольше прожили.'},
    {"author": 'Николай', "source": '2ГИС', "rating": 5, "date": '2026-04-19', "text": 'Вежливый персонал, всё по-человечески. Оплата после того, как сам покатался и проверил результат.'},
    {"author": 'Артём Д.', "source": 'Google', "rating": 5, "date": '2026-04-07', "text": 'Коммерческий фургон — не везде берутся делать развал, здесь сделали без вопросов и задержек.'},
    {"author": 'Георгий', "source": 'Yell', "rating": 5, "date": '2026-03-26', "text": 'После регулировки машина идёт ровно, даже расход чуть упал. Однозначно рекомендую.'},
    {"author": 'Станислав', "source": '2ГИС', "rating": 4, "date": '2026-03-15', "text": 'Записался на вечер после работы — очень удобно, что работают до девяти. Сделали качественно.'},
]


@app.on_event("startup")
async def seed_reviews():
    try:
        num = await db.reviews.count_documents({})
        if num == 0:
            await db.reviews.insert_many(
                [{"id": str(uuid.uuid4()), **r} for r in SEED_REVIEWS]
            )
            logger.info("Seeded %d reviews", len(SEED_REVIEWS))
    except Exception:
        # Don't let a temporarily unreachable database block startup —
        # log it and let the app come up; endpoints will surface their own
        # errors on the next DB call once Mongo is reachable.
        logger.exception("Could not seed reviews on startup (is MongoDB reachable?)")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
