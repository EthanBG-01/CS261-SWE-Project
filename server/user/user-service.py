from flask import Flask
import mysql.connector
import json

app = Flask(__name__)

def test_database():
     config = {
                    'user': 'root',
                    'password': 'root',
                    'host': 'user-event-db',
                    'port': '3306',
                    'database': 'userEvent'
                }
     connection = mysql.connector.connect(**config)

     cursor = connection.cursor()
     cursor.execute('SELECT * FROM Users')

     results = []
     for row in cursor:
         results.append(row)

     cursor.close()
     connection.close()

     return results


# Basic example of an api route (called front-end from localhost/user)
@app.route('/')
def hello_world():
    return {'APIUser' : 'Active'}

# Example API call; using the database:
@app.route('/test')
def test():
     return json.dumps({'users': test_database()})


# Running the API:
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001')