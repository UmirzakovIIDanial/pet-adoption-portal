import bcrypt
from pymongo import MongoClient

# Конфигурация
mongo_uri = "mongodb://admin:password123@localhost:27017/?authSource=admin"
db_name = "pet_adoption_db"
collection_name = "users"
user_email = "admin@example.com"
user_password = "admin123"

# Хэшируем пароль
hashed_password = bcrypt.hashpw(user_password.encode('utf-8'), bcrypt.gensalt())

# Подключаемся к MongoDB
client = MongoClient(mongo_uri)
db = client[db_name]
collection = db[collection_name]

# Проверяем, существует ли уже такой пользователь
existing_user = collection.find_one({"email": user_email})
if existing_user:
    print("⚠️ Пользователь с таким email уже существует.")
else:
    # Создаём нового пользователя
    new_user = {
        "email": user_email,
        "password": hashed_password.decode('utf-8'),
        "role": "admin"  # при необходимости можно указать роль или другие поля
    }
    collection.insert_one(new_user)
    print("✅ Пользователь успешно создан.")
