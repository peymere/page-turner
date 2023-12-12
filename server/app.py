from flask import request, make_response, session, jsonify
from flask_restful import Resource
from datetime import datetime
import ipdb

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
        user = User(
            email=data['email'], 
            username=data['username'], 
            first_name=data['firstName'], 
            last_name=data['lastName'],
            password_hash=data['password'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return make_response(user.to_dict(), 201)

api.add_resource(Users, '/api/v1/users')

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        else:
            return make_response(user.to_dict(), 200)
        
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        params = request.json
        try:
            for attr in params:
                setattr(user, attr, params[attr])
                user.updated_at = datetime.utcnow()
        except Exception as e:
            print(f"Error updating user: {e}")
            return make_response({'error': 'Invalid request'}, 500)    
        db.session.commit()

        return make_response(user.to_dict(), 200)
        

api.add_resource(UserById, '/api/v1/users/<int:id>')

@app.route('/api/v1/authorized')
def authorized():
    # import ipdb; ipdb.set_trace()
    try:
        user = User.query.filter_by(id=session.get('user_id')).first()
        return make_response(user.to_dict(), 200)
    except:
        return make_response({'error': 'User not found'}, 401)
    

@app.route('/api/v1/logout', methods=['DELETE'])
def logout():
    session.clear()
    return make_response({'message': 'Logged out'}, 200)

@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(username=data['username']).first()
        if user.authenticate(data['password']):
            session['user_id'] = user.id
            return make_response({'user': user.to_dict()}, 200)
        else:
            return make_response({'error': 'Incorrect password'}, 401)
    except:
        return make_response({'error': 'Incorrect username'}, 401)
    

@app.route('/')
def index():
    return '<h1>PageTurner Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
