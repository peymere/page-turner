from random import randint, choice as rc

#remote libraries
from faker import Faker
import bcrypt

#local imports
from app import app
from config import db
from models import User

fake = Faker()


def hash_password(password):
    if isinstance(password, str):
        password = password.encode('utf8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, salt)
    return hashed_password.decode('utf8')

def seed_users():
    users = []
    for _ in range(0, 10):
        password = fake.password()
        hashed_password = hash_password(password)

        user = User(
            email=fake.email(),
            username=fake.user_name(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password_hash=hashed_password,
            created_at=fake.date_time_this_year(),
            updated_at=fake.date_time_this_year()
        )
        users.append(user)
    return users

if __name__ == '__main__':
    with app.app_context():
        print("Clearing database...")
        User.query.delete()

        print("Starting seed...")
        users = seed_users()
        db.session.add_all(users)
        db.session.commit()
