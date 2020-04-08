from flask import Flask, render_template, request, jsonify, make_response, session, redirect
import data_manager

app = Flask(__name__)

@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')


@app.route("/registration", methods=['POST'])
def registration():
    ''' receives the json from the form and inserts it in the database'''
    user_information = request.get_json()
    response = make_response(jsonify({'response': 'ce vrea madi'}), 200)
    username = user_information['username']
    password = user_information['password']
    data_manager.registration(username, password)
    return response


@app.route('/sign-in', methods=['POST'])
def sign_in():
    log_in_data = request.get_json()
    username = log_in_data['username']
    password = log_in_data['password']
    match = data_manager.check_username_and_password(username, password)
    print(str(match) + username + password)
    if match:
        message = 'Logging you in'
    else:
        message = 'Incorrect username or password'
    res = make_response(jsonify({'response': message}))
    return res

@app.route('/log-out')
def log_out():
    return redirect('/')

@app.route('/all-stories')
def all_stories():
    stories = data_manager.get_data_from_table()
    res = make_response(jsonify(stories))
    return res

@app.route('/all-boards')
def all_boards():
    boards = data_manager.get_all_boards()
    res = make_response(jsonify(boards))
    return res

def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
