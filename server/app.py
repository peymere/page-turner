from flask import request, make_response, session
from flask_restful import Resource
from datetime import datetime

from config import app, db, api
from models import User


class Users(Resource):
    def get(self):
        users = [u.to_dict() for u in User.query.all()]
        return make_response(
            users,
            200
        )
    def post(self):
        data = request.get_json()
        user = User(email=data['email'], username=data['username'], first_name=data['firstName'], last_name=data['lastName'],password_hash=data['password'],
        created_at=datetime.utcnow(),  
        updated_at=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return make_response(user.to_dict(), 201)

api.add_resource(Users, '/api/v1/users')


@app.route('/')
def index():
    return '<h1>PageTurner Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
