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
