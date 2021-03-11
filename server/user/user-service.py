from flask import Flask, request, jsonify
import mysql.connector
import json
import logging
import re
import os
# import bcrypt
# import jwt
import datetime
# import base64
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, get_jwt_identity)

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


 # connection = mysql.connector.connect(**config)

 # cursor = connection.cursor()
 # cursor.execute('SELECT * FROM Users')

 # results = []
 # for row in cursor:
 #     results.append(row)

 # cursor.close()
 # connection.close()


 # return all results of table.

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


# validate email - they do it in front end too but may as well.

def validation(name, email, password, userType):
    if (name == ""):
        return jsonify({"response" : "Name was entered blank"}), 500
    if (email == ""):
        return jsonify({"response" : "Email was entered blank"}), 500
    if (password == ""):
        return jsonify({"response" : "Password was entered blank"}), 500
    if (userType == ""):
        return jsonify({"response" : "UserType was blank"}), 500

    # regex = '[^@]+@[^@]+\.[^@]+'
    regex = r'[\w\.-]+@[\w\.-]+(?:\.[\w]+)+'



    # print("result : ", re.fullmatch(regex, email))
    if not re.fullmatch(regex, email):
        return jsonify({"response" : "invalid email, please try again"}), 400


# is email in database.
def doesEmailExist(connection, email, userType):
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM Users WHERE email=(%s)", (email,))
        result = cursor.fetchone()
        emailCount = result[0]
        print("emailCount: ", emailCount)
        print("type : ", type(emailCount))
        connection.commit()
    except Exception as e:
        return jsonify({'response': e}), 500
    cursor.close()

    return emailCount




# class - not being used at all at the moment
class UserInformation:
    def __init__(self, name, email, password, userType):
        self.name = name
        self.email = email
        self.password = password
        self.userType = userType





# # Basic example of an api route (called front-end from localhost/user)
# @app.route('/')
# def hello_world():
#     return {'APIUser1' : 'Active'}



@app.route('/register', methods=['POST'])
def register():
    # return request.data         #string
    # return request.form
    newData = request.get_json()            #get dictionary.

    name = newData["name"]
    email = newData["email"]                # get request.
    password = newData["password"]
    userType = newData["userType"]      # host or attendee


    connection = mysql.connector.connect(**config)          # connect to db using configuration.



    validation(name, email, password, userType)         # validation of email



    # check if email exists and if email-userType combination exists.

    emailCount = doesEmailExist(connection, email, userType)


    print("final email count : ", emailCount)
    # register user.


    if (emailCount > 0):
        #email already exists, send back
        connection.close()
        return jsonify({"response": "This email has already been registered."}), 400

    else:
        #email doesn't exist, register
        print("users table before: ", selectUsers())



        salt = os.urandom(16)
        # newSalt = str(base64.b64encode(salt))
        print("salt : ", salt)
        print("len : ", len(salt))
        # print("newSalt : ", newSalt)
        # prit("le : ", len(newSalt))

        saltHex = salt.hex()
        print("saltHex : ", saltHex)
        print("type : ", saltHex)
        print("len : ", len(saltHex))



        passwordSalt = password + saltHex
        print("passwordSalt : ", passwordSalt)
        print("type : ", type(passwordSalt))
        print("len : ", len(passwordSalt))


        passwordHash = generate_password_hash(passwordSalt, "sha256")
        print("passwordHash : ", passwordHash)
        print("type : ", type(passwordHash))
        print("len : ", len(passwordHash))



        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        insertQuery = "INSERT INTO Users (name,email, passwordSalt, passwordHash) VALUES (%s,%s,%s,%s)"

        try:
            cursor = connection.cursor()
            cursor.execute(insertQuery, (name, email, saltHex, passwordHash))

            if cursor.lastrowid:
                newUserID = cursor.lastrowid
                print('last insert id', cursor.lastrowid)
            else:
                print('last insert id not found')

            connection.commit()
        except Exception as e:
            return jsonify({'response': e}), 500

        cursor.close()
        # connection.close()

        print("users table after: ", selectUsers())
        print("newUserID", newUserID)

        connection.close()


        # accessToken = create_access_token(identity=newUserID, expires_delta = datetime.timedelta(days=15))
        # accessToken = create_access_token(identity=newUserID, expires_delta = datetime.timedelta(seconds=15))
        accessToken = create_access_token(identity=newUserID, expires_delta = datetime.timedelta(days=30))
        refreshToken = create_refresh_token(newUserID)      # maybe expiration?

        print("accessToken : ", accessToken)
        print("refreshToken : ", refreshToken)




        return jsonify(access_token=accessToken, refresh_token=refreshToken, response=name), 200



        # return jsonify({"userID": newUserID}), 200          #***FORMAT for returning back to frontend.








# # this is to test the default jwt_required decorator. Access token only.
# @app.route('/protected')
# @jwt_required()
# def protected():
#     return jsonify({"message" : "This is available to folks with a non-expired token."})



# this is to refresh the access token, take in the refresh token. request should have the request token.
@app.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh():
    currentUserID = get_jwt_identity()
    print("currentUserID : ", currentUserID)
    newAccessToken = create_access_token(identity=currentUserID, expires_delta = datetime.timedelta(days=30))
    print("newAccessToken : ", newAccessToken)
    return jsonify(access_token=newAccessToken), 200






@app.route('/login', methods=['POST'])
def login():
    newData = request.get_json()            #get dictionary input from front end.

    # FRONTEND - must include; these fields or it causes an internal server error.

    email = newData["email"]                # get request.
    password = newData["password"]
    userType = newData["userType"]

    connection = mysql.connector.connect(**config)      # connect to sql.


    validation("name", email, password, userType)         # validation of email



    # check if email-userType combination exists

    emailCount = doesEmailExist(connection, email, userType)





    if (emailCount == 0):
        #email doesn't exist, send back
        connection.close()
        return jsonify({"response": "Invalid login. Please try again."}), 400

    if (emailCount == 1):
        #email already exists, log in.
        print("users table before: ", selectUsers())



        # check password. first we get hash and salt from the database, and then compare it.
        cursor = connection.cursor()
        getInfoQuery = "SELECT passwordSalt, passwordHash, userID, name FROM Users WHERE email = %s"

        try:
            cursor.execute(getInfoQuery, (email,))
            infoResult = cursor.fetchall()
            print("infoResult : ", infoResult)
            print("type : ", type(infoResult))      # should be a tuple.
            saltHex = infoResult[0][0]
            passwordHash = infoResult[0][1]
            userID = infoResult[0][2]
            name = infoResult[0][3]
            print("saltHex : ", saltHex)
            print("passwordHash : ", passwordHash)
            print("UserID : ", userID)

            connection.commit()

            passwordSalt = password + saltHex

            passwordCheck = check_password_hash(passwordHash, passwordSalt)

            print("passswordCheck : ", passwordCheck)


        except Exception as e:
            return jsonify({'response' : e}), 500
        cursor.close()
        print("users table after: ", selectUsers())
        # print("newUserID", newUserID)

        connection.close()



        if (passwordCheck == True):
            # password matches, generate token and send back.
            accessToken = create_access_token(identity=userID, expires_delta = datetime.timedelta(days=30))
            # accessToken = create_access_token(identity=userID, expires_delta = datetime.timedelta(days=15))
            refreshToken = create_refresh_token(userID)      # maybe expiration?

            print("accessToken : ", accessToken)
            print("refreshToken : ", refreshToken)
            return jsonify(access_token=accessToken, refresh_token=refreshToken, response=name), 200


        else:
            # password fails, send back.
            return jsonify({"response": "Invalid login. Please try again."}), 400


    else:
        #something has gone wrong, send back an error message.
        connection.close()
        return jsonify({'response' : 'Login Invalid. Please try again'}), 500








# Running the API:
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001')


#*** Database Steps here.

#db
# mydb = MySQLdb.connect(host=host, user=user, passwd=passwd, db=database, charset="utf8")
# cursor = mydb.cursor()
# query = "INSERT INTO tablename (text_for_field1, text_for_field2, text_for_field3, text_for_field4) VALUES (%s, %s, %s, %s)"
# cursor.execute(query, (field1, field2, field3, field4))
# mydb.commit()
# cursor.close()
# mydb.close()
