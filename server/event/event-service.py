from flask import Flask, request, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, get_jwt_identity)
import mysql.connector
import json
import datetime

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
    query = "SELECT * FROM events NATURAL JOIN userevent WHERE userid = %s"
    try:
        cursor.execute(query, (userID, ))
        result = cursor.fetchall()          # list of tuples(rows)
        attendeeDetails = [getAttendeeDetails(event) for event in result]   # I haven't put the "completed: True/False" field because im not sure what that is.
        return jsonify(attendeeDetails)       
    except Exception as e:
        return jsonify({'response': e}), 500

    cursor.close()
    connection.close()

def getAttendeeDetails(row):
    return {'eventName':row[2], 'hostName':row[3], 'startTime':str(row[8]), 'endTime':str(row[9]), 'startDate':row[6], 'endDate':row[7]}

@app.route('/hostList', methods=['GET'])
# returns: eventName 2, eventType 5, startTime 8, startDate 6, live:Boolean, completed:Boolean
def hostList():
    request_data = request.get_json(force=True)
    userType = request_data["userType"]
    userID = request_data["userID"]

    # host validation
    if userType != 'host':
        return jsonify(response="Invalid Host"), 400

    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()

    # get event info from database
    query = "SELECT * FROM events NATURAL JOIN userevent WHERE userid = %s"
    try:
        cursor.execute(query, (userID, ))
        result = cursor.fetchall()          # list of tuples(rows)
        eventDetails = [getHostDetails(event) for event in result] 
        return jsonify(eventDetails)       
    except Exception as e:
        return jsonify({"response": e}), 500

    cursor.close()
    connection.close()

def getHostDetails(row):
    startTime = row[8]
    endTime = row[9]    #datetime.timedelta
    curTime = getCurrentTime()

    completed = True if curTime > endTime else False
    live = True if (startTime <= curTime <= endTime) else False

    return {"eventName": row[2], "eventType":row[5], "startTime": str(startTime), "startDate": str(row[6]), "live":live, "completed":completed}

def getCurrentTime():
    now = datetime.datetime.now()
    curTime = datetime.timedelta(hours= now.hour, minutes= now.minute, seconds=now.second)
    return curTime

@app.route('/')
def hello_world():
    return {'APIEvent' : 'Active'}

# BASIC API: Don't change the main function for now; as currently, it exposes 5002 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='5002')