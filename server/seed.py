from random import randint, choice as rc

#remote libraries
from faker import Faker
import bcrypt

#local imports
from app import app
from config import db
from models import User, BookClub, BookClubUser

fake = Faker()


def hash_password(password):
    if isinstance(password, str):
        password = password.encode('utf8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, salt)
    return hashed_password.decode('utf8')

def seed_users():
    users = []
    for _ in range(0, 20):
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

def seed_book_clubs():
    book_clubs = []
    for _ in range(0, 10):
        book_club = BookClub(
            name=fake.company(),
            description=fake.text(max_nb_chars=300),
            created_at=fake.date_time_this_year(),
            updated_at=fake.date_time_this_year(),
            owner_id=randint(1, 20)
        )
        book_clubs.append(book_club)
    return book_clubs

def seed_book_club_users():
    book_club_users = []
    for _ in range(0, 30):
        book_club_user = BookClubUser(
            user_id=randint(1, 20),
            book_club_id=randint(1, 10),
            joined_at=fake.date_time_this_year()
        )
        book_club_users.append(book_club_user)
    return book_club_users


if __name__ == '__main__':
    with app.app_context():
        print("Clearing database...")
        User.query.delete()
        BookClub.query.delete()

        print("Starting seed...")
        print("Seeding users...")
        users = seed_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding book clubs...")
        book_clubs = seed_book_clubs()
        db.session.add_all(book_clubs)
        db.session.commit()

        print("Seeding book club users...")
        book_club_users = seed_book_club_users()
        db.session.add_all(book_club_users)
        db.session.commit()

        print("Seed complete!")
