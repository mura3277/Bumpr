# Cars4Sale/Bumpr
This directory contains the code for the mobile adaptation of our product Cars4Sale: Bumpr, which is a used-car version of tinder.

## FrontEnd
The FrontEnd is written in React Native. The main advantage for using React Native is to have a cross-platform application that uses the same code, and more of our team members knew JavaScript over a combination of Java & Swift.

### Requirements
There are two preliminary requirements for the FrontEnd. First and foremost, you will need to install the node package manager (npm). Once you have done that, you need to install:
* React Native
* Expo Cli

To have the required libraries for this application, in the app directory run npm install and npm install -g expo-cli.

### Building, Testing, and Running the application
A pre-requisite to building the application is to include the IP address of the backend in the baseUrl variable in App.js and the config variable in the src/firebase subdirectory must be filled out correctly. Then, one can build the application by running expo start, which will compile the code. Then to test the application, one can run it inside the browser and make adjustmensts to the code live. And to fully run the application, with a full mobile experience, one can install the expo app on their phone and scan the QR code presented by the terminal after running expo start.
In addition to building the FrontEnd locally, the application can be built into an IPA or APK for ios/android respectively through the command line using expo build:platform. Once the packages are built, they can be downloaded directly to phones or even published righ to the apple store/google play store!

### Mobile Wiring
Before writing-up the mobile application, I created a UML diagram to illustrate the relations between different screens/states of the application. That way when developing I had a reference for the functionality of the app. The following are the Buyer and Seller's respective UML diagrams.

The Flow of the app for the Buyer:
![image of the buyer's flow](imgs/BuyerFrontEndWiring.png?raw=true)

The Flow of the app for the Seller:  
![image of seller's flow](imgs/SellerFrontEndWiring.png?raw=true)

### Todo
* Implement Dark Mode
* Tidy/Make more minimalistic
* Retrieve the User's Lat Lng through javascript when registering an account
* Implement Unit & Integration Tests

## BackEnd
The BackEnd for Bumpr is in Python and communicates with the FrontEnd through Flask endpoints, with the database stored in Google Cloud's Firebase through their library, and utilises machine learning through open-cv.

### Requirements
The BackEnd was written in Python, developed in 3.6.9, with the following modules and their respective versions (as found in the requirements.txt file in the directory):
* opencv_python==4.5.4.60
* firebase_admin==4.5.1
* Flask==1.1.2
* numpy==1.18.4
* Pillow==9.1.0
* protobuf==3.20.1
all of which can abe installed through pip.

### Endpoints
The most important part of the backend are its various endpoints, which are detailed by section here:

**_Automation_**
|          Endpoints          |                                                                Input                                                                |                                                                 Description                                                                 |
|:---------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
| addUsers                    | numberOfUsers, the number of Users that you'd like to add                                                                           | Will automatically add users to the users database                                                                                          |
| addPosts                    | numberOfPosts, the number of Posts to add                                                                                           | Automatically will populate the database with dummy data given a number of posts.                                                           |
| autoLikePosts               | numberOfUsers, the number of users that will be liking posts; numberOfLikes, the number of posts each users should like             | This will automatically populate the relative tables involved with liking, given a number of users to use and  the number of likes to like. |
| autoConfirmInterestedBuyers | numberOfConvos, the number of  conversations to start                                                                               | This will automatically and randomly confirm conversations between buyers and sellers.                                                      |
| autoGenerateMessages        | numberOfConvos, the number of conversations for which to generate messages; maxMessages, the maximum  number of messages to generate| This will automatically add to numberOfConvos dialogues generating between 1 and maxMessages number of messages between the users.          |

**_Settings_**
|          Endpoints          |        Input        |           Description            |
|:---------------------------:|:-------------------:|:--------------------------------:|
| getSettings                 | userId of the user  | Retrieves the user’s preferences |
| addPosts                    | userId of the user  | Updates the user’s preferences   |

**_Posts_**
|    Endpoints   |                          Input                          |                                                         Description                                                        |
|:--------------:|:-------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------:|
| editPost       | userId of the seller; postId of the post                | Edits and updates the entry in the database.                                                                               |
| deletePost     | userId of the seller; postId of the post                | Deletes the entry from the  database - from the posts, from the conversations, etc.                                        |
| getBuyerPosts  | userId of the buyer                                     | Retrieves and recommends posts for the buyer based upon their selected preferences and a  custom machine learning model.   |
| getSellerPosts | userId of the Seller                                    | Retrieves all the posts of the Buyer                                                                                       |
| likePost       | userId of the buyer;  postId of the post                | Registers the buyer as an  interested buyer for this post and registers that the buyer likes this post in the likes table. |
| dislikePost    | userId of the buyer;   postId of the post               | Registers that the buyer dislikes this post in the dislikes table.                                                         |
| verifyImage    | imgPath, the path to the image location in  firestorage | When a seller posts a picture, before it is attached to a post it is verified that the image has a car in it.              |

**_Conversations_**
|        Endpoints        |                                                            Input                                                            |                                                           Description                                                          |
|:-----------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------:|
| getConvos               | userId of the seller;  isBuyer - if the user  is a buyer or not                                                             | Retrieves a list of conversations (postData and conversationIds).                                                              |
| getMessages             | userId of the seller;  convoId, id of the  convesation                                                                      | Retrieves all the current  messages from the database                                                                          |
| sendMessage             | userId of the buyer;  convoId, id of the  conversation;  isBuyer, if the use is a buyer;  message, message to be  sent      | Appends a message to the  conversation message list                                                                            |
| getInterestedBuyers     | userId of the Seller;  postId of the post                                                                                   | Returns a list of people that  have liked the post to the seller                                                               |
| confirmInterestedBuyers | userId of the buyer;  postId of the post the  user likes;  buyerId of the person that likes the post and has been confirmed | Removes the buyerId from the liked post interestedBuyers list and adds both of them with the postId to the conversation table. |
| deleteInterestedBuyer   | userId of the buyer;   buyerId, userId of the person that  liked the post and will be removed                               | Removes the userId of the interested buyer from the liked post                                                                 |

### Building, Testing, and Running the application
To build the application locally, one has to run the app.py file with their IP address supplanted in the code and either a Google API & Firebase google-services JSON file or the equivalent credentials stored and accessed in the OS environment variables. If using the .JSON file, it will also be required to run export GOOGLE_APPLICATION_CREDENTIALS="google-services.json" to download images from the Storage for verification. Testing the backend can then be done within the browser accessing the different endpoints and asserting the output is correct, like expo it allows for dynamic updates whilst running (provided no syntatical errors). 


### Database Schema
Here is the Database schema for the BackEnd:
![image of database schema](imgs/db.png?raw=true)

### Todo
* Run the automation to create more posts, users, etc (may require either funding or a different host for the database)
* Generate or simulate more realistic user traffic to then utilise the likes and post data as output/input respectively for a machine learning model to predict underlying preferences of a buyer to show them targeted posts
* Create a comprehensive set of unit and integration tests

## Team Members
Rufus Behr, Hayden Killoh, Chris Koppel, Lisa Mentzer, Agata Nowak, Malwina Powala, & Deniss Vasilenko
