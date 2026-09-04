# ААА — сход-развал (лендинг)

Одностраничный сайт сервиса сход-развала «ААА» (СПб, Московский пр., 191А):
калькулятор стоимости, запись на время, отзывы, интро с проезжающей машиной.
React (CRA + craco) фронтенд и FastAPI + MongoDB бэкенд.

## Структура

```
frontend/   — React-приложение (craco/CRA)
backend/    — FastAPI API (заявки, отзывы, слоты)
```

## О восстановлении backend

В исходном проекте отсутствовал файл `backend/server.py` — на диске
оставался только скомпилированный `backend/__pycache__/server.cpython-311.pyc`.
Файл был восстановлен путём разбора байткода (`dis`), включая точный порядок
полей моделей, все роуты и все 18 отзывов дословно. Функционально
эквивалентен оригиналу, с добавленной авторизацией на `GET /api/bookings`
(см. ниже) — но если сохранилась ваша собственная копия `server.py` где-то
ещё, сверьте её с этим файлом перед деплоем.

## Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# отредактируйте .env: MONGO_URL, DB_NAME, CORS_ORIGINS,
# ADMIN_USERNAME/ADMIN_PASSWORD (обязательно смените пароль!)

uvicorn server:app --host 0.0.0.0 --port 8000
```

Эндпоинты:
- `GET  /api/`         — health-check
- `GET  /api/health`   — health-check
- `POST /api/bookings` — приём заявки (публичный)
- `GET  /api/reviews`  — отзывы, пагинация `?page&limit` (публичный)
- `GET  /api/slots`    — занятые слоты на дату `?date=` (публичный)
- `GET  /api/bookings` — список всех заявок (имена, телефоны), **требует
  HTTP Basic Auth** — логин/пароль администратора из `ADMIN_USERNAME`/
  `ADMIN_PASSWORD`

При первом запуске с пустой базой автоматически засеиваются 18 отзывов.

## Frontend

```bash
cd frontend
cp .env.example .env
# отредактируйте .env: REACT_APP_BACKEND_URL — адрес вашего backend без /api

yarn install
yarn start     # локальная разработка
yarn build     # production-сборка → папка build/
```

## Деплой

1. Разверните backend (FastAPI) с реальным MongoDB, задайте `.env` с боевыми
   значениями (`CORS_ORIGINS` — домен фронтенда, `ADMIN_USERNAME`/
   `ADMIN_PASSWORD` — надёжные значения).
2. Соберите frontend (`yarn build`), задав `REACT_APP_BACKEND_URL` на адрес
   боевого backend, и разместите содержимое `build/` на статическом хостинге
   или отдавайте через ваш веб-сервер (nginx и т.п.).
3. Никогда не коммитьте `.env` с реальными секретами — используйте
   `.env.example` как шаблон.

## Заставка (интро)

Картинка машины `frontend/public/car-cutout-alpha.png` была сжата с ~1.1 МБ
до ~180 КБ (без потери прозрачности) и подключена через `<link rel="preload">`
в `index.html` — иначе на мобильной сети она не успевала загрузиться за то
время, что показывается интро, и машина не отображалась.
