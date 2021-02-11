from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return {'API: User' : 'Active'}

@app.route('/test')
def test():
    return {'API: User Test' : 'Passed!'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001')