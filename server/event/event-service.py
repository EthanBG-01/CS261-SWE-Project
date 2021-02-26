from flask import Flask, request, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, get_jwt_identity)
import mysql.connector
import json

app = Flask(__name__)
jwt = JWTManager(app)

# database credentials for my localmachine
config = {
                'user': 'faris',
                'password': '@Farismysql!',
                'host': 'localhost',
                'port': '3306',
                'database': 'userevent'
}

@app.route('/attendeeList', methods=['GET'])
# @jwt_required()
def attendeeList():
    request_data = request.get_json(force=True)

    # token = request_data['access_token']
    userType = request_data["userType"]
    userID = request_data["userID"]
    # userID = get_jwt_identity()

    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    # get event info from database
    query = "SELECT * FROM event NATURAL JOIN user_event WHERE userid = %s"
    try:
        cursor.execute(query, (userID, ))
        result = cursor.fetchall()          # list of tuples(rows)

        for row in result:
            eventName = row[1]
            hostName = row[2]
            description = row[3]
            eventType = row[4]
            startDate = row[5]
            endDate = row[6] 
            startTime = row[7]
            endTime = row[8]
            location = row[9]

    except Exception as e:
        return jsonify({'response': e}), 500

    cursor.close()
    connection.close()

def getEventInfo(row):
    

@app.route('/')
def hello_world():
    return {'APIEvent' : 'Active'}

# BASIC API: Don't change the main function for now; as currently, it exposes 5002 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='5002')