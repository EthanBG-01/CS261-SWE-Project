from flask import Flask
app = Flask(__name__)

# BASIC API: Don't change the main function for now; as currently, it exposes 5001 in the DockerFile, and the compose and nginx config makes use of this port.

@app.route('/')
def hello_world():
    return {'APIUser' : 'Active'}

@app.route('/test')
def test():
    return {'API: User Test' : 'Passed!'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001')