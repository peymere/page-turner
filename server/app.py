from flask import request, make_response, session, jsonify
from flask_restful import Resource
from datetime import datetime
import ipdb

# local imports
from config import app, db, api
from models import User, BookClub, BookClubUser, Book, BookClubBook, UserBook


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
            return make_response(user.to_dict(rules=('book_clubs', '-book_clubs_joined')), 200)
        
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
                    if params[attr] is None or params[attr] == '':
                        continue

                    else:
                        setattr(user, attr, params[attr])
                        user.updated_at = datetime.utcnow()

            except ValueError as v_error:
                return make_response({'errors': str(v_error)}, 422)
            except Exception as e:
                print(f"Error updating user: {e}")
                return make_response({'errors': 'Invalid request'}, 500)    
            db.session.commit()
            return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        if id != session.get('user_id'):
            return make_response({'error': 'Unauthorized'}, 401)
        else:
            user = User.query.filter_by(id=id).first()
            if not user:
                return make_response({'error': 'User not found'}, 404)
            db.session.delete(user)
            db.session.commit()
            return make_response({'message': 'User deleted'}, 200)
        

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
                avatar_url=data['avatar_url'], 
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
        owner_id = session.get('user_id')
        if not owner_id:
            return make_response({'error': 'Unauthorized'}, 401)
        else:
            book_club = BookClub.query.filter_by(id=id).first()
            if not book_club or book_club.owner_id != owner_id:
                return make_response({'error': 'Book club not found or unauthorized'}, 404)
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
    def post(self):
        try:
            data = request.get_json()

            # Checks if user is already a member of the club
            existing_member = BookClubUser.query.filter_by(user_id=data['user_id'], book_club_id=data['book_club_id']).first()
            if existing_member:
                return make_response({'error': 'User is already a member of this club'}, 400)

            # Checks if user is the owner of the club
            book_club = BookClub.query.get(data['book_club_id'])
            if book_club.owner_id == data['user_id']:
                return make_response({'error': 'User is the owner of this club'}, 400)

            book_club_user = BookClubUser(
                user_id=data['user_id'], 
                book_club_id=data['book_club_id'], 
                joined_at=datetime.utcnow()
            )
            db.session.add(book_club_user)
            db.session.commit()
            return make_response(book_club_user.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error creating book club user: {e}")
            return make_response({'error': 'Invalid request'}, 500)
        
    
        
api.add_resource(BookClubUsers, '/api/v1/bookclubsusers')


class BookClubUserByUserAndClub(Resource):
    def delete(self, user_id, book_club_id):
        try:
            book_club_user = BookClubUser.query.filter_by(
                user_id=user_id, book_club_id=book_club_id).first()
            if not book_club_user:
                return make_response({'error': 'Book club user not found'}, 404)
            db.session.delete(book_club_user)
            db.session.commit()
            return make_response({'message': 'Book club user deleted'}, 200)
        except Exception as e:
            print(f"Error deleting book club user: {e}")
            return make_response({'error': 'Invalid request'}, 500)

api.add_resource(BookClubUserByUserAndClub, '/api/v1/bookclubsusers/<int:user_id>/<int:book_club_id>')

class Books(Resource):
    def get(self):
        books = [b.to_dict() for b in Book.query.all()]
        return make_response(
            books,
            200
        )
    
    def post(self):
        try:
            data = request.get_json()

            # checks if user is logged in
            if not session.get('user_id'):
                return make_response({'error': 'Unauthorized'}, 401)

            # Checks if book is already in the database
            existing_book = Book.query.filter_by(key=data['key']).first()
            if existing_book:
                return make_response({'error': 'This book is already in the database'}, 400)

            book = Book(
                title=data['title'], 
                author_name=data['author_name'],
                cover_i=data['cover_i'],
                key=data['key'],
            )
            db.session.add(book)
            db.session.commit()
            return make_response(book.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error creating book: {e}")
            return make_response({'error': 'Invalid request'}, 500)
    
api.add_resource(Books, '/api/v1/books')

class BookById(Resource):
    def get(self, id):
        book = Book.query.filter_by(id=id).first()
        if not book:
            return make_response({'error': 'Book not found'}, 404)
        else:
            return make_response(book.to_dict(), 200)

api.add_resource(BookById, '/api/v1/books/<int:id>')

class BookClubBooks(Resource):
    def get(self):
        book_club_books = [bcb.to_dict() for bcb in BookClubBook.query.all()]
        return make_response(
            book_club_books,
            200
        )
    def post(self):
        try:
            data = request.get_json()

            # Checks if club_owner is adding the book
            book_club = BookClub.query.get(data['book_club_id'])
            if book_club.owner_id != session.get('user_id'):
                return make_response({'error': 'Unauthorized'}, 401)

            # Checks if book is already in the club
            existing_book = BookClubBook.query.filter_by(book_id=data['book_id'], book_club_id=data['book_club_id']).first()
            if existing_book:
                return make_response({'error': 'This club has already saved this book'}, 400)
            
            book_club_book = BookClubBook(
                book_id=data['book_id'], 
                book_club_id=data['book_club_id'], 
                added_at=datetime.utcnow(),
                currently_reading=True,
            )
            db.session.add(book_club_book)
            db.session.commit()

            # set currently_reading to False for all other books in the club
            other_books = BookClubBook.query.filter_by(book_club_id=data['book_club_id']).all()
            for book in other_books:
                book.currently_reading = False
            db.session.commit()

            # add book to user's list
            user_book = UserBook(
                user_id=session.get('user_id'), 
                book_id=data['book_id'], 
                book_status='reading',
            )
            db.session.add(user_book)
            db.session.commit()

            # add book to club members' lists
            members = BookClubUser.query.filter_by(book_club_id=data['book_club_id']).all()
            for member in members:
                user_book = UserBook(
                    user_id=member.user_id, 
                    book_id=data['book_id'], 
                    book_status='reading',
                )
                db.session.add(user_book)
                db.session.commit()

            return make_response(book_club_book.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error adding book to book club: {e}")
            return make_response({'error': 'Invalid request'}, 500)
        
api.add_resource(BookClubBooks, '/api/v1/bookclubsbooks')

class UserBooks(Resource):
    def get(self):
        user_books = [ub.to_dict() for ub in UserBook.query.all()]
        return make_response(
            user_books,
            200
        )
    def post(self):
        try:
            data = request.get_json()

            # checks if user has permission to add book
            if data['user_id'] != session.get('user_id'):
                return make_response({'error': 'Unauthorized'}, 401)

            # Checks if book is already in the user's list
            existing_book = UserBook.query.filter_by(user_id=data['user_id'], book_id=data['book_id']).first()
            if existing_book:
                return make_response({'error': 'This user has already saved this book'}, 400)
            
            user_book = UserBook(
                user_id=data['user_id'], 
                book_id=data['book_id'], 
                book_status=data['book_status'],
            )
            db.session.add(user_book)
            db.session.commit()
            return make_response(user_book.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error adding book to user's list: {e}")
            return make_response({'error': 'Invalid request'}, 500)
        
    def patch(self):
        try:
            data = request.get_json()

            # checks if user has permission to update book
            if data['user_id'] != session.get('user_id'):
                return make_response({'error': 'Unauthorized'}, 401)

            # Checks if book is already in the user's list
            existing_book = UserBook.query.filter_by(user_id=data['user_id'], book_id=data['book_id']).first()
            if not existing_book:
                return make_response({'error': 'This user has not saved this book'}, 400)
            
            # updates book status
            existing_book.book_status = data['book_status']
            db.session.commit()
            return make_response(existing_book.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error updating book in user's list: {e}")
            return make_response({'error': 'Invalid request'}, 500)
        
    def delete(self):
        try:
            data = request.get_json()

            # checks if user has permission to delete book
            if data['user_id'] != session.get('user_id'):
                return make_response({'error': 'Unauthorized'}, 401)

            # Checks if book is already in the user's list
            existing_book = UserBook.query.filter_by(user_id=data['user_id'], book_id=data['book_id']).first()
            if not existing_book:
                return make_response({'error': 'This user has not saved this book'}, 400)
            
            db.session.delete(existing_book)
            db.session.commit()
            return make_response({'message': 'Book deleted from user list'}, 200)
        except ValueError as v_error:
            return make_response({'error': str(v_error)}, 422)
        except Exception as e:
            print(f"Error deleting book from user's list: {e}")
            return make_response({'error': 'Invalid request'}, 500)

api.add_resource(UserBooks, '/api/v1/usersbooks')
                

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
    
    if not session.get('user_id'):
        if request.endpoint == 'bookclubs' and request.method == 'POST':
            return make_response({'error': 'Unauthorized'}, 401)
        elif request.endpoint == 'usersbooks':
            return make_response({'error': 'Unauthorized'}, 401)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
