import pymongo
import numpy

#gets you the handler on the mongo client
client = pymongo.MongoClient()
#choose the data base
db = client.Surveys
#choose the collection
collection = db.userdetails
#example code
def InsertDummyRecords():
	collection.insert({"driverID" : "JohnD@example.com", "start_long" : "33.2991"})

def persist_in_mongo(username, email, surveyResponse):
	collection.insert({
		"username": username, 
		'useremail': email, 
		'color': surveyResponse['color'],
		'food': surveyResponse['food'],
		'vacation': surveyResponse['vacation'],
		'fe-before': surveyResponse['fe-before'],
		'fe-after': surveyResponse['fe-after'],
		'comments': surveyResponse['comments'],
		'focus': surveyResponse['focus']
	})

def aggregate_feBefore():
	myResults = collection.find()
	feBefore = []
	for item in myResults:
		feBefore.append(float(item['fe-before'].encode('ascii', 'ignore')))
	return numpy.mean(feBefore)

def aggregate_feAfter():
	myResults = collection.find()
	feAfter = []
	for item in myResults:
		feAfter.append(float(item['fe-after'].encode('ascii', 'ignore')))
	return numpy.mean(feAfter)

def aggregate_userGroup():
	myResults = collection.find()
	userGroup = []
	for item in myResults:
		userGroup.append(item['username'].encode('ascii', 'ignore'))
	userSet = set(userGroup)
	uniqueUserGroup = list(userSet)
	return uniqueUserGroup
