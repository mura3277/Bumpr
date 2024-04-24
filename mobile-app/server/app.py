from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, firestore
from random import randint, sample
from google.cloud import storage
import os, time, json, ast, re, io
from ml_interface import predict
import numpy as np
from math import cos, asin, sqrt, pi
from PIL import Image

# When running locally, the credentials are imported from a google-services.json file
# When running on a server, we'll import the environment variables via .yaml
cred = credentials.Certificate('')
firebase_admin.initialize_app(cred)

db = firestore.client()
# Only need db and cloud storage bucket when uploading images 
CLOUD_STORAGE_BUCKET = ""

# Had originally set up to use all these brands, but is not necesssary for demonstration
# purposes, but it works for all of them
brands = ["Acura", "Alfa-Romeo", "Aston-Martin", "Audi", "Bentley", 
          "BMW", "Bugatti", "Buick", "Cadillac", "Chevrolet", "Chrysler"]
"""
"Citroen", "Deus Automobiles", "Dodge", "Ferrari", "Fiat", "Ford",
"Geely", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar",
"Jeep", "Kia", "Koenigsegg", "Lamborghini", "Lancia", "Land Rover", 
"Lexus", "Lincoln", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren",
"Mercedes", "Mini", "Mitsubishi", "Nissan", "Opel", "Pagani", "Peugeot", 
"Pontiac", "Porsche", "Ram", "Renault", "Rolls-Royce", "Skoda", "Smart", 
"Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"]
"""

# These are some of the most common car model names, which I've stored. Only necessary
# for automation, when generating names of car posts
models = ["Aerio","Corsica","Greiz","Outback","Aerostar","Cortina","Gremlin","Outlander",
          "Aileron","Corvette","Grenada","Paceman","Airstream","Cougar","Highlander","Pacer",
          "Alero","Countach","Hobio","Pacifica","Allante","Courier","Hombre","Pampa",
          "Alliance","Cressida","Horizon","Panamera","Alpine","Crider","Hornet","Parisienne",
          "Altima","Crossfire","Hummer","Park Avenue","Amanti","Crosstrek","Hunter","Park Ward",
          "Amaze","Crown Victoria","Huracan","Paseo","Amigo","Cruze","Husky","Passat",
          "Anglia","Cube","Ikon","Passport","Aperta","Cutlass","Impala","Pathfinder",
          "Aries","Dakota","Imperial","Patriot","Armada","Dart","Impreza","Phaeton",
          "Arnage","Dasher","Impulse","Phantom","Arrow","Daytona","Inscription","Phoenix",
          "Arya","Defender","Insight","Pilot","Ascari","del Sol","Integra","Pininfarina",
          "Ascender","Delta","Intrepid","Polara","Ascent","Demon","Intrigue","Popular",
          "Aspen","DeVille","Ioniq","Portofino","Aspire","Diablo","Jade","Precis",
          "Astra","Diamante","Javelin","Prefect","Astro","Dino","Jazz","Prelude",
          "Aura","Diplomat","Jetta","Premier","Aurora","Discovery","Jimmy","Previa",
          "Avalanche","Drifter","Juke","Prius","Avalon","Durango","Justy","Prizm",
          "Avancier","Duster","Ka","Probe","Avenger","Dynasty","Karma","Pronto"]

# Placeholder/Stock Text for both the description and for generating messages in automation
loremIpsum = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
deserunt mollit anim id est laborum.""".replace("\n","")

# Most common given names, used for automatically adding users
givenNames = ['Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
             'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 
             'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 
             'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 
             'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 
             'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah', 
             'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon', 'Jeffrey', 'Laura', 
             'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy', 'Nicholas', 'Shirley', 'Eric', 
             'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna', 'Larry', 'Brenda', 'Justin', 'Pamela', 
             'Scott', 'Nicole', 'Brandon', 'Emma', 'Benjamin', 'Samantha', 'Samuel', 'Katherine', 
             'Gregory', 'Christine', 'Frank', 'Debra', 'Alexander', 'Rachel', 'Raymond', 'Catherine', 
             'Patrick', 'Carolyn', 'Jack', 'Janet', 'Dennis', 'Ruth', 'Jerry', 'Maria', 'Robert']

# Most common Scottish surnames, again for automation when adding users
surnames = ['SMITH' 'BROWN', 'STEVENSON', 'WILSON', 'WOOD', 'THOMSON', 'SUTHERLAND', 'ROBERTSON', 
            'CRAIG', 'CAMPBELL', 'WRIGHT', 'STEWART', 'MCKENZIE', 'ANDERSON', 'KENNEDY', 'MACDONALD', 
            'JONES', 'SCOTT', 'BURNS', 'REID', 'WHITE', 'MURRAY', 'MUIR', 'TAYLOR', 'MURPHY', 'CLARK', 
            'JOHNSTONE', 'MITCHELL', 'HUGHES', 'ROSS', 'WATT', 'WALKER', 'MCMILLAN', 'PATERSON', 'MCINTOSH', 
            'YOUNG', 'MILNE', 'WATSON', 'MUNRO', 'MORRISON', 'RITCHIE', 'MILLER', 'DICKSON', 'FRASER', 'BRUCE', 
            'DAVIDSON', 'KING', 'GRAY', 'CRAWFORD', 'MCDONALD', 'DOCHERTY', 'HENDERSON', 'MILLAR', 'JOHNSTON',
             'CUNNINGHAM', 'HAMILTON', 'SINCLAIR', 'GRAHAM', 'WILLIAMSON', 'KERR', 'HILL', 'SIMPSON', 'MCGREGOR', 
             'MARTIN', 'MCKAY', 'FERGUSON', 'BOYLE', 'CAMERON', 'SHAW', 'DUNCAN', 'FLEMING', 'HUNTER', 'MOORE', 
             'KELLY', 'CHRISTIE', 'BELL', 'DOUGLAS', 'GRANT', 'DONALDSON', 'MACKENZIE', 'ALEXANDER', 'MACKAY', 
             'MACLEAN', 'ALLAN', 'FORBES', 'BLACK', 'WILLIAMS', 'MACLEOD', 'MCINTYRE', 'MCLEAN', 'FINDLAY', 
             'RUSSELL', 'MARSHALL', 'JAMIESON', 'GIBSON', 'AITKEN', 'WALLACE', 'REILLY', 'GORDON', 'THOMPSON']

# A selection of cities and their lat/lng pairs for automation of adding users
locations = [{'city': 'York, North Yorkshire, the UK', 'lat': 53.958332, 'lng': -1.080278}, 
             {'city': 'Worcester, Worcestershire, the UK', 'lat': 52.192001, 'lng': -2.22}, 
             {'city': 'Winchester, Hampshire, the UK', 'lat': 51.063202, 'lng': -1.308}, 
             {'city': 'Wells, South West England, the UK', 'lat': 51.209, 'lng': -2.647}, 
             {'city': 'Wakefield, West Yorkshire, the UK', 'lat': 53.68, 'lng': -1.49}, 
             {'city': 'Truro, Cornwall, the UK', 'lat': 50.259998, 'lng': -5.051}, 
             {'city': 'Sunderland, North East, the UK', 'lat': 54.906101, 'lng': -1.38113}, 
             {'city': 'Sheffield, South Yorkshire, the UK', 'lat': 53.383331, 'lng': -1.466667}, 
             {'city': 'Salford, North West, the UK', 'lat': 53.483002, 'lng': -2.2931}, 
             {'city': 'St. Davids, Wales, the UK', 'lat': 51.882, 'lng': -5.269}, 
             {'city': 'St.Albans, Hertfordshire, the UK', 'lat': 51.755001, 'lng': -0.336}, 
             {'city': 'Ripon, North Yorkshire, the UK', 'lat': 54.138, 'lng': -1.524}, 
             {'city': 'Portsmouth, Hampshire, the UK', 'lat': 50.805832, 'lng': -1.087222}, 
             {'city': 'Perth, Scotland, the UK', 'lat': 56.396999, 'lng': -3.437}, 
             {'city': 'Nottingham, the UK', 'lat': 52.950001, 'lng': -1.15}, 
             {'city': 'Newry, Northern Ireland, the UK', 'lat': 54.175999, 'lng': -6.349}, 
             {'city': 'Newcastle Upon Tyne, the UK', 'lat': 54.966667, 'lng': -1.6}, 
             {'city': 'Liverpool, the UK', 'lat': 53.400002, 'lng': -2.983333}, 
             {'city': 'Lincoln, Lincolnshire, the UK', 'lat': 53.234444, 'lng': -0.538611}, 
             {'city': 'Lichfield, Staffordshire, the UK', 'lat': 52.683498, 'lng': -1.82653}, 
             {'city': 'Leicester, the East Midlands, the UK', 'lat': 52.633331, 'lng': -1.133333}, 
             {'city': 'Lancaster, Lancashire, the UK', 'lat': 54.047001, 'lng': -2.801}, 
             {'city': 'Hereford, Herefordshire, the UK', 'lat': 52.056499, 'lng': -2.716}, 
             {'city': 'Gloucester, Gloucestershire, the UK', 'lat': 51.864445, 'lng': -2.244444}, 
             {'city': 'Glasgow, the UK', 'lat': 55.860916, 'lng': -4.251433}, 
             {'city': 'Exeter, the UK', 'lat': 50.716667, 'lng': -3.533333}, 
             {'city': 'Ely, Cambridgeshire, the UK', 'lat': 52.398056, 'lng': 0.262222}, 
             {'city': 'Durham, the UK', 'lat': 54.7761, 'lng': -1.5733}, 
             {'city': 'Dundee, Scotland, the UK', 'lat': 56.462002, 'lng': -2.9707}, 
             {'city': 'Derry, Northern Ireland, the UK', 'lat': 54.9958, 'lng': -7.3074}, 
             {'city': 'Derby, Derbyshire, the UK', 'lat': 52.916668, 'lng': -1.466667}, 
             {'city': 'Coventry, West Midlands, the UK', 'lat': 52.408054, 'lng': -1.510556}, 
             {'city': 'Chichester, West Sussex, the UK', 'lat': 50.836498, 'lng': -0.7792}, 
             {'city': 'Chester, Chesire, the UK', 'lat': 53.189999, 'lng': -2.89}, 
             {'city': 'Chelmsford, Essex, the UK', 'lat': 51.736099, 'lng': 0.4798}, 
             {'city': 'Carlisle, North West, the UK', 'lat': 54.890999, 'lng': -2.944}, 
             {'city': 'Canterbury, Kent, the UK', 'lat': 51.279999, 'lng': 1.08}, 
             {'city': 'Cambridge, Cambridgeshire, the UK', 'lat': 52.205276, 'lng': 0.119167}, 
             {'city': 'Brighton & Hove, East Sussex, the UK', 'lat': 50.827778, 'lng': -0.152778}, 
             {'city': 'Bradford, West Yorkshire, the UK', 'lat': 53.799999, 'lng': -1.75}, 
             {'city': 'Bath, Somerset, the UK', 'lat': 51.380001, 'lng': -2.36}, 
             {'city': 'Peterborough, Cambridgeshire, the UK', 'lat': 52.573921, 'lng': -0.25083}, 
             {'city': 'Elgin, Scotland, the UK', 'lat': 57.653484, 'lng': -3.335724}, 
             {'city': 'Stoke-on-Trent, Staffordshire, the UK', 'lat': 53.002666, 'lng': -2.179404}, 
             {'city': 'Solihull, Birmingham, UK', 'lat': 52.412811, 'lng': -1.778197}, 
             {'city': 'Cardiff, Wales, UK', 'lat': 51.481583, 'lng': -3.17909}, 
             {'city': 'Eastbourne, East Sussex, UK', 'lat': 50.768036, 'lng': 0.290472}, 
             {'city': 'Oxford, UK', 'lat': 51.752022, 'lng': -1.257677}, 
             {'city': 'London, the UK', 'lat': 51.509865, 'lng': -0.118092}, 
             {'city': 'Swindon, Swindon, UK', 'lat': 51.568535, 'lng': -1.772232}, 
             {'city': 'Gravesend, Kent, UK', 'lat': 51.441883, 'lng': 0.370759},
             {'city': 'Northampton, Northamptonshire, UK', 'lat': 52.240479, 'lng': -0.902656}, 
             {'city': 'Rugby, Warwickshire, UK', 'lat': 52.370876, 'lng': -1.265032}, 
             {'city': 'Sutton Coldfield, West Midlands, UK', 'lat': 52.570385, 'lng': -1.824042}, 
             {'city': 'Harlow, Essex, UK', 'lat': 51.772938, 'lng': 0.10231}, 
             {'city': 'Aberdeen, UK', 'lat': 57.149651, 'lng': -2.099075}, 
             {'city': 'Swansea, UK', 'lat': 51.621441, 'lng': -3.943646}, 
             {'city': 'Chesterfield, Derbyshire, UK', 'lat': 53.235046, 'lng': -1.421629}, 
             {'city': 'Lisburn, Ireland, UK', 'lat': 54.50972, 'lng': -6.0374}, 
             {'city': 'Londonderry, Derry, UK', 'lat': 55.006763, 'lng': -7.318268}, 
             {'city': 'Salisbury, Wiltshire, UK', 'lat': 51.068787, 'lng': -1.794472}, 
             {'city': 'Manchester, UK', 'lat': 53.483959, 'lng': -2.244644}, 
             {'city': 'Bristol, UK', 'lat': 51.454514, 'lng': -2.58791}, 
             {'city': 'Wolverhampton, West Midlands, UK', 'lat': 52.59137, 'lng': -2.110748}, 
             {'city': 'Preston, Lancashire, UK', 'lat': 53.765762, 'lng': -2.692337}, 
             {'city': 'Ayr, South Ayrshire, UK', 'lat': 55.458565, 'lng': -4.629179}, 
             {'city': 'Hastings, East Sussex, UK', 'lat': 50.854259, 'lng': 0.573453}, 
             {'city': 'Bedford, UK', 'lat': 52.136436, 'lng': -0.460739}, 
             {'city': 'Basildon, Essex, UK', 'lat': 51.572376, 'lng': 0.470009}, 
             {'city': 'Chippenham, Wiltshire, UK', 'lat': 51.458057, 'lng': -2.116074}, 
             {'city': 'Birmingham, West Midlands, UK', 'lat': 52.489471, 'lng': -1.898575}, 
             {'city': 'Folkestone, Kent, UK', 'lat': 51.081398, 'lng': 1.169456}, 
             {'city': 'Edinburgh, Scotland, UK', 'lat': 55.953251, 'lng': -3.188267}, 
             {'city': 'Southampton, UK', 'lat': 50.909698, 'lng': -1.404351}, 
             {'city': 'Belfast, Northern Ireland, the UK', 'lat': 54.607868, 'lng': -5.926437}]

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


# A useful way to show errors that might occur when Debugging
@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error=str(e)), 500

# =======================
#   Automation Section
# =======================

@app.route('/addUsers/<numberOfUsers>')
def addUsers(numberOfUsers):
    """ Used to automatically add a certain number of users to the database """  
    # cast the string as an int
    numberOfUsers = int(numberOfUsers)
    # we want an even number of add users, so the number of buyers and sellers is equivalent
    # not super necessary but just makes things easier
    if numberOfUsers%2!=0:
        numberOfUsers+=1

    # Default settings for both seller and buyer    
    sellerSettings = {
        "accountType":1,
        "locationRadius":45,
        "miles":True
    }
    
    buyerSettings = {
        "maxPrice":10,
        "locationRadius":45,
        "miles":True,
        "carFeatures":[-1]
    }

    for i in range(numberOfUsers):
        isBuyer = False
        if(i%2==0): isBuyer = True
        # Select a random name, email, and location value
        name = givenNames[randint(0, len(givenNames)-1)]+" "+surnames[randint(0, len(surnames)-1)]
        email = name.replace(" ","").lower()+str(randint(0,100))+"@gmail.com"
        location = locations[randint(0,len(locations)-1)]
        # set the user's data
        userData = {
                'email': email,
                'name': name,
                'isBuyer': isBuyer,
                'location': location
        }
        # the return values of adding a user to a collection is the time it was added
        # and the document reference of the document added 
        timeOfSending, docRef = db.collection('users').add(userData)
        # we want a settings entry with the same id as the user that corresponds 
        # to their settings
        settingsRef = db.collection('settings').document(docRef.id)
        # set the settings and create a likes and dislikes page if they're a buyer
        if(isBuyer):
            settingsRef.set(buyerSettings)
            likesRef = db.collection('likes').document(docRef.id)
            likesRef.set({'posts':[]})
            dislikesRef = db.collection('likes').document(docRef.id)
            dislikesRef.set({'posts':[]})
        else:
            settingsRef.set(sellerSettings)
    
    return "Succesfully added " + str(numberOfUsers) + " users"

@app.route('/autoLikePost/<numberOfUsers>/<numberOfLikes>')
def autoLikePost(numberOfUsers, numberOfLikes):
    """ Used to automatically add likes to users, simulating user data """  
    # retrieve all the users' likes
    likesTotal = db.collection('likes').get()
    # create a random sample of users given the number of users to select from
    likeSelection = sample(range(0,len(likesTotal)), int(numberOfUsers))
    # Then create a list of pairs of user ids and their likes
    likes = []
    for likeNum in likeSelection:
        likes.append((likesTotal[likeNum].id, likesTotal[likeNum].to_dict()))
    # Retrieve all post document references (or specific posts by a particular user to force an example)
    # postDocs = db.collection('posts').where('sellerId','==','cJzzNzFAtbgvX10l3zpzohYx8le2').get()
    postDocs = db.collection('posts').get()
    posts = [doc.id for doc in postDocs]
    
    # We've now established all the users and their likes
    # let's now apply the likes
    for pair in likes:
        # pair[1] = all the likes of the user
        tmpLikes = pair[1]
        # get a reference to the entity of the user, so we can set the new likes
        likeRef = db.collection('likes').document(pair[0])
        for j in range(int(numberOfLikes)):
            # select a random post
            tmpPost = posts[randint(0,len(posts)-1)]
            # if the random post hasn't been liked, let's like it
            if tmpPost not in tmpLikes["posts"]:
                # add the post
                tmpLikes["posts"].append(tmpPost)
                # find the people interestd in buying the post
                users = db.collection('interestedBuyers').document(tmpPost).get().get('users')
                ibRef = db.collection('interestedBuyers').document(tmpPost)
                users.append(pair[0])
                # add the new interested buyer
                ibRef.set({'users':users})
        # set all the likes
        likeRef.set(tmpLikes)
    # print the output for verification
    return(str(likes))

@app.route('/addPosts/<numberOfPosts>')
def addPosts(numberOfPosts):
    """ Used to automatically add a certain number of posts to the database """
    posts = []
    
    # retrieve all the users that are sellers (ie buyer !=True)
    sellers = db.collection('users').where('isBuyer','==',False).get()
    sellerIds = [seller.id for seller in sellers]
    
    for i in range(int(numberOfPosts)):
        # create a random price
        askingPrice=str(randint(3,50)*1000)
        # select a random brand from the list above
        brand = brands[randint(0, len(brands)-1)]
        # select a random model name form the list above and add a random 
        # series number between 1 and 13
        model = models[randint(0, len(models)-1)]+" "+str(randint(1,13))
        sellerId = sellerIds[randint(0,len(sellerIds)-1)]
        # the selectedFeatures have a maximum value of 48 in the react
        # and allow up to 20 of them
        selectedFeatures = sample(range(0,48), randint(2,20))
        start = randint(0,len(loremIpsum)-1)
        if(start<len(loremIpsum)-15):
            end = start+randint(10,len(loremIpsum)-10)
        else:
            end = len(loremIpsum)-1
        # get a random selection of loremIpsum
        desc = loremIpsum[start:10+end]
        
        imageLinks = []
        # I stored 6 of each brand of car in the storage
        pics = sample(range(0,6), randint(1,6))

        for picNum in pics:
            # this is the storage ending for each image
            picDirectory = "images/"+brand+"/"+str(picNum)+".png"    
            imageLinks.append(picDirectory)

        # now set a temporary dictionary with all the necessary info
        data = {'askingPrice':askingPrice, 
                'brand':brand, 
                "desc":desc, 
                "images":imageLinks,
                "model":model,
                "selectedFeatures":{"selectedFeatures":selectedFeatures},
                "sellerId":sellerId}
        
        # add the data
        timeOfUpload, docRef = db.collection('posts').add(data)
        # create an Interested Buyers list for the postId
        ib = db.collection("interestedBuyers").document(docRef.id)
        ib.set({"users":[]})
    return "Succesfully added " + str(numberOfPosts) + " post"

@app.route('/autoConfirmInterestedBuyers/<numberOfConvos>')
def autoConfirmInterestedBuyer(numberOfConvos):
    """ Used to automatically create conversations by forcing sellers to confirm users that like their posts """
    # retrieve all interestedBuyers
    interestedBuyers = db.collection('interestedBuyers').get()

    for i in range(int(numberOfConvos)):
        # select a random post
        randomPostShot = interestedBuyers[randint(0,len(interestedBuyers)-1)]
        # retrieve all the users that like this random post
        potentialBuyers = randomPostShot.to_dict()["users"]
        # select a random buyer from the interested ones
        buyerId = potentialBuyers[randint(0,len(potentialBuyers)-1)]
        # get the postId
        postId = randomPostShot.id
        # find the seller's id so that we can create a conversation between them and the buyer
        userId = db.collection('posts').document(postId).get().get("sellerId")
        # remove the buyer from the interested buyer's post
        res = deleteInterestedBuyer(userId, postId, buyerId)
        if res == "Succesfully deleted":
            convoData = {"buyerId":buyerId, "sellerId":userId, "postId":postId}
            # set the new conversation data
            timeOfSending, docRef = db.collection('convos').add(convoData)
            # the conversation's id should be the same as the messages
            messagesRef = db.collection('messages').document(docRef.id)
            messageData = {"messages":[]}
            # set the message data to be empty
            messagesRef.set(messageData)
        else:
            return res
    return "Succesfully created " + str(numberOfConvos) + " conversations."

@app.route('/autoGenerateMessages/<numberOfConvos>/<maxMessages>')
def autoGenerateMessages(numberOfConvos, maxMessages):
    """ Used to automatically populate messages in conversations """
    messageConversations = db.collection('messages').get()

    for i in range(int(numberOfConvos)):
        # select a random conversation to populate
        randomConvo = messageConversations[randint(0,len(messageConversations)-1)]

        # get all the messages
        messages = randomConvo.to_dict()["messages"]
        # get the number of what the next message should be
        messageIdx = len(messages)
        # select a number between 1 and the max to create a random 
        # number of messages
        numberOfMessages = randint(1, int(maxMessages))
        
        for j in range(numberOfMessages):
            # determine if the it's the buyer or seller sending a message
            sender = randint(0,1)
            user = False
            if sender == 1:
                user = True
            
            start = randint(0,len(loremIpsum))
            if(start<len(loremIpsum)-15):
                end = start+randint(10,len(loremIpsum)-10)
            else:
                end = len(loremIpsum)-1
            # select a random selection of lorem ipsum
            msg = loremIpsum[start:10+end]
            tmp = {
                'user':user,
                'msgId':messageIdx,
                'msg': msg
            }
            # add the next message
            messages.append(tmp)
            messageIdx+=1
        # get the messages from this conversation
        messageConvoRef = db.collection("messages").document(randomConvo.id)
        # set to add all the new messages
        messageConvoRef.set({"messages":messages})
    return "Succesfully genereated messages for " + str(numberOfConvos) + " conversations."

# =======================
#    Settings Section
# =======================

@app.route('/getSettings/<userId>')
def getSettings(userId):
    """ Retrieves the settings/preferences of the provided userId"""
    doc = db.collection('settings').document(userId).get().to_dict()
    # return a string of the dictionary where all ' are replaced with ", so it's
    # readable as an object immediately by React
    return str(doc).replace("True","1").replace("False","0").replace('\'','\"')


@app.route('/updateSettings/<userId>/<data>')
def updateSettings(userId, data):
    """ Updates a given user's (from userId) preferences (data) """
    settingsRef = db.collection('settings').document(userId)
    # Try to recast the input as a dictionary
    try:
        d = ast.literal_eval(data)
        # update the settings
        settingsRef.set(d)
    except Exception as e:
        print(e)
        return "Failure"
    return "Success"

# =======================
#      Posts Section
# =======================

def calculateDist(pair1, pair2):
    """ Calculates the distance between two (lat, lng) pairs in miles """
    # convert to radians
    p = pi/180
    # formula for calculating the distance
    a = 0.5 - cos((pair2[0]-pair1[0])*p)/2 + cos(pair1[0]*p) * cos(pair2[0]*p) * (1-cos((pair2[1]-pair1[1])*p))/2
    return 12742 * asin(sqrt(a))

@app.route('/verifyImage/<imgPath>')
def verifyImage(imgPath):
    """ Before a post is shown, the machine learning model will have to check if a car is present """
    # create the firestore storage client
    storage_client = storage.Client()
    # all the user uploaded images with the provided name
    # will be at this image path
    prefix = "images/userUploaded/"+imgPath
    # retrieve the bucket where it's stored
    bucket = storage_client.get_bucket(CLOUD_STORAGE_BUCKET)
    # List objects with the given prefix.
    blob_list = list(bucket.list_blobs(prefix=prefix))
    # there will only be one item in this list, which 
    # is the image we want
    blob = blob_list[0]
    
    # Download the image as a blob and then 
    # convert it to a numpy array
    blobString = blob.download_as_string()
    blobBytes = io.BytesIO(blobString)
    im = Image.open(blobBytes)
    im = Image.open(blobBytes).convert('RGB')
    na = np.array(im)
    # get the result from the machine learning model
    # and return the result
    result, err = predict(na)    
    if not result:
        return "False "+err
    return "True"

@app.route('/editPost/<userId>/<postId>/<data>')
def editPost(userId, postId, data):
    """ Updates a seller's given post """
    post = db.collection('posts').document(postId).get()
    # select the post document reference
    postRef = db.collection('posts').document(postId)
    # assert the seller of this postId is the userId
    if(post.get('sellerId')!=userId):
        return "User is not poster"
    try:
        # try to cast the data as a dictionary
        d = ast.literal_eval(data)
        # in case someone somehow reset their postId
        d["sellerId"] = userId
        # because of the issues with storing ' and ", I will replace all
        # ' with RUFUSAPOSTROPHE (not a long-term solution, but will likely be fine unless 
        # people start sending RUFUSAPOSTROPHE, which will then render an apostrophe on their screen)
        d["desc"] = d["desc"].replace("\'","RUFUSAPOSTROPHE")
        d["brand"] = d["brand"].replace("\'","RUFUSAPOSTROPHE")
        d["model"] = d["model"].replace("\'","RUFUSAPOSTROPHE")
        d["postId"] = postId
        for i in range(len(d["images"])):
            # there was a similar problem with sending / to the backend, so we send FORWARDSLASHRUFUSBEHR
            # which is replaced here and then the images are returned fine
            d["images"][i] = d["images"][i].replace("FORWARDSLASHRUFUSBEHR","/")
        # update the post
        postRef.set(d)
    except Exception as e:
        print(e)
        return "Failure"
    return "Success"

@app.route('/deletePost/<userId>/<postId>')
def deletePost(userId, postId):
    """ Deletes a given seller's post """
    post = db.collection('posts').document(postId).get()
    # confirm the seller of the post is the user
    if(post.get('sellerId')!=userId):
        return "User is not poster"
    # get all the convesations about this car
    convoDocs = db.collection('convos').where('postId','==',postId).get()
    # get the postReference
    postRef = db.collection('posts').document(postId)
    # get the post's interested buyer's reference
    ibRef = db.collection('interestedBuyers').document(postId)
    # delete all the message for the conversations and the conversation itself
    for doc in convoDocs:
        db.collection('messages').document(doc.id).delete()
        doc.delete()
    # then delete the post and interested buyer
    postRef.delete()
    ibRef.delete()
    return "Success"

@app.route('/getBuyerPosts/<userId>')
def getBuyerPosts(userId):
    """ Returns all the posts for buyers """
    # get all the posts in the form of interested buyers (to confirm
    # the user is not already interested in buying)
    ibs = db.collection('interestedBuyers').get()
    # also want to make sure the user hasn't disliked the post yet
    dislikes = db.collection('dislikes').document(userId).get().to_dict()["posts"]
    # the location of the buyer, to calculate if a given post is 
    # within their preferred distance
    location = db.collection('users').document(userId).get().to_dict()["location"]
    latLngUser = (location["lat"],location["lng"])
    # to retrieve their car preferences
    settings = db.collection('settings').document(userId).get().to_dict()
    carPrefFeatures = settings["carFeatures"]["selectedItems"]
    
    # this will be a list of all the posts for the buyer to view
    result = []
    # just start going through the posts
    for ib in ibs:
        # only need to return 5 posts at a time (could be more, 
        # arbitrarily chosen)
        if len(result)==5:
            break
        # get the post as a dictionary
        tmp = db.collection('posts').document(ib.id).get().to_dict()

        # check if the user hasn't already liked or disliked the post
        if userId not in ib.to_dict()["users"] and ib.id not in dislikes:

            inPrice = True
            # check if the post is within their asking price
            if float(tmp["askingPrice"])>settings["maxPrice"]*1000:
                inPrice = False

            if inPrice:
                carFeats = True
                # make sure the car has all the preferences the user wants
                for feat in carPrefFeatures:
                    if feat not in tmp["selectedFeatures"]["selectedFeatures"]:
                        carFeats = False
                if carFeats:
                    # find the seller's location
                    sellerDict = db.collection('users').document(tmp["sellerId"]).get().to_dict()
                    sellerLatlng = (sellerDict["location"]["lat"],sellerDict["location"]["lng"])

                    # calculate the distance between the seller and buyer
                    dist = calculateDist(latLngUser,sellerLatlng)
                    # if the radius isn't 200+ or if the distance is less than the radius
                    if settings["locationRadius"]>=199 or dist<settings["locationRadius"]:
                        # ' with RUFUSAPOSTROPHE as before, to account for ' in the text
                        tmp["sellingLoc"] = sellerDict["location"]["city"].replace("\'","RUFUSAPOSTROPHE")
                        tmp["desc"] = tmp["desc"].replace("\'","RUFUSAPOSTROPHE")
                        tmp["brand"] = tmp["brand"].replace("\'","RUFUSAPOSTROPHE")
                        tmp["model"] = tmp["model"].replace("\'","RUFUSAPOSTROPHE")
                        tmp["postId"] = ib.id
                        result.append(tmp)
    # return the results as a readable object for react
    return str({'data':result}).replace('\'','\"')
    

@app.route('/getSellerPosts/<userId>')
def getSellerPosts(userId):
    """ Returns all the posts for the Sellers """
    # Retrieve all the posts by the seller
    docs = db.collection('posts').where('sellerId','==',userId).get()
    tmpResult = [(doc.id, doc.to_dict()) for doc in docs]
    result = []
    for pair in tmpResult:
        tmp = pair[1]
        tmp["postId"] = pair[0]
        # ' with RUFUSAPOSTROPHE as before, to account for ' in the text
        tmp["desc"] = tmp["desc"].replace("\'","RUFUSAPOSTROPHE")
        tmp["brand"] = tmp["brand"].replace("\'","RUFUSAPOSTROPHE")
        tmp["model"] = tmp["model"].replace("\'","RUFUSAPOSTROPHE")
        result.append(tmp)
    # return the results as an object
    return str(result).replace('\'','\"')


@app.route('/likePost/<userId>/<postId>')
def likePost(userId, postId):
    """ A given user likes a particular postId """
    # gets all the likes of the users
    likeRef = db.collection('likes').document(userId)
    likeValues = likeRef.get().get('posts')
    likeValues.append(postId)
    # gets all the Interested Buyers for the post
    ibRef = db.collection('interestedBuyers').document(postId)
    ibValues = ibRef.get().get('users')
    ibValues.append(userId)
    # sets the new like values and additional interested buyer
    likeRef.set({'posts':likeValues})
    ibRef.set({'users':ibValues})
    return "Success"


@app.route('/dislikePost/<userId>/<postId>')
def dislikePost(userId, postId):
    """ A given user dislikes a particular postId """
    # retrieve all the posts a user dislikes
    dislikeRef = db.collection('dislikes').document(userId)
    dislikeValues = dislikeRef.get().get('posts')
    # add the post to the dislike value
    dislikeValues.append(postId)
    # update the value
    dislikeRef.set({'posts':dislikeValues})
    return "Success"

# =======================
#  Conversations Section
# =======================

@app.route('/getConvos/<userId>/<isBuyer>')
def getConvos(userId, isBuyer):
    """ Get the conversations for a userId """
    convos = []
    # got to retrieve the relevant convo docs if they're a buyer
    # or seller
    if isBuyer=='True':
        convoDocs = db.collection('convos').where('buyerId','==',userId).get()
        convos = [(doc.id, doc.to_dict()) for doc in convoDocs]
    else:
        convoDocs = db.collection('convos').where('sellerId','==',userId).get()
        convos = [(doc.id, doc.to_dict()) for doc in convoDocs]
    
    results = []
    # go through all the conversations and obtain the relevant
    # convo data
    for convo in convos:
        # the data for each conversation stored in result
        result = {}
        result["convoId"]=convo[0]
        # keeps all the data of the conversation dictionary
        # and adds all the post data
        for key in list(convo[1].keys()):
            if key!="postId":
                result[key] = convo[1][key]
                if key == "buyerId" and isBuyer!='True':
                    # sellers also need to see the name of the person, whom they're
                    # selling to
                    buyerVals = db.collection('users').document(convo[1][key]).get().to_dict()    
                    result["usersName"] = buyerVals["name"]
            else:
                postVals = db.collection('posts').document(convo[1][key]).get().to_dict()
                for postKey in list(postVals.keys()):
                    result[postKey] = postVals[postKey]
                if isBuyer=='True':
                    # the buyer needs to know the location of the seller
                    sellingLoc = db.collection('users').document(postVals["sellerId"]).get().to_dict()["location"]["city"]
                    result["sellingLoc"] = sellingLoc
        results.append(result)

    # Store and return the data as an object 
    results = str({'data':results}).replace('\'','\"')
    return str(results)

# Messages
@app.route('/getMessages/<userId>/<convoId>')
def getMessages(userId, convoId):
    """ Retrieves the messages from a given user and a conversation """
    # get the conversation information
    convoDictionary = db.collection('convos').document(convoId).get().to_dict()
    # make sure the user is a part of the conversation
    if(userId!=convoDictionary["sellerId"] and userId!=convoDictionary["buyerId"]):
        return "User is not part of the conversation."
    # get the messages from a given conversation id
    messageConvoDoc = db.collection('messages').document(convoId).get()
    messages = messageConvoDoc.to_dict()["messages"]
    for i in messages:
        # need to make sure ' isn't sent
        i["msg"] = i["msg"].replace("\'","RUFUSAPOSTROPHE")
    # return the messages as an object
    messages = str({'data':messages}).replace("True","1").replace("False","0").replace('\'','\"')
    return str(messages)


@app.route('/sendMessage/<userId>/<convoId>/<isBuyer>/<msg>')
def sendMessage(userId, convoId, isBuyer, msg):
    """ A given user sends the message to a conversation """
    convoDictionary = db.collection('convos').document(convoId).get().to_dict()
    # assert the user is apart of the conversation
    if(userId!=convoDictionary["sellerId"] and userId!=convoDictionary["buyerId"]):
        return "User is not part of the conversation."
    # get all the messages
    messageConvoDoc = db.collection('messages').document(convoId).get()
    messages = messageConvoDoc.to_dict()["messages"]
    # assert the new data
    msgData = {
        'user': False, 
        'msgId': len(messages),
        'msg':msg.replace("\'","RUFUSAPOSTROPHE")
    }
    # user = isBuyer, changes how the messages are presented 
    # for the ux
    if isBuyer == "True":
        msgData["user"] = True

    messages.append(msgData)
    # set the new messages
    db.collection('messages').document(convoId).set({"messages":messages})

    # return the new message as an object to update the messages on the backend
    return str(msgData).replace("True","1").replace("False","0").replace('\'','\"')

# =======================
#  Interested Buyers
#        Section
# =======================

@app.route('/getInterestedBuyers/<userId>/<postId>')
def getInterestedBuyers(userId, postId):
    """ Retrieves the interested buyers for a post """
    post = db.collection('posts').document(postId).get()
    # assert the userId provided is the seller
    if(post.get('sellerId')!=userId):
        return "User is not poster"
    # get all the interested buyers for a post
    ibs = db.collection('interestedBuyers').document(postId).get().get('users')
    # retrieve the preferences of the seller
    preferences = db.collection('settings').document(userId).get().to_dict()
    sellerVals = db.collection('users').document(userId).get().to_dict()
    sellerLatlng = (sellerVals["location"]["lat"],sellerVals["location"]["lng"])

    result = []
    for ib in ibs:
        tmp = {}
        doc = db.collection('users').document(ib).get().to_dict()
        # get the buyer's location
        buyerLatLng = (doc["location"]["lat"], doc["location"]["lng"])
        # check if the buyer's location is within the radius or the radius is too big to matter
        if preferences["locationRadius"]>=199 or calculateDist(sellerLatlng,buyerLatLng) <= preferences["locationRadius"]:
            tmp["location"] = doc["location"]["city"]
            tmp["userId"] = ib
            result.append(tmp)
    # return interested buyers as an object for react native
    return str(result).replace('\'','\"')

@app.route('/deleteInterestedBuyer/<userId>/<postId>/<buyerId>')
def deleteInterestedBuyer(userId, postId, buyerId):
    """ Deletes an interested buyer from the posts"""
    post = db.collection('posts').document(postId).get()
    ibRef = db.collection('interestedBuyers').document(postId)
    users = set(db.collection('interestedBuyers').document(postId).get().get('users'))
    # asserts the seller is the user provided
    if(post.get('sellerId')!=userId):
        return "User is not poster"
    # remove the buyer from the list
    users.remove(buyerId)
    users = list(users)
    # update the list
    ibRef.set({'users':users})
    return "Succesfully deleted"

@app.route('/confirmInterestedBuyer/<userId>/<postId>/<buyerId>')
def confirmInterestedBuyer(userId, postId, buyerId):
    """ First deletes the interested buyer from the list and moves them 
        to the conversations table, and generates a message object with the same conversation
        id"""
    # delete the interested buyer
    res = deleteInterestedBuyer(userId, postId, buyerId)
    if res == "Succesfully deleted":
        # assuming it was succesfully deleted, create a conversation
        convoData = {"buyerId":buyerId, "sellerId":userId, "postId":postId}
        timeOfSending, docRef = db.collection('convos').add(convoData)
        # create a message entity of the same conversation id
        messagesRef = db.collection('messages').document(docRef.id)
        messageData = {"messages":[]}
        # update the messages database
        messagesRef.set(messageData)
        return "Succesfully created a conversation"
    else:
        return res

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app.
    # app.run(host='your ip',debug=True) for running locally
    ip = ''
    app.run(host=ip, debug=True)