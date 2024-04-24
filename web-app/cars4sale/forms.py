from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from flask_login import current_user
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextAreaField, FloatField, IntegerField, \
    SelectField, MultipleFileField
from wtforms_sqlalchemy.fields import QuerySelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, NumberRange
from cars4sale.models import User, Brand, Fuel, Transmission, CarRole, Membership
from cars4sale.util import gen_car_years, NonValidatingSelectField


class RegistrationForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is taken. Please choose a different one.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is taken. Please choose a different one.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class AdvertForm(FlaskForm):
    type = SelectField("Type", choices=["Dip A Toe", "Better Safe Than Sorry", "All Out"])
    brand = QuerySelectField("Brand", query_factory=lambda: Brand.query)
    model = NonValidatingSelectField("Model")
    year = SelectField("Year", choices=gen_car_years(53))
    description = TextAreaField('Description', validators=[DataRequired()])
    price = FloatField('Price', validators=[NumberRange(1)])
    mileage = IntegerField('Mileage', validators=[NumberRange(1)])
    images = MultipleFileField("Images", validators=[FileAllowed(["jpg", "png"])])
    submit = SubmitField('Post')

class SearchFormAdv(FlaskForm):
    brand = QuerySelectField("Brand", query_factory=lambda: Brand.query)
    model = NonValidatingSelectField("Model")
    year_from = SelectField("Year From", choices=gen_car_years(53))
    year_to = SelectField("Year To", choices=gen_car_years(53))
    fuel = QuerySelectField("Fuel", query_factory=lambda: Fuel.query)
    transmission = QuerySelectField("Transmission", query_factory=lambda: Transmission.query)
    submit = SubmitField("Search")

class SearchFormSimple(FlaskForm):
    role = QuerySelectField("Role", query_factory=lambda: CarRole.query)
    seats = SelectField("Seats", choices=["Just Me", "2", "4", "6", "More"])
    age = SelectField("Age", choices=["New (1-2 yrs)", "Not Too Old (2-5 yrs)", "Older (5-10 yrs)", "Even Older (10-20 yrs)"])
    transmission = QuerySelectField("Gearbox", query_factory=lambda: Transmission.query)
    #TODO next semester implement a range slider client side, as this cannot be done with flask
    #budget = IntegerRangeField("Budget", validators=[NumberRange(min=1, max=1000000)])
    budget = IntegerField("Budget", validators=[DataRequired()])
    submit = SubmitField("Search")

class UpdateAccountForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    picture = FileField('Update Profile Picture', validators=[FileAllowed(['jpg', 'png'])])
    submit = SubmitField('Update')

    def validate_username(self, username):
        if username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError('That username is taken. Please choose a different one.')

    def validate_email(self, email):
        if email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError('That email is taken. Please choose a different one.')

class SendMessageForm(FlaskForm):
    subject = StringField("Subject", validators=[DataRequired(), Length(min=0, max=140)])
    body = TextAreaField('Message', validators=[DataRequired(), Length(min=0, max=140)])
    submit = SubmitField('Submit')

class MembershipForm(FlaskForm):
    type = SelectField("Type", choices=["Basic", "Standard", "Premium"])
    card_number = IntegerField("Card Number", validators=[DataRequired()])
    mm_yy = StringField("MM/YY", validators=[DataRequired()])
    cvc = IntegerField("CVC", validators=[DataRequired()])
    submit = SubmitField("Purchase")