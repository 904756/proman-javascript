import database_connection
import bcrypt

@database_connection.connection_handler
def registration(cursor, username, password):
    hashpsw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    good_hash = hashpsw.decode('utf-8')
    cursor.execute(""" INSERT INTO proman_users (username, password)
                    VALUES (%(username)s, %(good_hash)s) """,
                    {'username': username, 'good_hash': good_hash})

