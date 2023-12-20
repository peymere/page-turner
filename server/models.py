from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
import re

# local imports
from config import db, bcrypt

# Models
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)
    profile_pic = db.Column(db.String)
    about_me = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ), onupdate=db.func.current_timestamp())

    # relationships
    book_clubs_owned = db.relationship('BookClub', back_populates='owner', cascade='all, delete-orphan')
    book_clubs_joined = db.relationship('BookClubUser', back_populates='user', cascade='all, delete-orphan', lazy='dynamic')
    users_books = db.relationship('UserBook', back_populates='user', cascade='all, delete-orphan')
    # proxy for book_clubs_joined.book_club
    book_clubs = association_proxy('book_clubs_joined', 'book_club')
    # proxy for users_books.book
    books = association_proxy('users_books', 'book')

    # serialize rules
    serialize_rules=('-_password_hash', '-book_clubs_joined.user', '-book_clubs_owned.owner', '-book_clubs_owned.book_clubs_books' '-updated_at', '-book_clubs_joined.members', '-book_clubs_owned.members', '-users_books.user', '-users_books.user_id' )

    # validation rules
    @validates('first_name', 'last_name')
    def validate_name(self, key, new_name):
        
        current_value = getattr(self, key)

        if new_name == None:
            return current_value

        
        if current_value == new_name:
            return new_name

        if len(new_name) < 2:
            raise ValueError(f"{key} must be at least 2 characters")
        if not new_name:
            raise ValueError(f"{key} is required")
        return new_name
    
    @validates('username')
    def validate_username(self, key, new_username):

        current_value = getattr(self, key)

        if new_username == None:
            return current_value

        if current_value == new_username:
            return new_username

        if not(3 <= len(new_username) <= 15) :
            raise ValueError(f"{key} must be between 3 and 15 characters")
        if not new_username:
            raise ValueError(f"{key} is required")
        return new_username

    @validates('password_hash')
    def validate_password(self, key, new_password):
        current_value = getattr(self, key)

        if new_password == None:
            return current_value

        if current_value == new_password:
            return new_password
        if not (8 <= len(new_password) <= 20):
            raise ValueError(f"{key} must be between 8 and 20 characters")
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]', new_password):
            raise ValueError(f"{key} must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number")
        if not new_password:
            raise ValueError(f"password is required")
        return new_password
    
    @validates('email')
    def validate_email(self, key, new_email):
        current_value = getattr(self, key)

        if new_email == None:
            return current_value

        if current_value == new_email:
            return new_email
        emails = [u.email for u in User.query.all()]
        if new_email in emails:
            raise ValueError(f"{key} is already in use")
        if not new_email:
            raise ValueError(f"{key} is required")
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', new_email):
            raise ValueError(f"{key} must be a valid email address")
        return new_email
    
    @validates('profile_pic')
    def validate_profile_pic(self, key, new_profile_pic):
        if new_profile_pic:
            if not re.match(r'^https?:\/\/.*\.(?:png|jpg|gif|jpeg|svg)$', new_profile_pic):
                raise ValueError(f"{key} must be a valid image url")
        return new_profile_pic
    
    @validates('about_me')
    def validate_about_me(self, key, new_about_me):
        if new_about_me:
            if len(new_about_me) > 300:
                raise ValueError(f"{key} must be less than 300 characters")
        return new_about_me

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, plain_text_password):
        byte_object= plain_text_password.encode('utf-8')
        encrypted_pw_obj = bcrypt.generate_password_hash(byte_object)
        hashed_pw_str = encrypted_pw_obj.decode('utf-8')
        self._password_hash = hashed_pw_str

    def authenticate(self, password_string):
        byte_object = password_string.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, byte_object)
    
    def __repr__(self):
        return f"<User #{self.id}: Username: {self.username}, Name: {self.first_name} {self.last_name}>"
    
class BookClub(db.Model, SerializerMixin):
    __tablename__ = 'book_clubs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String(300))
    avatar_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ), onupdate=db.func.current_timestamp())
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # relationships
    owner = db.relationship('User', back_populates='book_clubs_owned')
    users_joined = db.relationship('BookClubUser', back_populates='book_club', cascade='all, delete-orphan', lazy='dynamic')
    book_clubs_books = db.relationship('BookClubBook', back_populates='book_club', cascade='all, delete-orphan')
    # proxy for users_joined.user
    members = association_proxy('users_joined', 'user')
    # proxy for book_clubs_books.book
    books = association_proxy('book_clubs_books', 'book')

    # serialize rules
    serialize_rules = ('-owner.book_clubs_owned', '-users_joined', '-owner.book_clubs_joined', '-owner.created_at', '-members.book_clubs_joined', '-updated_at', '-members.book_clubs_owned', '-members.about_me', '-members.email', '-members.created_at')

    @validates('avatar_url')
    def validate_avatar_url(self, key, new_avatar_url):
        if new_avatar_url:
            if not re.match(r'^https?:\/\/.*\.(?:png|jpg|gif|jpeg|svg)$', new_avatar_url):
                raise ValueError(f"{key} must be a valid image url")
        return new_avatar_url

    @validates('description')
    def validate_description(self, key, new_description):
        if new_description:
            if len(new_description) > 300:
                raise ValueError(f"{key} must be less than 300 characters")
        return new_description

    def __repr__(self):
        return f"<BookClub #{self.id}: {self.name}>"
    
class BookClubUser(db.Model, SerializerMixin):
    __tablename__ = 'book_clubs_users'

    id = db.Column(db.Integer, primary_key=True)
    book_club_id = db.Column(db.Integer, db.ForeignKey('book_clubs.id'),index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True, nullable=False)
    joined_at = db.Column(db.DateTime)

    # relationships
    book_club = db.relationship('BookClub', back_populates='users_joined')
    user = db.relationship('User', back_populates='book_clubs_joined')

    # serialize rules
    serialize_rules = ('-book_club.users_joined', '-user.book_clubs_joined')

    def __repr__(self):
        return f"<BookClubUser #{self.id}: BookClubId={self.book_club_id}, UserID={self.user_id}>"
    
class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author_name = db.Column(db.String, nullable=False)
    cover_i = db.Column(db.Integer)
    key = db.Column(db.String, nullable=False)

    # relationships
    users_books = db.relationship('UserBook', back_populates='book', cascade='all, delete-orphan')
    book_clubs_books = db.relationship('BookClubBook', back_populates='book', cascade='all, delete-orphan')
    # proxy for users_books.user
    users = association_proxy('users_books', 'user')
    # proxy for book_clubs_books.book_club
    book_clubs = association_proxy('book_clubs_books', 'book_club')

    # serialize rules
    serialize_rules = ('-users_books', '-book_clubs_books', '-users', '-book_clubs' )


    def __repr__(self):
        return f"<Book #{self.id}: {self.title} by {self.author_name}>"
    
class UserBook(db.Model, SerializerMixin):
    __tablename__ = 'user_books'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    book_status = db.Column(db.Enum('read', 'reading', 'want to read'), nullable=False)

    # relationships
    book = db.relationship('Book', back_populates='users_books')
    user = db.relationship('User', back_populates='users_books')

    # serialize rules
    serialize_rules = ('-user.users_books', '-book.users_books', '-user.book_clubs_joined', '-user.book_clubs_owned', '-user.created_at', '-user.about_me', '-user.updated_at', '-book.book_clubs_books')

    def __repr__(self):
        return f"<UserBook #{self.id}: UserID={self.user_id}, BookID={self.book_id}, Status={self.book_status}>"
    
class BookClubBook(db.Model, SerializerMixin):
    __tablename__ = 'book_clubs_books'

    id = db.Column(db.Integer, primary_key=True)
    book_club_id = db.Column(db.Integer, db.ForeignKey('book_clubs.id'), index=True, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    currently_reading = db.Column(db.Boolean, default=True)

    # relationships
    book = db.relationship('Book', back_populates='book_clubs_books')
    book_club = db.relationship('BookClub', back_populates='book_clubs_books')


    # serialize rules
    serialize_rules = ('-book_club.book_clubs_books', '-book.book_clubs_books', '-book_club.users_joined', '-book_club.owner', '-book_club.created_at', '-book_club.updated_at', '-book_club.description', '-book_club.avatar_url', '-book_club.members')

    def __repr__(self):
        return f"<BookClubBook #{self.id}: BookClubID={self.book_club_id}, BookID={self.book_id}>"



