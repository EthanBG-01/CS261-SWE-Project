db.auth('root', 'password')

db = db.getSiblingDB('feedback-analytics')

// Drop the feedback collection
db.feedback_tb.drop()

// Insert some data:
// NOTE Mongo doesn't have a schema as such - rather collections are created
// as and when needed.
db.feedback_tb.insertMany([
    {
        "userID":1,
        "eventID":1,
        "text":"This is a response"
    },
    {
        "userID":1,
        "eventID":1,
        "text":"This is a second response"
    }
]);
