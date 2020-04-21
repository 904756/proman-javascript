import database_connection
import bcrypt


@database_connection.connection_handler
def registration(cursor, username, password):
    hashpsw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    good_hash = hashpsw.decode('utf-8')
    cursor.execute(""" INSERT INTO proman_users (username, password)
                    VALUES (%(username)s, %(good_hash)s) """,
                   {'username': username, 'good_hash': good_hash})


@database_connection.connection_handler
def check_username_and_password(cursor, username, password):
    cursor.execute(""" SELECT password FROM proman_users 
                        WHERE username= %(username)s""",
                   {'username': username})
    password_info = cursor.fetchone()
    if password_info is None:
        return False
    good_password = password_info['password']
    psw_match = bcrypt.checkpw(password.encode('utf-8'), good_password.encode('utf-8'))
    return psw_match


@database_connection.connection_handler
def get_data_from_table(cursor):
    cursor.execute('''SELECT * FROM stories ''')
    all_stories = cursor.fetchall()
    return all_stories


@database_connection.connection_handler
def get_all_boards(cursor):
    cursor.execute(
        '''select boards.board_id, boards.board_name,boards.user_id, username from boards FULL JOIN proman_users ON boards.user_id=proman_users.user_id''')
    all_boards = cursor.fetchall()
    return all_boards


@database_connection.connection_handler
def create_new_board(cursor, name, username=None):
    cursor.execute('''INSERT INTO boards(board_name, user_id) VALUES (%(name)s, %(username)s)''',
                   {'name': name, 'username': username})


@database_connection.connection_handler
def get_user_id_by_name(cursor, user):
    cursor.execute('''
                    SELECT user_id FROM proman_users
                    WHERE username = %(user)s
                    ''',
                   {'user': user})
    user_id = cursor.fetchone()
    return user_id


@database_connection.connection_handler
def delete_board(cursor, board_id):
    cursor.execute('''DELETE from boards WHERE board_id = %(board_id)s''', {'board_id': board_id})
    cursor.execute("""DELETE FROM stories WHERE board_id = %(board_id)s""", {'board_id': board_id})


@database_connection.connection_handler
def create_card(cursor, col, name, board):
    cursor.execute("""INSERT INTO stories(column_name, story_name, board_id) VALUES(%(col)s, %(name)s, %(board)s)""",
                   {'col': col, 'name': name, 'board': board})


@database_connection.connection_handler
def update_status(cursor, story_name, column_name):
    cursor.execute('''
                    UPDATE stories 
                    SET column_name = %(column_name)s
                    WHERE story_name = %(story_name)s
    ''', {'column_name': column_name,
          'story_name': story_name})


@database_connection.connection_handler
def update_board(cursor, board_id, new_name):
    cursor.execute('''
                    UPDATE boards 
                    SET board_name = %(new_name)s
                    WHERE board_id = %(board_id)s
    ''', {'new_name': new_name,
          'board_id': board_id})
