from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')

@app.route("/registration-link")
def boards():
    ''' receives the json from the form and inserts it in the database'''
    user_information = request.get_json()

def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
