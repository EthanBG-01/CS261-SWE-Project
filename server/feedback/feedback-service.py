from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return {'APIFeedback' : 'Active'}

# BASIC API: Don't change the main function for now; as currently, it exposes 5003 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003')