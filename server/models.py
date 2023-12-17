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
    # proxy for book_clubs_joined.book_club
    book_clubs = association_proxy('book_clubs_joined', 'book_club')

    # serialize rules
    serialize_rules=('-_password_hash', '-book_clubs_joined.user', '-book_clubs_owned.owner', '-updated_at', '-book_clubs_joined.members', '-book_clubs_owned.members', )

    # validation rules
    @validates('first_name', 'last_name')
    def validate_name(self, key, new_name):
        if len(new_name) < 2:
            raise ValueError(f"{key} must be at least 2 characters")
        if not new_name:
            raise ValueError(f"{key} is required")
        return new_name
    
    @validates('username')
    def validate_username(self, key, new_username):
        if 3 > len(new_username) > 15 :
            raise ValueError(f"{key} must be between 3 and 15 characters")
        if not new_username:
            raise ValueError(f"{key} is required")
        return new_username

    @validates('password_hash')
    def validate_password(self, key, new_password):
        if 8 > len(new_password) > 20:
            raise ValueError(f"{key} must be between 8 and 20 characters")
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]', new_password):
            raise ValueError(f"{key} must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number")
        if not new_password:
            raise ValueError(f"password is required")
        return new_password
    
    @validates('email')
    def validate_email(self, key, new_email):
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
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ))
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ), onupdate=db.func.current_timestamp())
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # relationships
    owner = db.relationship('User', back_populates='book_clubs_owned')
    users_joined = db.relationship('BookClubUser', back_populates='book_club', cascade='all, delete-orphan', lazy='dynamic')
    # proxy for users_joined.user
    members = association_proxy('users_joined', 'user')

    # serialize rules
    serialize_rules = ('-owner.book_clubs_owned', '-users_joined', '-owner.book_clubs_joined', '-owner.created_at', '-members.book_clubs_joined', '-updated_at', '-members.book_clubs_owned', '-members.username', '-members.about_me', '-members.email', '-members.created_at')

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
