import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

use_local_db = 0

#Instantiate flask app object
app = Flask(__name__)
#Secret app key (shh)
app.config['SECRET_KEY'] = sys.argv[1]
#Specificing a local filesystem database

if use_local_db == 1:
    #use local db file
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///site.db"
else:
    #use local mysql server
    #this expects a username of root, no password and a database with the name of "flask"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/flask'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

#Import all the defined routes
from cars4sale import routes
