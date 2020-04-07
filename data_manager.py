@database_connection.connection_handler
def display_latest_five_questions(cursor):
    cursor.execute("""
                    SELECT id,title FROM question
                    ORDER BY submission_time DESC 
                    LIMIT 5;
                    """)
    questions = cursor.fetchall()
    return questions


