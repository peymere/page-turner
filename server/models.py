from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

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
    book_clubs_joined = db.relationship('BookClubUser', back_populates='user', cascade='all, delete-orphan')
    # proxy for book_clubs_joined.book_club
    book_clubs = association_proxy('book_clubs_joined', 'book_club')

    # serialize rules
    serialize_rules=('-_password_hash', '-book_clubs_joined.user', '-book_clubs_owned.owner')

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
    users_joined = db.relationship('BookClubUser', back_populates='book_club', cascade='all, delete-orphan')
    # proxy for users_joined.user
    members = association_proxy('users_joined', 'user')

    # serialize rules
    serialize_rules = ('-owner.book_clubs_owned', '-users_joined.book_club')

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
