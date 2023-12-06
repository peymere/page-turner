from random import randint, choice as rc

#remote libraries
from faker import Faker

#local imports
from app import app
from config import db

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")