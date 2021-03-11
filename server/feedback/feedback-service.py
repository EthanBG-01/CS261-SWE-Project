from flask import Flask,jsonify, request
import pymongo
from pymongo import MongoClient
import json
import datetime
from flair.models.text_classification_model import TARSClassifier
from flair.data import Sentence


app = Flask(__name__)


# The init file for the database only runs once! Need to delete containers in docker app then build and up again
# if you make changes to it.



client = MongoClient(host='feedback-analysis-db', port=27017, username='root', password='password', authSource='admin')
db = client["feedback-analytics"]





# analysisService




#IGNORE
# {
#     "eventID" : [1,2,3],
#     "data" : [
#         {
#             "questionID" : "",
#             "questionText" : "blah?",
#             "questionType" : "discrete",
#             "questionData" : ["yes", "no", "maybe"]
#         },
#         {
#             "questionID" : 5,
#             "questionText" : "blah blah?",
#             "questionType" : "average",
#             "questionData" : [-5,5]
#         },
#         {
#             "questionID" : 9,
#             "questionText" : "blah blah blah?",
#             "questionType" : "discrete",
#             "questionData" : ["not motivated", "slightly motivated", "highly motivated"]
#         },
#         {
#             "questionID" : 17,
#             "questionText" : "What is your role in the project?",
#             "questionType" : "text-no-sentiment",
#             "questionData" : "user-text"
#         },
#          {
#             "questionID" : 7,
#             "questionText" : "Can you please provide a few reasons why?",
#             "questionType" : "text-sentiment",
#             "questionData" : "user-text"
#         }

#     ]
# }



# {"eventID" : 6}


@app.route('/get-questions', methods=['POST'])
def getQuestions():
	# take in specific eventID (could be a list) and look at events collections and return questions.
	newData = request.get_json()
	eventID = newData["eventID"]

	# eventID will either be a list or just single id, and this can be used in the future for different questions per session
	# but currently, each session has the same questions so if list, just get the first element as the eventID since they all the same questions.

	if (type(eventID) == list):
		eventID = eventID[0]


	events = db.events
	questions = db.questions


	try:
		event = events.find_one({"eventID" : eventID})
	except Exception as e:
		return jsonify(response=e, msg="failure to find template."), 500


	try:
		ques = list(questions.find({"questionID" : {"$in": event["questionID"]}}, {"questionID" : 1, "question" : 1, "_id" : 0, "outputType" : 1, "responseType" : 1}))
	except Exception as e:
		return jsonify(response=e, msg="failure to find question details."), 500

	returnArray = []
	for record in ques:
		# print("record : ", record)
		returnArray.append(record)
	client.close()

	print("returnArray : ", returnArray)


	# get questions from events



	return jsonify(response=returnArray), 200



# {
#     "eventID" : [1,2,3],
#     "data": [
#         {
#             "questionType": "average",
#             "questionText": "How satisfied are you with the session so far?",
#             "questionID": 1,
#             "questionData": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "questionType": "discrete",
#             "questionText": "Are the topics covered interesting?",
#             "questionID": 2,
#             "questionData": [
#                 "yes",
#                 "no",
#                 "not interesting",
#                 "somewhat not interesting",
#                 "meh",
#                 "somewhat interesting",
#                 "interesting"
#             ]
#         },
#         {
#             "questionType": "average",
#             "questionText": "Is the session delivered in an engaging way?",
#             "questionID": 3,
#             "questionData": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "questionType": "average",
#             "questionText": "The length/pace of the session is: ",
#             "questionID": 4,
#             "questionData": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "questionType": "discrete",
#             "questionText": "How are you feeling right now?",
#             "questionID": 5,
#             "questionData": [
#                 "very bad",
#                 "bad",
#                 "neutral",
#                 "good",
#                 "excellent"
#             ]
#         },
#         {
#             "questionType": "discrete",
#             "questionText": "Select an emotion that best reflects your current situation : ",
#             "questionID": 6,
#             "questionData": [
#                 "tired",
#                 "worried",
#                 "confused",
#                 "stressed",
#                 "angry",
#                 "sadness",
#                 "bored",
#                 "grateful",
#                 "motivated",
#                 "optimism",
#                 "accomplished",
#                 "joy",
#                 "excited"
#             ]
#         },
#         {
#             "questionType": "text-sentiment",
#             "questionText": "Can you please provide a few reasons why? ",
#             "questionID": 7,
#             "questionData": "user-text"
#         },
#         {
#             "questionType": "text-no-sentiment",
#             "questionText": "What elements of the session did you like the most? ",
#             "questionID": 8,
#             "questionData": "user-text"
#         },
#         {
#             "questionType": "text-no-sentiment",
#             "questionText": "If anything, what did you dislike about the session?",
#             "questionID": 9,
#             "questionData": "user-text"
#         },
#         {
#             "questionType": "discrete",
#             "questionText": "Are you enjoying yourself?",
#             "questionID": "",
#             "questionData": ["yes", "no", "maybe"]
#         }
#     ]
# }

@app.route('/post-create-event', methods=['POST'])
def postCreateEvent():
	# event IDs as the input. array if workshop, otherwise single eventID
	# questions..?
	# client = pymongo.MongoClient("mongodb+srv://dev:dev123@cluster0.5tgu6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
	# db = client.analysisFeedback
	feedback = db.feedback
	events = db.events
	questions = db.questions
	templates = db.templates
	analysis = db.analysis

	newData = request.get_json()

	eventID = newData["eventID"]
	questionData = newData["data"]			# this'll be type list.

	questionIDArray = []
	questionTextArray = []
	outputTypeArray = []
	responseTypeArray = []
	for questionInformation in questionData:
		# questionInformation is a dict containing information about a question.
		try:
			questionID = questionInformation["questionID"]
		except KeyError:
			print("questionID not given.")
			questionID = None
		if (questionID == ""):
			questionID = None
		questionText = questionInformation["questionText"]
		outputType = questionInformation["questionType"].lower()

		responseType = questionInformation["questionData"]


		# so we first deal with it if it is a custom question

		if (questionID == None):
			# get last inserted questionID and add 1 for custom question id.
			# insert into questions.
			# then we would add to questionID array
			try:
				lastQuestionIDQuery = questions.find().sort("questionID",-1).limit(1)
			except Exception as e:
				return jsonify(response=e, msg="failure to find last question ID."), 500


			for record in lastQuestionIDQuery:
				lastID = record["questionID"]

			# insert custom
			print("inserting custom")
			try:
				questions.insert_one({"questionID" : lastID + 1, "question" : questionText, "outputType" : outputType, "questionType" : "custom", "responseType" : responseType, "templateID" : []})
			except Exception as e:
				client.close()
				return jsonify(response=e, msg="failure to insert custom question."), 500


			# questions.delete_many({"questionID" : 18})
			# questions.delete_many({"questionID" : 19})
			questionIDArray.append(lastID + 1)

		else:
			# not a custom question, questionID exists, add to questionIDArray.
			questionIDArray.append(int(questionID))

		questionTextArray.append(questionInformation["questionText"])
		outputTypeArray.append(questionInformation["questionType"])
		responseTypeArray.append(questionInformation["questionData"])


	# end of questionInformation, so now we add to events.



	# end of for loop, insert into events (eventID, questionID) VALUES (eventID, questionIDArray) for each event.
	# we would then insert into analysis init the whole big thing. make this into a separate function.
	# check for list




	if (type(eventID) == list):
		for ev in eventID:
			print("inserting into events list")
			try:
				events.insert_one({"eventID" : ev, "questionID" : questionIDArray})
			except Exception as e:
				client.close()
				return jsonify(response=e, msg="failure to insert event."), 500

	else:
		print("inserting into events list")
		try:
			events.insert_one({"eventID" : eventID, "questionID" : questionIDArray})
		except Exception as e:
			client.close()
			return jsonify(response=e, msg="failure to insert event."), 500




	# questions have been added. now we initialise analysis and feedback - 1 document per eventID.

	print("questionTextArray : ", questionTextArray)
	print("questionIDArray : ", questionIDArray)
	print("outputTypeArray : ", outputTypeArray)
	print("responseTypeArray : ", responseTypeArray)




	length = len(questionData)



	if (type(eventID) == list):
		for event in eventID:
			resultsArray = []
			resultsDict = {}
			eventDict = {}
			textArray = []
			textDict = {}
			for x in range(length):
				if (outputTypeArray[x] == "average"):
					resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"Average" : 0, "Responses" : 0}}
					resultsArray.append(resultsDict)

				elif (outputTypeArray[x] == "discrete"):
					resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"categories" : {option : 0 for option in responseTypeArray[x]}}}
					resultsArray.append(resultsDict)

				elif (outputTypeArray[x] == "text-no-sentiment"):
					resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {}}
					resultsArray.append(resultsDict)
					textDict = {"questionID" : questionIDArray[x], "questionText" : []}
					textArray.append(textDict)

				elif (outputTypeArray[x] == "text-sentiment"):
					resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"emotions" : {"sadness" : 0, "stressed" : 0, "angry" : 0, "tired" : 0, "worried" : 0, "confused" : 0, "bored" : 0, "grateful" : 0, "motivated" : 0, "optimism" : 0, "accomplished" : 0, "joy" : 0, "excited" : 0}}}
					resultsArray.append(resultsDict)
					textDict = {"questionID" : questionIDArray[x], "questionText" : []}
					textArray.append(textDict)


			# print("resultsArray : ", resultsArray)
			eventDict = {"eventID" : event, "results" : resultsArray}
			# print("eventDict : ", eventDict)

			try:
				analysis.insert_one(eventDict)
			except Exception as e:
				client.close()
				return jsonify(response=e, msg="failure to initialise analysis."), 500
			# print("textArray : ", textArray)
			finalTextDict = {"eventID" : event, "textResults" : textArray}
			# print("finalTextDict : ", finalTextDict)

			try:
				feedback.insert_one(finalTextDict)
			except Exception as e:
				client.close()
				return jsonify(response=e, msg="failure to initialise feedback."), 500


	else:
		# not a list, then only one eventID
		for x in range(length):
			if (outputTypeArray[x] == "average"):
				resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"Average" : 0, "Responses" : 0}}
				resultsArray.append(resultsDict)

			elif (outputTypeArray[x] == "discrete"):
				resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"categories" : {option : 0 for option in responseTypeArray[x]}}}
				resultsArray.append(resultsDict)

			elif (outputTypeArray[x] == "text-no-sentiment"):
				resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {}}
				resultsArray.append(resultsDict)

			elif (outputTypeArray[x] == "text-sentiment"):
				resultsDict = {"questionID" : questionIDArray[x], "questionTitle" : questionTextArray[x], "questionType" : outputTypeArray[x], "data" : {"emotions" : {"sadness" : 0, "stressed" : 0, "angry" : 0, "tired" : 0, "worried" : 0, "confused" : 0, "bored" : 0, "grateful" : 0, "motivated" : 0, "optimism" : 0, "accomplished" : 0, "joy" : 0, "excited" : 0}}}
				resultsArray.append(resultsDict)



		# print("resultsArray : ", resultsArray)
		eventDict = {"eventID" : eventID, "results" : resultsArray}
		# print("eventDict : ", eventDict)
		analysis.insert_one(eventDict)
		# print("textArray : ", textArray)
		finalTextDict = {"eventID" : eventID, "textResults" : textArray}
		# print("finalTextDict : ", finalTextDict)
		try:
			feedback.insert_one(finalTextDict)
		except Exception as e:
			client.close()
			return jsonify(response=e, msg="failure to initialise feedback."), 500


	client.close()
	return jsonify(response="success"), 200




# questionTextArray :  ['blah?', 'blah blah?', 'blah blah blah?', 'What is your role in the project?', 'Can you please provide a few reasons why?']
# questionIDArray :  [18, 5, 9, 17, 7]
# outputTypeArray :  ['discrete', 'average', 'discrete', 'text-no-sentiment', 'text-sentiment']
# responseTypeArray :  [['yes', 'no', 'maybe'], [-5, 5], ['not motivated', 'slightly motivated', 'highly motivated'], 'user-text', 'user-text']





# {

# 	EventID: X,

# 	TextResults : [

# 	{QuestionID: 3, QuestionText: [[“Faris”, “comment”], [“Anonymous”, “comment”]]},

# 	{QuestionID: 4, QuestionText: [[“Faris”, “comment”], [“Anonymous”, “comment”]]}

# 	]

# }




# 	# insert analysis object for each eventID.
# 	{

# 	EventID: X,

# 	Results: [     // For sake of demonstration, we’ve got one of each type but could be several ave.

# 	{QuestionID:1, Title:”Bla bla”, QuestionType:”Average”,

# Data:{Average:0, Responses:0}},

# 	{QuestionID:2, Title:”Bla bla”, QuestionType:”Bar Chart”,

# Data:{  X-Label:”X-label”, Y-Label:”Y-Label”, Categories:{“Fast”:0 , “Slow”:0} }},

# {QuestionID:3, Title:”Bla bla”, QuestionType:”Text-No-Sentiment”,
#                  Data: {   Responses:[[“Faris”, “comment]]   } }

# {QuestionID:4, Title:”Bla bla”, QuestionType:”Text-Sentiment”,
#                 Data:{ Emotions:{“Sadness”:1, “Worried”:2}, 	Responses:[[“Faris”, “comment]]   } }

# ]

# }




# {
#     "eventID" : 1,
#     "anon" : "False",
#     "name" : "Bob",
#     "results" : [
#         {"questionID" : 1, "questionType" : "average", "response" : 3},
#         {"questionID" : 2, "questionType" : "discrete", "response" : "no"},
#         {"questionID" : 3, "questionType" : "average", "response" : 4},
#         {"questionID" : 4, "questionType" : "average", "response"  : -2},
#         {"questionID" : 5, "questionType" : "Discrete", "response" : "good"},
#         {"questionID" : 6, "questionType" : "discrete", "response" : "Confused"},
#         {"questionID" : 7, "questionType" : "text-sentiment", "response" : "This is a much longer response that will give an emotional response via a model that does something that I do not really understand."},
#         {"questionID" : 8, "questionType" : "text-no-sentiment", "response" : "I like the pace of the session"},
#         {"questionID" : 9, "questionType" : "text-no-sentiment", "response" : "The tone is a little boring"},
#         {"questionID" : 18, "questionType" : "discrete", "response" : "yes"}
#
#     ]
# }


@app.route('/store-feedback', methods=['POST'])
def storeFeedback():
	# store the text related feedback from the user.
	# also we'd have to call the analysis methods on the non-text based stuff
	# check what the input is.
	newData = request.get_json()
	anon = newData["anon"]
	anon = anon.lower()
	if (anon == "false"):
		name = newData["name"]
	else:
		name = "Anon"
	results = newData["results"]
	eventID = newData["eventID"]


	analysis = db.analysis
	feedback = db.feedback
	questions = db.questions

	try:
		queryResults = analysis.find({"eventID" : eventID}, {"results" : 1, "_id" : 0})
	except Exception as e:
		return jsonify(response=e, msg="failure to find event in analysis."), 500

	for record in queryResults:
		# record contains current analysis results for the questions.
		recordList = record["results"]


	updatedAnalysisArray = []

	for question in results:
		#question is a dict containing question info
		questionID = question["questionID"]
		userResponse = question["response"]
		questionType = question["questionType"]
		questionType = questionType.lower()
		if ((type(userResponse) == str) and questionType == "discrete"):
			userResponse = userResponse.lower()



		for query in recordList:
			if (query["questionID"] == questionID):
				questionToUpdate = query
		print("questionToUpdate : ", questionToUpdate)

		if (questionType == "average"):
			newDict = analyseAverage(questionToUpdate, questionID, userResponse)
			# analysis.update_many({"eventID" : eventID})
		elif (questionType == "discrete"):
			newDict = analyseDiscrete(questionToUpdate, questionID, userResponse)
			#af
		else:
			# newDict = questionToUpdate
			# continue
			newDict = storeText(questionToUpdate, eventID, userResponse, questionID, name, feedback, questions)

		updatedAnalysisArray.append(newDict)


	print("updatedAnalysisArray: ", updatedAnalysisArray)

	# add to analysis.


	try:
		analysis.update_many({"eventID" : eventID}, {"$set" : {"results" : updatedAnalysisArray}})
	except Exception as e:
		client.close()
		return jsonify(response=e, msg="failure to update event analysis."), 500

	client.close()

	return jsonify(response="success"), 200



def applyModel(userResponse):
	print("apply model")
	tars = modelInit()
	sent = Sentence(userResponse)
	tars.predict(sent)
	predicted_emotion = sent.labels[0].value
	print("predicted_emotion: ", predicted_emotion)
	return predicted_emotion




def storeText(questionToUpdate, eventID, userResponse, questionID, name, feedback, questions):
	#store text in feedback.

	# okay so we get the eventID, userResponse to insert and questionID to insert into. We fetch the array and append.


	# print("\n")
	# print("\n")
	# print("questionID : ", questionID)
	# print("eventID : ", eventID)
	# print("userResponse : ", userResponse)

	responsesArray = {"Responses" : [name, userResponse]}



	try:
		textResults = feedback.find({"eventID" : eventID}, {"textResults" : 1, "_id" : 0})
	except Exception as e:
		return jsonify(response=e, msg="failure to find event in feedback."), 500


	for record in textResults:
		print("record : ", record)
		print("record[TR] : ", record["textResults"])
		textResultsDict = record["textResults"]

	# print("textResultsDict : ", textResultsDict)

	# append to the array.


	for item in textResultsDict:
		feedbackArray = item["questionText"]
		idQuestion = item["questionID"]

		print("feedbackArray : ", feedbackArray)
		if (questionID == idQuestion):
			feedbackArray.append([name, userResponse])


	# print("feedbackArray : ", feedbackArray)
	# print("textResultsDict : ", textResultsDict)

	# we update textResultsDict into feedback somehow.
	# UPDATE FEEDBACK SET TEXTRESULTS = TEXTRESULTSDICT WHERE EVENTID = 1
	try:
		feedback.update_many({"eventID" : eventID}, {"$set" : {"textResults" : textResultsDict}})
	except Exception as e:
		return jsonify(response=e, msg="failure to update event feedback."), 500



	# find outputType from questionID.
	try:
		sentimentStatus = questions.find({"questionID" : questionID}, {"outputType" : 1, "_id" : 0})
	except Exception as e:
		return jsonify(response=e, msg="failure to find outputType of question."), 500

	for sentimentDict in sentimentStatus:
		print(sentimentDict)
		sentiment = sentimentDict["outputType"]
		# print("sentiment : ", sentiment)
		# print("sentimentDict : ", sentimentDict)

		if (sentiment == "text-sentiment"):
			emotion = applyModel(userResponse)
			newDict = analyseText(questionToUpdate, questionID, emotion)
			print("newDict text-sentiment : ", newDict)
			return newDict

		elif (sentiment == "text-no-sentiment"):
			# do nothing
			newDict = questionToUpdate
			return newDict




def analyseText(questionToUpdate, questionID, emotion):
	dataDict = questionToUpdate["data"]["emotions"]
	print("dataDict : ", dataDict)
	updateDict = {}
	for item in dataDict.items():
		if (item[0] == emotion.lower()):
			updateDict = {emotion.lower() : item[1] + 1}
			dataDict.update(updateDict)
	print("dataDict : ", dataDict)

	emotionsDict = {"emotions" : dataDict}
	print(emotionsDict)

	newDict = {"questionID" : questionID, "questionTitle" : questionToUpdate["questionTitle"], "questionType" : "text-sentiment", "data" : emotionsDict}

	return newDict


def analyseDiscrete(questionToUpdate, questionID, userResponse):
	# print("heya")
	# print("questionID : ", questionID)
	# print("userResponse : ", userResponse)
	# print("questionToUpdate : ", questionToUpdate)
	dataDict = questionToUpdate["data"]["categories"]
	print("dataDict : ", dataDict)
	updateDict = {}
	for item in dataDict.items():
		if (item[0] == userResponse):
			updateDict = {userResponse : item[1] + 1}
			dataDict.update(updateDict)
	print("dataDict : ", dataDict)


	categoriesDict = {"categories" : dataDict}
	print(categoriesDict)

	newDict = {"questionID" : questionID, "questionTitle" : questionToUpdate["questionTitle"], "questionType" : "discrete", "data" : categoriesDict}

	return newDict




def analyseAverage(questionToUpdate, questionID, userResponse):
	#basically, we get the eventID in analysis and get the results object. In the results object we search for the questionID and get the data from this question.
	# print("peekaboo")
	# print("questionID : ", questionID)
	# print("userResponse : ", userResponse)
	dataDict = questionToUpdate["data"]
	average = dataDict["Average"]
	responses = dataDict["Responses"]

	newResponse = responses + 1
	newAverage = ((average * responses) + userResponse) / newResponse

	dataDict.update({"Average" : newAverage})
	dataDict.update({"Responses" : newResponse})
	# print("dataDict : ", dataDict)

	newDict = {"questionID" : questionID, "questionTitle" : questionToUpdate["questionTitle"], "questionType" : "average", "data" : dataDict}
	print("newDict : ", newDict)


	return newDict





def getMood(results):
	# 	Very Bad: Sadness, Stressed, Angry
	# Bad: Tired, Worried, Confused
	# Neutral: Bored
	# Good: Grateful, Motivated, Optimism
	# Excellent: Accomplished, Joy, Excited
	moodList = [0,0,0,0,0]
	arrayDicts = []
	for question in results:
		if (question["questionType"] == "text-sentiment"):
			arrayDicts.append(question["data"]["emotions"])
		elif ((question["questionType"] == "discrete") and ("tired" in question["data"]["categories"])):
			print(question)
			arrayDicts.append(question["data"]["categories"])


	for emotionsDict in arrayDicts:

		for emotion in emotionsDict.keys():
			if (emotion == "sadness" or "stressed" or "angry"):
				moodList[0] = moodList[0] + emotionsDict.get(emotion)
			elif (emotion == "tired" or "worried" or "confused"):
				moodList[1] = moodList[1] + emotionsDict.get(emotion)
			elif (emotion == "bored"):
				moodList[2] = moodList[2] + emotionsDict.get(emotion)
			elif (emotion == "grateful" or "motivated" or "optimism"):
				moodList[3] = moodList[3] + emotionsDict.get(emotion)
			elif (emotion == "accomplished" or "joy" or "excited"):
				moodList[4] = moodList[4] + emotionsDict.get(emotion)

	print("moodList : ", moodList)

	maxValue = max(moodList)

	maxIndex = moodList.index(maxValue)

	if (maxIndex == 0):
		return "very bad"
	elif (maxIndex == 1):
		return "bad"
	elif (maxIndex == 2):
		return "neutral"
	elif (maxIndex == 3):
		return "good"
	else:
		return "excellent"








@app.route('/view-feedback', methods=['GET'])
def viewFeedback():
	# host can view the feedback and analysis.
	# analysis - get all the analysis results and convert the emotions to moods before returning.
	analysis = db.analysis
	feedback = db.feedback

	newData = request.get_json()
	eventID = newData["eventID"]
	if (type(eventID) == list):
		eventID = eventID[0]

	try:
		analysisResults = analysis.find({"eventID" : eventID}, {"results" : 1, "_id" : 0})
	except Exception as e:
		return jsonify(response=e, msg="failure to find event information in analysis."), 500


	for record in analysisResults:
		results = record["results"]

	mood = getMood(results)

	print("mood : ", mood)


	print("\n")
	try:
		feedbackResults = feedback.find({"eventID" : eventID}, {"textResults" : 1, "_id" : 0})
	except Exception as e:
		return jsonify(response=e, msg="failure to find event information in feedback."), 500

	for record in feedbackResults:
		feedback = record["textResults"]




	client.close()
	return jsonify(generalMood = mood, analysis = results, feedback=feedback), 200










# {
#     "response": [
#         {
#             "outputType": "average",
#             "question": "How satisfied are you with the session so far?",
#             "questionID": 1,
#             "responseType": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "outputType": "discrete",
#             "question": "Are the topics covered interesting?",
#             "questionID": 2,
#             "responseType": [
#                 "Yes",
#                 "No",
#                 "not interesting",
#                 "somewhat not interesting",
#                 "meh",
#                 "somewhat interesting",
#                 "interesting"
#             ]
#         },
#         {
#             "outputType": "average",
#             "question": "Is the session delivered in an engaging way?",
#             "questionID": 3,
#             "responseType": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "outputType": "average",
#             "question": "The length/pace of the session is: ",
#             "questionID": 4,
#             "responseType": [
#                 -5,
#                 5
#             ]
#         },
#         {
#             "outputType": "discrete",
#             "question": "How are you feeling right now?",
#             "questionID": 5,
#             "responseType": [
#                 "Very Bad",
#                 "Bad",
#                 "Neutral",
#                 "Good",
#                 "Excellent"
#             ]
#         },
#         {
#             "outputType": "discrete",
#             "question": "Select an emotion that best reflects your current situation : ",
#             "questionID": 6,
#             "responseType": [
#                 "Tired",
#                 "Worried",
#                 "Confused",
#                 "Stressed",
#                 "Angry",
#                 "Sadness",
#                 "Bored",
#                 "Grateful",
#                 "Motivated",
#                 "Optimism",
#                 "Accomplished",
#                 "Joy",
#                 "Excited"
#             ]
#         },
#         {
#             "outputType": "text-sentiment",
#             "question": "Can you please provide a few reasons why? ",
#             "questionID": 7,
#             "responseType": "user-text"
#         },
#         {
#             "outputType": "text-no-sentiment",
#             "question": "What elements of the session did you like the most? ",
#             "questionID": 8,
#             "responseType": "user-text"
#         },
#         {
#             "outputType": "text-no-sentiment",
#             "question": "If anything, what did you dislike about the session?",
#             "questionID": 9,
#             "responseType": "user-text"
#         },
#         {
#             "outputType": "text-no-sentiment",
#             "question": "What is your job / professional experience?",
#             "questionID": 10,
#             "responseType": "user-text"
#         }
#     ]
# }



@app.route('/test-model', methods=["GET"])
def testModel():
    newData = request.get_json()
    message = newData["text"]
    emotion = applyModel(message)
    return jsonify(emotion)


@app.route('/get-template', methods=['POST'])
def getTemplate():
	# take in eventType and return questionIDs and questions based off it.
	newData = request.get_json()
	eventType = newData["eventType"]
	eventType = eventType.lower()		# lower case.
	templates = db.templates
	questions = db.questions

	if (eventType == "project"):
		eventType = "project"
	else:
		eventType = "non-project"

		# find template.
	try:
		temp = templates.find_one({"templateName" : eventType})
	except Exception as e:
		client.close()
		return jsonify(response=e, msg="failure to find template."), 500

		# find list of questions from template.
	try:
		ques = list(questions.find({"questionID" : {"$in": temp["questionID"]}}, {"questionID" : 1, "question" : 1, "_id" : 0, "outputType" : 1, "responseType" : 1}))
	except Exception as e:
		return jsonify(response=e, msg="failure to find list of questions."), 500


	returnArray = []
	for record in ques:
		returnArray.append(record)


	client.close()

	return jsonify(response=returnArray), 200

def modelInit():
	global modelInit

	tars = TARSClassifier.load("final-model.pt")
	tars.switch_to_task("EMOTIONS_CS261")
	def inner():
		return tars

	modelInit = inner

	return tars



# BASIC API: Don't change the main function for now; as currently, it exposes 5003 in the DockerFile, and the compose and nginx config makes use of this port.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003')
