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
    if match:
        message = 'Logging you in'
    else:
        message = 'Incorrect username or password'
    res = make_response(jsonify({'response': message}), 200)
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


@app.route('/new-board', methods=['POST'])
def new_board():
    name = request.get_json()['name']
    username = request.get_json()['username']
    if username is None:
        data_manager.create_new_board(name)
    else:
        user_id = data_manager.get_user_id_by_name(username)['user_id']
        data_manager.create_new_board(name, user_id)

    res = make_response(jsonify({'response': 'it worked'}), 200)
    return res


@app.route('/new-card', methods=['GET', 'POST'])
def new_card():
    card_info = request.get_json()
    name = card_info['name']
    col = card_info['col']
    board = card_info['board_id']
    data_manager.create_card(col, name, int(board))
    res = make_response(jsonify({'response': 'it worked'}), 200)
    return res


@app.route('/delete', methods=['GET', 'POST'])
def delete():
    board_id = request.get_json()['board']
    data_manager.delete_board(int(board_id))
    res = make_response(jsonify({'response': 'it worked'}), 200)
    return res


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
