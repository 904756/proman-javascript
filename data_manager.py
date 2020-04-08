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
    cursor.execute('''select * from boards''')
    all_boards = cursor.fetchall()
    return all_boards


@database_connection.connection_handler
def create_new_board(cursor, name):
    cursor.execute('''INSERT INTO boards(board_name) VALUES (%(name)s)''', {'name': name})


@database_connection.connection_handler
def delete_board(cursor, board_id):
    cursor.execute('''DELETE from boards WHERE board_id = %(board_id)s''', {'boardid': board_id})
