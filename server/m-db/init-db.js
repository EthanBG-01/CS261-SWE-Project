db.auth('root', 'password')

db = db.getSiblingDB('feedback-analytics')

// Drop the feedback collection
db.feedback_tb.drop()

// Insert some data:
// NOTE Mongo doesn't have a schema as such - rather collections are created
// as and when needed.

questions = db.questions
templates = db.templates

questions.insertMany([{'questionID' : 1, 'question' : 'How satisfied are you with the session so far?', 'outputType' : 'average', 'questionType' : 'template', 'responseType' : ["Unsatisfied","Very Satisfied"], 'templateID' : [1]},

{'questionID' : 2, 'question' : 'Are the topics covered interesting?', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["yes", "no", "not interesting", "somewhat not interesting", "meh", "somewhat interesting", "interesting"], 'templateID' : [1]},

{'questionID' : 3, 'question' : 'Is the session delivered in an engaging way?', 'outputType' : 'average', 'questionType' : 'template', 'responseType' : ["Not Engaging","Very Engaging"], 'templateID' : [1]},

{'questionID' : 4, 'question' : 'The length/pace of the session is: ', 'outputType' : 'average', 'questionType' : 'template', 'responseType' : ["Too Slow","Too Fast"], 'templateID' : [1]},

{'questionID' : 5, 'question' : 'How are you feeling right now?', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["very bad", "bad", "neutral", "good", "excellent"], 'templateID' : [1,2]},

{'questionID' : 6, 'question' : 'Select an emotion that best reflects your current situation : ', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["tired", "worried", "confused", "stressed", "angry", "sadness", "bored", "grateful", "motivated", "optimism", "accomplished", "joy", "excited"], 'templateID' : [1,2]},

{'questionID' : 7, 'question' : 'Can you please provide a few reasons why? ', 'outputType' : 'text-sentiment', 'questionType' : 'template', 'responseType' : 'user-text', 'templateID' : [1,2]},

{'questionID' : 8, 'question' : 'What elements of the session did you like the most? ', 'outputType' : 'text-no-sentiment', 'questionType' : 'template', 'responseType' : 'user-text', 'templateID' : [1]},

{'questionID' : 9, 'question' : 'If anything, what did you dislike about the session?', 'outputType' : 'text-no-sentiment', 'questionType' : 'template', 'responseType' : 'user-text', 'templateID' : [1]},

{'questionID' : 10, 'question'  : 'What is your job / professional experience?', 'outputType': 'text-no-sentiment', 'questionType': 'template', 'responseType': 'user-text', 'templateID' : [1]},

{'questionID' : 11, 'question' : 'How satisfied are you with the project so far?', 'outputType' : 'average', 'questionType' : 'template', 'responseType' : ["Unsatisfied","Very Satisfied"], 'templateID' : [2]},

{'questionID' : 12, 'question' : 'Are you working on something you find interesting?', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["yes", "no", "not interesting", "somewhat not interesting", "meh", "somewhat interesting", "interesting"], 'templateID' : [2]},

{'questionID' : 13, 'question' : 'How satisfied are you with the current teamwork?', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["highly unsatisfied", 'somewhat unsatisfied', "neither", "somewhat satisfied", "very satisfied"], 'templateID' : [2]},

{'questionID' : 14, 'question' : 'How motivated are you in finishing the project?', 'outputType' : 'discrete', 'questionType' : 'template', 'responseType' : ["highly unmotivated", "somewhat unmotivated", "neither", "somewhat motivated", "highly motivated"], 'templateID' : [2]},

{'questionID' : 15, 'question' : 'What did you like most about your project? ', 'outputType' : 'text-no-sentiment', 'questionType' : 'template', 'responseType' : 'user-text', 'templateID' : [2]},

{'questionID' : 16, 'question' : 'What do you think can be improved?', 'outputType' : 'text-no-sentiment', 'questionType' : 'template', 'responseType' : 'user-text', 'templateID' : [2]},

{'questionID' : 17, 'question'  : 'What is your role in this project?', 'outputType': 'text-no-sentiment', 'questionType': 'template', 'responseType': 'user-text', 'templateID' : [2]}])


templates.insertMany([{'templateID' : 1, 'questionID' : [1,2,3,4,5,6,7,8,9,10], 'templateName' : 'non-project'},

{'templateID' : 2, 'questionID' : [11,12,13,14,15,16,17,5,6,7], 'templateName' : 'project'}])












// db.feedback_tb.insertMany([
//     {
//         "userID":1,
//         "eventID":1,
//         "text":"This is a response"
//     },
//     {
//         "userID":1,
//         "eventID":1,
//         "text":"This is a second response"
//     }
// ]);
