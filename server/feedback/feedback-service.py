from flask import Flask,jsonify
import pymongo
from pymongo import MongoClient

app = Flask(__name__)

# The init file for the database only runs once! Need to delete containers in docker app then build and up again
# if you make changes to it.

@app.route('/')
def hello_world():
    return {'APIFeedback' : 'Active'}

#############################
# Potentially research DB security in terms of user etc for the client thing.
@app.route('/responses', methods=["GET"])
def get_responses():
    client = MongoClient(host='feedback-analysis-db', port=27017, username='root', password='password', authSource='admin')

    db = client["feedback-analytics"]

    # Queries MongoDB fetches the feedback_tb table.
    _feedback = db.feedback_tb.find()
    responses = [{"userID": response["userID"], "eventID": response["eventID"], "text": response["text"]} for response in _feedback]
    return jsonify({"Feedback":responses})

###########################
# Example adding into mongoDB ~
@app.route('/feedback', methods=["POST"])
def add_response():


# BASIC API: Don't change the main function for now; as currently, it exposes 5003 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003')