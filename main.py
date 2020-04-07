from flask import Flask, render_template, request, jsonify, make_response


app = Flask(__name__)


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')

@app.route("/registration", methods = ['POST'])
def registration():
    ''' receives the json from the form and inserts it in the database'''
    user_information = request.get_json()
    response = make_response(jsonify({'response': 'ce vrea madi'}), 200)

    print(user_information)
    return response

def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
