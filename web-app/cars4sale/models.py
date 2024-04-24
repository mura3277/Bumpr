from cars4sale import db, login_manager, util
from datetime import datetime
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Table with all possible vehichle variations (used for advert creation)
class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)                # Audi A6 C6 Avant 3.0 TDI quattro 171kW Diesel Tiptronic
    brand = db.Column(db.String(32), nullable=False)            # Audi
    model = db.Column(db.String(32), nullable=False)            # A6
    generation = db.Column(db.String(256), nullable=False)      # C6 Avant (Nov.2004 - Aug.2011)
    variant = db.Column(db.String(256), nullable=False)         # 3.0 TDI quattro 171kW Diesel Tiptronic
    volume = db.Column(db.Float, nullable=False)                # 3.0
    power = db.Column(db.Integer, nullable=False)               # 171
    fuel = db.Column(db.String(16), nullable=False)             # Diesel (Diesel, Gasoline, Hybrid, Other)
    drive = db.Column(db.String(16), nullable=False)             # AWD (FWD/RWD/AWD)
    transmission = db.Column(db.String(16), nullable=False)     # Automatic (Automatic/Manual)
    body = db.Column(db.String(16), nullable=False)             # Estate (Estate/Hatchback/SUV/Sedan/Coupe/Convertible/Pickup/Minivan/Van/Truck)
    role = db.Column(db.String(16), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"{self.brand} {self.model} {self.generation} {self.variant}"

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    image = db.Column(db.Text, nullable=False, default="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")
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', backref='author', lazy='dynamic')
    messages_received = db.relationship('Message', foreign_keys='Message.recipient_id', backref='recipient', lazy='dynamic')
    membership = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Advert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    vehicle = db.relationship('Vehicle')
    type = db.Column(db.String(32), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    mileage = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author = db.relationship('User', backref='adverts')
    main_image = db.Column(db.Text(10000000), nullable=True)
    images = db.Column(db.Text(10000000), nullable=True)

class Brand(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    models = db.relationship("Model", backref="brand", lazy=True)

    def __repr__(self):
        return self.name

class Model(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey("brand.id"), nullable=False)

    def __repr__(self):
        return self.name

class Fuel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    def __repr__(self):
        return self.name

class Transmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    def __repr__(self):
        return self.name

class CarRole(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    def __repr__(self):
        return self.name

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    subject = db.Column(db.String(140))
    body = db.Column(db.String(140))
    read = db.Column(db.Boolean, default=False, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

class Membership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    cost = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return self.name