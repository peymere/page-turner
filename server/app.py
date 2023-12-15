from flask import request, make_response, session, jsonify
from flask_restful import Resource
from datetime import datetime
import ipdb

# local imports
from config import app, db, api
from models import User, BookClub, BookClubUser


class Users(Resource):
    def get(self):
        users = [u.to_dict() for u in User.query.all()]
        return make_response(
            users,
            200
        )
    def post(self):
        try:
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
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error creating user: {e}")
            return make_response({'error': 'Invalid request'}, 500)

api.add_resource(Users, '/api/v1/users')

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        else:
            return make_response(user.to_dict(), 200)
        
    def patch(self, id):
        if id != session.get('user_id'):
            return make_response({'error': 'Unauthorized'}, 401)
        else:
            user = User.query.filter_by(id=id).first()
            if not user:
                return make_response({'error': 'User not found'}, 404)
            params = request.json
            try:
                for attr in params:
                    setattr(user, attr, params[attr])
                    user.updated_at = datetime.utcnow()
            except ValueError as v_error:
                return make_response({'errors': str(v_error)}, 422)
            except Exception as e:
                print(f"Error updating user: {e}")
                return make_response({'errors': 'Invalid request'}, 500)    
            db.session.commit()

        return make_response(user.to_dict(), 200)
        

api.add_resource(UserById, '/api/v1/users/<int:id>')

class BookClubs(Resource):
    def get(self):
        book_clubs = [bc.to_dict(rules=('-users_joined', '-members', '-owner')) for bc in BookClub.query.all()]
        return make_response(
            book_clubs,
            200
        )
    def post(self):
        try:
            data = request.get_json()
            book_club = BookClub(
                name=data['name'], 
                description=data['description'], 
                avatar_url=data['avatarUrl'], 
                owner_id=session.get('user_id'),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(book_club)
            db.session.commit()
            return make_response(book_club.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error creating book club: {e}")
            return make_response({'error': 'Invalid request'}, 500)

api.add_resource(BookClubs, '/api/v1/bookclubs')

class BookClubById(Resource):
    def get(self, id):
        book_club = BookClub.query.filter_by(id=id).first()
        if not book_club:
            return make_response({'error': 'Book club not found'}, 404)
        else:
            return make_response(book_club.to_dict(rules=('members',)), 200)
        
    def patch(self, id):
        if id != session.get('user_id'):
            return make_response({'error': 'Unauthorized'}, 401)
        else:
            book_club = BookClub.query.filter_by(id=id).first()
            if not book_club:
                return make_response({'error': 'Book club not found'}, 404)
            params = request.json
            try:
                for attr in params:
                    setattr(book_club, attr, params[attr])
                    book_club.updated_at = datetime.utcnow()
            except ValueError as v_error:
                return make_response({'error': str(v_error)}, 422)
            except Exception as e:
                print(f"Error updating book club: {e}")
                return make_response({'error': 'Invalid request'}, 500)    
            db.session.commit()

        return make_response(book_club.to_dict(), 200)
api.add_resource(BookClubById, '/api/v1/bookclubs/<int:id>')

class BookClubUsers(Resource):
    def get(self):
        book_club_users = [bcu.to_dict() for bcu in BookClubUser.query.all()]
        return make_response(
            book_club_users,
            200
        )

api.add_resource(BookClubUsers, '/api/v1/bookclubsusers')
    

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

@app.before_request
def check_logged_id():
    # ipdb.set_trace()
    if request.endpoint in ['createbookclub'] and not session.get('user_id'):
        return make_response({'error': 'Unauthorized'}, 401)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
