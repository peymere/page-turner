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
