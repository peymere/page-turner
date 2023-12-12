from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules=('-_password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String)
    _password_hash = db.Column(db.String)
    profile_pic = db.Column(db.String)
    about_me = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

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
        return f"<User #{self.id}: {self.username}>"
    
class BookClub(db.Model, SerializerMixin):
    __tablename__ = 'book_clubs'

    # serialize_rules=('-_password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String(300))
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # owner = db.relationship('User', backref='book_clubs_owned')
    owner = db.relationship('User', backref='book_clubs_owned')
    members = db.relationship('User', secondary='book_clubs_users', backref='book_clubs_joined')
    books = db.relationship('Book', secondary='book_clubs_books', backref='book_clubs')
    meetings = db.relationship('Meeting', backref='book_club')

    def __repr__(self):
        return f"<BookClub #{self.id}: {self.name}>"
