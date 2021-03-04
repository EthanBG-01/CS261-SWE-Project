from flask import Flask, request, jsonify
import mysql.connector
import json
# import logging
import re
import os
import random
# import bcrypt
# import jwt
from datetime import datetime, date, time, timedelta
# import datetime
# import base64
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, get_jwt_identity)
import itertools


app = Flask(__name__)

jwt = JWTManager(app)


app.config['JWT_SECRET_KEY'] = "iFPxhXS9QGIk6DWYeWjI4YT_km4Y1B6PfpDABahC1GQ"


config = {
            'user' : 'root',
            'password' : 'root',
            'host' : 'user-event-db',
            'port' : '3306',
            'database' : 'userEvent'
 }



# @app.route('/')
# def hello_world():
#     return {'APIEvent' : 'Active'}


def selectUsers():
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    cursor.execute('SELECT * from Users')
    results = []
    for row in cursor:
        results.append(row)
    print(results)
    cursor.close()
    connection.close()





# expired access token : userID3 - host
# eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDUxNTY1NSwianRpIjoiNmE1MDI4NDUtNjk4NS00YjE1LWI0ODktNTJmNzBlNTQ4NGEyIiwibmJmIjoxNjE0NTE1NjU1LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJleHAiOjE2MTQ1MTU2NzB9.6yXucha_wU4WHDo0tpw-AbQLcyUqaPzPm2N8vDlwZvE

#	expired access token : userID4 - attendee
# eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDUxNTg2NiwianRpIjoiMzdiYThiYzctZjhhZC00YjJlLTlkODUtODA3NzUzOTcyYWQ4IiwibmJmIjoxNjE0NTE1ODY2LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjo0LCJleHAiOjE2MTU4MTE4NjZ9.Z3Mht1MV7GOhoSQXas-GaoJ6VdN1zcgJW5kMUmMPRaA





@app.route('/attendee-list', methods=["GET"])
@jwt_required()
def attendeeList():
	userID = get_jwt_identity()
	print("userID : ", userID)


	connection = mysql.connector.connect(**config)
	cursor = connection.cursor()
	selectQuery = "SELECT * FROM Events NATURAL JOIN UserEvents WHERE userID =%s AND userType=%s"
	try:
		cursor.execute(selectQuery, (userID, "attendee"))
		result = cursor.fetchall()
		if not result:
			connection.close()
			return jsonify({"response" : "You have not joined any events yet."}), 200
		singleSessionList = []
		multipleSessionList = []
		for row in result:
			if (row[10] is None):			# row[10] is the parentID.
				singleSessionList.append(row)
			else:
				multipleSessionList.append(row)
			# print("\n")
			# print("row[10] : ", row[10])
		# for each session in single Session List: return its details after checking live, completed. send multi session flag too.


		returnSingleArray = singleSessions(singleSessionList)



		returnMultiArray = multiSessions(multipleSessionList, "attendee")

		connection.commit()
		cursor.close()

	except Exception as e:
		connection.close()
	cursor.close()
	connection.close()
	return jsonify({"single" : returnSingleArray, "multi" : returnMultiArray})



# {"msg" : "Missing authorization header"} , 401
# {"msg" : "only access tokens are allowed"} , 422
# {"msg" : "token has expired"} , 401





# access token 3
# eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDYwNDA3NiwianRpIjoiZDEwOTVhNTctNDU1OC00YWE2LWE2OGMtMmE3ZTc1YTY5ZTY2IiwibmJmIjoxNjE0NjA0MDc2LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozLCJleHAiOjE2MTU5MDAwNzZ9.f1NqpNiwmW9eRD9VaIH7FXtrTzQJQxVIuRhDNICQIq4

# 60272109 - eventID 7
# 95323351 - eventID 8

# access token 1

# eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDYxMDQxNSwianRpIjoiYmI0ZDI1NzYtYzc4NS00MjM2LWFkNDEtMTk2YWM0NDJkNjc2IiwibmJmIjoxNjE0NjEwNDE1LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJleHAiOjE2MTU5MDY0MTV9.iwEDumUo-7Z0QKCEWPzPfYhzGZIesXZIohtPpAnN1tg


def singleSessions(singleSessionList):
	returnSingleArray = []
	singleDict = {}
	for session in singleSessionList:
		# check for completed and live.
		startTime = session[8]
		startTime = (datetime.min + startTime).time()
		# print("startTime : ", startTime)

		startDate = session[6]

		endTime = session[9]
		endTime = (datetime.min + endTime).time()
		# print("endTime : ", endTime)

		endDate = session[7]

		now = datetime.now()
		currentTime = now.strftime("%H:%M:%S")
		currentTime = datetime.strptime(currentTime, "%H:%M:%S").time()
		today = date.today()


		completed = False
		if (today == endDate):
		# check time - if current time is after the end time.
			if (currentTime > endTime):
				completed = True
		elif (today > endDate):
			# today is after endDate so completed is true.
			completed = True

		live = False
		if (startDate <= today <= endDate):
			if (startTime <= currentTime <= endTime):
				live = True
		singleDict = {"eventName" : session[2], "description" : session[4], "hostName" : session[3], "eventType" : session[5], "startTime" : str(session[8]), "startDate" : str(session[6]), "endTime" : str(session[9]), "endDate" : str(session[7]), "live" : live, "completed" : completed, "eventCode" : session[1], "eventID" : session[0]}
		# print("\n")
		# print("singleDict : ", singleDict)
		returnSingleArray.append(singleDict)
		# print("\n")
		# print("returnSingleArray : ", returnSingleArray)
	# # [0] - eventID , [1] = event code , [2] event name , [3] host name , [4] description , [5] event type , [6] startDate
	# [7] endDate , [8] startTime , [9] endTime , [10] parentID , [11] userID , [12] userType
	return returnSingleArray


def multiSessions(multipleSessionList, status):
	returnMultiArray = []
	multiDict = {}
	multipleSessionList.sort(key = lambda x: x[10])				# sort by parentID.
	print("multipleSessionList : ", multipleSessionList)

	eventList = []
	anIterator = itertools.groupby(multipleSessionList, lambda x : x[10])
	for key, group in anIterator:
		keyGroup = {key : list(group)}
		# print("keyGroup")
		# print(keyGroup)
		# print("type : ", type(keyGroup))
		# print("value : ", keyGroup[key])
		print("\n")
		eventList.append(keyGroup[key])

	# print("eventList : ", keyGroup[key])
	# print("length : ", len(eventList))
	# print("\n")

	print("eventList : ", eventList)

	# print("before sessionNext")
	eventIDList = []
	startTimeList = []
	endTimeList = []
	startDateList = []
	endDateList = []
	for event in eventList:
		eventCopy = event[:]
		print("\n")
		# print("event in multiSessions : ", event)
		eventIDList = []
		startTimeList = []
		endTimeList = []
		startDateList = []
		endDateList = []

		if (status == "host"):
			for session in event:
				# hello, sir!
				# if (checkCompleted(session[0], session[8], session[9], session[6], session[7])) == False:
				# 	adsf
				print("session : ", session)
				eventIDList.append(session[0])
				startTimeList.append(str(session[8]))
				endTimeList.append(str(session[9]))
				startDateList.append(str(session[6]))
				endDateList.append(str(session[7]))
		# print("lists : \n")
		# print(eventIDList)
		# print(startTimeList)
		# print(endTimeList)
		# print(startDateList)
		# print(endDateList)
		elif (status == "attendee"):
			for session in event[:]:
				print("session : ", session)
				if (checkCompleted(session[0], session[8], session[9], session[6], session[7])) == True:
					event.remove(session)
				else:
					eventIDList.append(session[0])
					startTimeList.append(str(session[8]))
					endTimeList.append(str(session[9]))
					startDateList.append(str(session[6]))
					endDateList.append(str(session[7]))

		# print("event[:] : ", event[:])
		# just create a new function that checks if a session is completed, if yes return none, otherwise return its details.

		# print("event just before sessionNext: ", event)

		nextSession, completed, live = sessionNext(event, status)
		# returns if whole event is completed or live.
		print("nextSession : ", nextSession)
		# if (status == "attendee"):
		# if complete is true then we just keep it as it is, but if completed is false then.

		if (nextSession is None):
			# attendee list : event is completed.
			multiDict = {"eventName" : eventCopy[len(eventCopy) - 1][2], "hostName":eventCopy[len(eventCopy)-1][3], "description":eventCopy[len(eventCopy)-1][4], "eventType" : eventCopy[len(eventCopy) - 1][5], "startTime" : str(eventCopy[len(eventCopy) - 1][8]), "startDate" : str(eventCopy[len(eventCopy) - 1][6]), "endTime" : str(eventCopy[len(eventCopy) - 1][9]), "endDate" : str(eventCopy[len(eventCopy) - 1][7]), "live" : live, "completed" : completed, "eventCode" : eventCopy[len(eventCopy) - 1][1], "eventID" : eventIDList}
			# print("hheya")
			# print(eventCopy[len(eventCopy) - 1])
			print("\n")
			print("multiDict : ", multiDict)


		else:

			multiDict = {"eventName" : nextSession[2], "hostName":nextSession[3], "description":nextSession[4], "eventType" : nextSession[5], "startTime" : startTimeList, "startDate" : startDateList, "endTime" : endTimeList, "endDate" : endDateList, "live" : live, "completed" : completed, "eventCode" : nextSession[1], "eventID" : eventIDList}
			print("\n")
			print("multiDict : ", multiDict)
		returnMultiArray.append(multiDict)
		print("\n")
		print("returnMultiArray : ", returnMultiArray)
	return returnMultiArray

def checkCompleted(eventID, startTime, endTime, startDate, endDate):
	now = datetime.now()
	currentTime = now.strftime("%H:%M:%S")
	print("Current Time =", currentTime)
	currentTime = datetime.strptime(currentTime, "%H:%M:%S").time()
	print("current time type : ", type(currentTime))

	today = date.today()
	print("Today's date:", today)

	print("today type : ", type(today))

	startTime = (datetime.min + startTime).time()

	endTime = (datetime.min + endTime).time()

	completed = False
	if (today == endDate):
	# check time - if current time is after the end time.
		if (currentTime > endTime):
			completed = True
	elif (today > endDate):
		# today is after endDate so completed is true.
		completed = True
	return completed











@app.route('/host-list', methods=["GET"])
@jwt_required()
def hostList():
	userID = get_jwt_identity()
	print("userID : ", userID)


	connection = mysql.connector.connect(**config)
	cursor = connection.cursor()
	selectQuery = "SELECT * FROM Events NATURAL JOIN UserEvents WHERE userID =%s AND userType=%s"
	try:
		cursor.execute(selectQuery, (userID, "host"))
		result = cursor.fetchall()
		if not result:
			connection.close()
			return jsonify({"response" : "You have not created any events yet."}), 200
		singleSessionList = []
		multipleSessionList = []
		for row in result:
			if (row[10] is None):			# row[10] is the parentID.
				singleSessionList.append(row)
			else:
				multipleSessionList.append(row)
			# print("\n")
			# print("row[10] : ", row[10])
		# for each session in single Session List: return its details after checking live, completed. send multi session flag too.


		returnSingleArray = singleSessions(singleSessionList)

		# print("multiSessionList : ", multipleSessionList)
		# print("\n")
		# print(multipleSessionList[0])
		# print("\n")
		# print(multipleSessionList[1])
		# print("\n")
		# print(multipleSessionList[2])


		returnMultiArray = multiSessions(multipleSessionList, "host")

		connection.commit()
		cursor.close()

	except Exception as e:
		connection.close()
	cursor.close()
	connection.close()
	return jsonify({"single" : returnSingleArray, "multi" : returnMultiArray})



def sessionNext(event, status):
	print("event: ", event)
	completed = True
	nextSession = None
	live = False


	now = datetime.now()
	# print("type now : ", type(now))
	currentTime = now.strftime("%H:%M:%S")
	# print("type of actualy current time : ", type(currentTime))
	currentTime = datetime.strptime(currentTime, "%H:%M:%S").time()
	# print("type of actualy current time : ", type(currentTime))
	today = date.today()
	# print("today type : ", type(today))

	if len(event) == 0:
		# also means that event is completed
		return nextSession, completed, live
	for session in event:
		startTime = session[8]
		startTime = (datetime.min + startTime).time()
		print("startTime : ", startTime)

		startDate = session[6]

		endTime = session[9]
		endTime = (datetime.min + endTime).time()
		print("endTime : ", endTime)

		endDate = session[7]

		if ((today == startDate) and (currentTime < startTime)):
			# before session
			# print("1")
			completed = False
			nextSession = session
			return nextSession, completed, live
		elif ((startDate <= today <= endDate) and (startTime <= currentTime <= endTime)):
			# live in session
			live = True
			nextSession = session
			completed = False
			# print("4")
			return nextSession, completed, live
		elif (today < startDate):
			# before session
			# print("2")
			completed = False
			nextSession = session
			return nextSession, completed, live
		else:
			continue
	# print("3")
	# print("session : ", session)
	# if we get here, there is no next session, event is complete.
	print("session : ", session)
	nextSession = session
	return nextSession, completed, live








# {		userID 1 - host
#     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDQ0NjMzNSwianRpIjoiZGMyZDQ3ZDEtY2E3NS00YWEyLWEyMGMtZDdkYzdiMjg1M2FiIiwibmJmIjoxNjE0NDQ2MzM1LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJleHAiOjE2MTU3NDIzMzV9.uHtQNXnJw2BA3AwNOGCXY5lPe1J8rQL0ZkkWD1lrlXk",
#     "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDQ0NjMzNSwianRpIjoiMDgyMDQyNzItOWM5NS00ODYxLWIzMzctZTA1OTEzN2JkNDQyIiwibmJmIjoxNjE0NDQ2MzM1LCJ0eXBlIjoicmVmcmVzaCIsInN1YiI6MSwiZXhwIjoxNjE3MDM4MzM1fQ.wao3Y6kY2dEI3nKwY_Hh1C_nnBJpo7RPcQLlI5uqTVg"
# }

# expired access token :
# eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNDM1MDI1MCwianRpIjoiMzkxOWI0NmEtOGYwZC00MGJmLThiYWQtMzYzOWM5ZWVjYmVjIiwibmJmIjoxNjE0MzUwMjUwLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozNCwiZXhwIjoxNjE0MzUwMjY1fQ.fiUKCOjDJIcG29KM0FaQSjTG9fy1fUQYOFQxEqnODQw




# return array of eventIDs if multi session.
@app.route('/create-event', methods=["POST"])
@jwt_required()
def createEvent():

	eventCodeUnique = 0
	# GENERATE EVENTCODE AND CHECK FOR EVENTCODE BEING UNIQUE
	while (eventCodeUnique == 0):
		eventCode = random.randint(10000000,99999999)
		print("eventCode : ", eventCode)

		connection = mysql.connector.connect(**config)



		try:
			cursor = connection.cursor()
			cursor.execute("SELECT COUNT(*) FROM Events WHERE eventCode=(%s)", (eventCode,))
			result = cursor.fetchone()
			eventCodeCount = result[0]
			print("eventCodeCount: ", eventCodeCount)
			print("type : ", type(eventCodeCount))
			connection.commit()
		except Exception as e:
			return jsonify({'response': e}), 500
			cursor.close()
		if (eventCodeCount == 0):
			eventCodeUnique = 1		# event code is unique



	newData = request.get_json()
	eventName = newData["eventName"]
	hostName = newData["hostName"]
	eventType = newData["eventType"]
	eventType = eventType.lower()
	startDate = newData["startDate"]
	endDate = newData["endDate"]
	startTime = newData["startTime"]
	endTime = newData["endTime"]
	description = newData["description"]
	userID = get_jwt_identity()			# host

	# start = startDate + " "+ startTime
	# dateTimeStart = datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
	# print("dateTimeStart : ", dateTimeStart)
	# end = endDate + " "+ endTime
	# dateTimeEnd = datetime.strptime(end, '%Y-%m-%d %H:%M:%S')
	# print("dateTimeEnd : ", dateTimeEnd)

	# print("startTime : ", startTime)
	# print("type : ", type(startTime))
	# print("startDate : ", startDate)
	# print("type : ", type(startDate))
	# print("endTime : ", endTime)
	# print("type : ", type(endTime))
	# print("endDate : ", endDate)
	# print("type : ", type(endDate))


	# check if times and dates are arrays - only have to check one of them.

	if (type(startDate) == list):
		# dates and times are lists.
		insertQuery = "INSERT INTO Events (eventCode, eventName, hostName, eventType, startDate, endDate, startTime, endTime, description) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
		try:
			cursor = connection.cursor()
			cursor.execute(insertQuery, (eventCode, eventName, hostName, eventType, startDate[0], endDate[0], startTime[0], endTime[0], description))
			if cursor.lastrowid:
				firstEventID = cursor.lastrowid
				print('last insert id', cursor.lastrowid)
			else:
				print('last insert id not found')
			connection.commit()
		except Exception as e:
			return jsonify({'response' : e}), 500
		cursor.close()

		# insert first session of the event.

		insertUserEvents = "INSERT INTO UserEvents (userID, eventID, userType) VALUES (%s,%s,%s)"
		try:
			cursor = connection.cursor()
			cursor.execute(insertUserEvents, (userID, firstEventID, "host"))
			if cursor.lastrowid:
				generatedEventID = cursor.lastrowid
				print('last insert id', cursor.lastrowid)
			else:
				print('last insert id not found')
			connection.commit()
		except Exception as e:
			return jsonify({'response' : e}), 500
		cursor.close()
		# parentID of first session should be the first eventID of this session.

		insertParentID = "UPDATE Events SET parentID=%s WHERE eventID=%s"
		try:
			cursor = connection.cursor()
			cursor.execute(insertParentID, (firstEventID,firstEventID))
			connection.commit()
		except Exception as e:
			return jsonify({'response' : e}), 500
		cursor.close()




		# first session of event inserted, now insert the rest.
		eventIDList = []
		eventIDList.append(firstEventID)
		print("length : ", len(startDate))
		for x in range(1,len(startDate)):
			# insert into events with firstEventID
			print("x: ", x)
			print("startDate[x] : ", startDate[x])
			# insert into userevents with generated eventID
			insertQuery = "INSERT INTO Events (eventCode, eventName, hostName, eventType, startDate, endDate, startTime, endTime, description, parentID) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
			try:
				cursor = connection.cursor()
				cursor.execute(insertQuery, (eventCode, eventName, hostName, eventType, startDate[x], endDate[x], startTime[x], endTime[x], description, firstEventID))
				if cursor.lastrowid:
					generatedEventID = cursor.lastrowid
					print('last insert id', cursor.lastrowid)
					eventIDList.append(generatedEventID)
				else:
					print('last insert id not found')
				connection.commit()
			except Exception as e:
				return jsonify({'response' : e}), 500
			cursor.close()

			# print("in between")

			insertUserEvents = "INSERT INTO UserEvents (userID, eventID, userType) VALUES (%s,%s,%s)"
			try:
				# print("above cursor insert 2")
				cursor = connection.cursor()
				cursor.execute(insertUserEvents, (userID, generatedEventID, "host"))
				if cursor.lastrowid:
					generatedEventID = cursor.lastrowid
					print('last insert id', cursor.lastrowid)
				else:
					print('last insert id not found')
				connection.commit()
			except Exception as e:
				return jsonify({'response' : e}), 500
			cursor.close()


	else:
		# one session event.
		insertQuery = "INSERT INTO Events (eventCode, eventName, hostName, eventType, startDate, endDate, startTime, endTime, description) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
		try:
			cursor = connection.cursor()
			cursor.execute(insertQuery, (eventCode, eventName, hostName, eventType, startDate, endDate, startTime, endTime, description))
			if cursor.lastrowid:
				newEventID = cursor.lastrowid
				print('last insert id', cursor.lastrowid)
			else:
				print('last insert id not found')

			connection.commit()
		except Exception as e:
			return jsonify({'response': e}), 500

		cursor.close()


		# insert into user-events!!
		# this user has created this event.

		insertQuery = "INSERT INTO UserEvents (userID, eventID, userType) VALUES (%s,%s, %s)"
		try:
			cursor = connection.cursor()
			cursor.execute(insertQuery, (userID, newEventID, "host"))
			connection.commit()
		except Exception as e:
			return jsonify({'response' : e}), 500
		cursor.close()
		connection.close()


		return jsonify({"response" : "event created", "eventID" : newEventID, "eventCode" : eventCode}), 200

	connection.close()
	print("eventIDList : ", eventIDList)
	return jsonify({"response" : "event created", "eventID" : eventIDList, "eventCode" : eventCode}), 200







@app.route('/join-event', methods=["POST"])
@jwt_required()
def joinEvent():
	newData = request.get_json()
	userID = get_jwt_identity()		# attendee
	print("userID : ", userID)
	eventCode = newData["eventCode"]
	connection = mysql.connector.connect(**config)
	try:
		cursor = connection.cursor()
		cursor.execute("SELECT eventID, eventName, hostName, startDate, endDate, startTime, endTime, parentID FROM Events WHERE eventCode=(%s)", (eventCode,))
		result = cursor.fetchall()
		if not result:
			# event not found
			connection.close()
			return jsonify({"response" : "event not found"}), 400
	except Exception as e:
		return jsonify({"response" : e}), 500
	cursor.close()

	print("result : ", result)
	eventID = result[0][0]
	eventName = result[0][1]
	hostName = result[0][2]
	# description = result[0][2]
	# eventType = result[0][2]
	startDate = result[0][3]
	endDate = result[0][4]
	startTime = result[0][5]
	endTime = result[0][6]
	parentID = result[0][7]
	singleSession = False
	multipleSession = False
	print("len(result) : ", len(result))
	if (len(result) == 1):
		singleSession = True
	else:
		multipleSession = True

	# convert times into datetime.time in order to compare , and get current time and date.
	startTime = (datetime.min + startTime).time()
	endTime = (datetime.min + endTime).time()
	now = datetime.now()
	# print("type now : ", type(now))
	currentTime = now.strftime("%H:%M:%S")
	# print("type of actualy current time : ", type(currentTime))
	currentTime = datetime.strptime(currentTime, "%H:%M:%S").time()
	# print("type of actualy current time : ", type(currentTime))
	today = date.today()
	# print("today type : ", type(today))

	# print("singleSession : ", singleSession)
	# print("multipleSession : ", multipleSession)

	# single session : check if live or completed and insert into user-events
	if (singleSession):
		completed = False
		if (today == endDate):
			# check time - if current time is after the end time.
			if (currentTime > endTime):
				completed = True
				connection.close()
				return jsonify({"response" : "Cannot join Event. Event has been completed"}), 400
		elif (today > endDate):
			# today is after endDate so completed is true.
			completed = True
			connection.close()
			return jsonify({"response" : "Cannot join Event. Event has been completed"}), 400



		# check if user has either already joined the event or if the user is trying to join their own event.
		# print("here")
		selectUserEvents = "SELECT userType FROM UserEvents WHERE userID=%s AND eventID=%s"
		try:
			cursor = connection.cursor()
			print("userID : ", userID)
			print("eventID : ", eventID)
			cursor.execute(selectUserEvents, (userID, eventID))
			userTypeResult = cursor.fetchall()
			print("userTypeResult : ", userTypeResult)
			if not userTypeResult:
				# this means that user can join the event.
				# insert into userEvents now - this user has joined this event.
				insertQuery = "INSERT INTO UserEvents (userID, eventID, userType) VALUES (%s,%s,%s)"
				try:
					cursor = connection.cursor()
					print("userID : ", userID)
					print("eventID : ", eventID)
					cursor.execute(insertQuery, (userID, eventID, "attendee"))
					connection.commit()
				except Exception as e:
					return jsonify({"response" : e}), 500
				cursor.close()
				connection.close()
				# print(str(startDate))
				# print(str(startTime))
				return jsonify({"response" : "success", "sessions" : "single"}), 200
			else:
				# check userType
				userType = userTypeResult[0][0]
				print("userType : ", userType)
				if (userType == "host"):
					print("userType : ", userType)
					# user is trying to join their own event.
					connection.close()
					return jsonify({'response' : "You can't join your own event!"}), 400
				else:
					# user has already joined this event
					connection.close()
					return jsonify({'response' : "You have already joined this event!"}), 400

			connection.commit()
		except Exception as e:
			return({"response" : e}), 500







	if (multipleSession):
		#multiple sessions : for each session, check live, completed, next session and insert into user-events (insert the parentID as eventID), return next session.
		print("result : ", result)
		# print(result[0])
		# print(result[1])
		nextSession, completed, live = checkNextSessionCompleteLive(result, startTime, startDate, endTime, endDate, currentTime, today)
		print("nextSession : ", nextSession)
		print("completed : ", completed)
		print("live : ", live)
		firstEventID = result[0][0]

		if (completed == True):
			connection.close()
			return jsonify({"response" : "Cannot join Event. Event has been completed"}), 400


		selectUserEvents = "SELECT userType FROM UserEvents WHERE userID=%s AND eventID=%s"
		try:
			cursor = connection.cursor()
			print("userID 2 : ", userID)
			print("eventID 2 : ", firstEventID)
			cursor.execute(selectUserEvents, (userID, firstEventID))
			userTypeResult = cursor.fetchall()
			print("userTypeResult : ", userTypeResult)
			if not userTypeResult:
				# this means that user can join event
				insertIntoUserEvents(result, userID, connection)
				return jsonify({"response" : "success", "sessions" : "multiple"}), 200
			else:
				# check userType since user cannot join event.
				userType = userTypeResult[0][0]
				print("userType : ", userType)
				if (userType == "host"):
					print("userType : ", userType)
					# user is trying to join their own event.
					connection.close()
					return jsonify({'response' : "You can't join your own event!"}), 400
				else:
					# user has already joined this event
					connection.close()
					return jsonify({'response' : "You have already joined this event!"}), 400
			connection.commit()
		except Exception as e:
			return({"response" : e}), 500





def insertIntoUserEvents(result, userID, connection):
	# print("insertintouserevents")
	# print("result : ", result)
	print("userID : ", userID)
	insertQuery = "INSERT INTO UserEvents (userID, eventID, userType) VALUES (%s,%s,%s)"
	# print("1")
	for res in result:
		print("res : ", res)
		print("res[0] : ", res[0])
		# print(type(res[0]))
		try:
			# print("2")
			cursor = connection.cursor()
			# print("3")
			# print("userID : ", userID)
			# print("eventID : ", res[0])
			cursor.execute(insertQuery, (userID, res[0], "attendee"))
			# print("4")
			# cursor.fetchall()
			connection.commit()
			# print("5")
		except Exception as e:
			print("EXCEPTION COMING")
			# print("e : ", e)
			return
			# return jsonify({"response" : e}), 500

	cursor.close()
	connection.close()
		# print(str(startDate))
		# print(str(startTime))
	return
		# return jsonify({"response" : "event found", "eventID" : eventID, "eventName" : eventName, "hostName" : hostName, "startDate" : str(startDate), "endDate" : str(endDate), "startTime" : str(startTime), "endTime" : str(endTime), "sessions" : "single", "completed" : completed}), 200






# join guest : if live, return list of eventIDs for workshop, return eventID for single. if not live , irrelevant
# host-list : workshop - return all information of workshop - single session return information of the session.
# attendee-list : return all sessions that have not finished (All IDs) workshop - session you would return that sessions details, both finished and non finished



@app.route('/join-event-guest', methods=["GET"])
def joinEventGuest():
	# return event id if event is live. still have to do shenanigans.
	newData = request.get_json()
	# userID = get_jwt_identity()		# attendee
	# print("userID : ", userID)
	eventCode = newData["eventCode"]
	connection = mysql.connector.connect(**config)
	try:
		cursor = connection.cursor()
		cursor.execute("SELECT eventID, eventName, hostName, startDate, endDate, startTime, endTime, parentID FROM Events WHERE eventCode=(%s)", (eventCode,))
		result = cursor.fetchall()
		if not result:
			# event not found
			connection.close()
			return jsonify({"response" : "event not found"}), 400
	except Exception as e:
		return jsonify({"response" : e}), 500
	cursor.close()

	singleSession = False
	multipleSession = False

	if (len(result) == 1):
		singleSession = True
	else:
		multipleSession = True


	# get current date and time to check if it is live.
	now = datetime.now()
	currentTime = now.strftime("%H:%M:%S")
	print("Current Time =", currentTime)
	currentTime = datetime.strptime(currentTime, "%H:%M:%S").time()
	print("current time type : ", type(currentTime))

	today = date.today()
	print("Today's date:", today)

	print("today type : ", type(today))

	# if single : check live. if yes, return something, if no, return something else lol.
	# if multiple : check if any are live in loop. if yes, immediately return

	if (singleSession):
		# get times for event and the eventID.
		print("result[0] : ", result[0])
		live, eventID = checkLive(result[0], currentTime, today)
		if (live == True):
			return jsonify({"response" : "event found", "eventID" : eventID}), 200
		else:
			return jsonify({"response" : "event not live"}), 400
	if (multipleSession):
		for session in result:
			print("session : ", session)
			live, eventID = checkLive(session, currentTime, today)
			if (live == True):
				return jsonify({"response" : "event found", "eventID" : eventID}), 200
		return jsonify({"response" : "event not live"}), 400



def checkLive(res, currentTime, today):
	#startTime, endTime, startDate, endDate
	print("res : ", res)
	print("res[0] : ", res[0])
	print("res[1] : ", res[1])
	startTime = res[5]
	startTime = (datetime.min + startTime).time()
	print("startTime : ", startTime)
	print("type: ", type(startTime))
	endTime = res[6]
	endTime = (datetime.min + endTime).time()
	print("endTime : ", endTime)
	print("type: ", type(endTime))
	startDate = res[3]
	print("startDate : ", startDate)
	print("type: ", type(startDate))
	endDate = res[4]
	print("endDate : ", endDate)
	print("type: ", type(endDate))
	eventID = res[0]
	live = False
	if (startDate <= today <= endDate):
		if (startTime <= currentTime <= endTime):
			live = True
			return live, eventID
	return live, eventID




def checkNextSessionCompleteLive(result, startTime, startDate, endTime, endDate, currentTime, today):
	live = False
	completed = True
	nextSession = None
	for event in result:
		print("\n")
		if ((today == startDate) and (currentTime < startTime)):
			# print("1")
			completed = False
			nextSession = event
			return nextSession, completed, live
		elif ((startDate <= today <= endDate) and (startTime <= currentTime <= endTime)):
			live = True
			nextSession = event
			completed = False
			# print("4")
			return nextSession, completed, live
		elif (today < startDate):
			# print("2")
			completed = False
			nextSession = event
			return nextSession, completed, live
		else:
			continue
		# print("3")
		# print("session : ", session)
	nextSession = event
	print("nextSession : ", nextSession)
	print("completed : ", completed)
	print("live : ", live)
	return nextSession, completed, live




# BASIC API: Don't change the main function for now; as currently, it exposes 5002 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5002')
