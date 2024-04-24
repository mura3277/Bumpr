import flask
from cars4sale import app, db, bcrypt, util
from flask import render_template, url_for, flash, redirect, request, abort, jsonify

from cars4sale.forms import RegistrationForm, LoginForm, AdvertForm, SearchFormAdv, SearchFormSimple, UpdateAccountForm, \
    SendMessageForm, MembershipForm
from cars4sale.models import Vehicle, User, Advert, Brand, Message, Membership, Model
from flask_login import login_user, current_user, logout_user, login_required
from datetime import datetime
from cars4sale.ml_interface import predict

#TODO next semester
#feedback on price compared to other adverts in the system, and if the miles are average etc
#the entire front end

@app.route("/")
@app.route("/home")
def home():
    return render_template("home.jinja")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.jinja', title='Login', form=form)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.jinja', title='Register', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route("/all")
def all_adverts():
    return render_template("results.jinja", title="Search Results", results=Advert.query.all())

@login_required
@app.route("/my_adverts")
def my_adverts():
    return render_template("results.jinja", title="Search Results", results=current_user.adverts)

@app.route("/new_advert", methods=['GET', 'POST'])
@login_required
def new_advert():
    form = AdvertForm()
    if form.validate_on_submit():
        current_adverts = len(current_user.adverts)
        max_adverts = util.get_max_adverts_for_member(current_user.membership)
        if current_adverts >= max_adverts:
            flash(f"You have reached your limit of {max_adverts} live advert(s)!", 'danger')
            return redirect(url_for('new_advert'))

        vehicle = Vehicle.query.filter_by(brand=str(form.brand.data), model=str(form.model.data)).first()
        if vehicle == None:
            flash("Brand or model not found!", 'danger')
            return redirect(url_for('new_advert'))

        images = flask.request.files.getlist("images")

        if len(images) == 1 and not images[0].filename:
            flash("An advert must have at least one image!", "danger")
            return redirect(url_for('new_advert'))

        main_image = util.to_img64(images[0], 300)
        image_string = util.build_image_string(flask.request.files.getlist("images"))
        if len(images) > 9:
            flash("An advert can only have a max of 9 images!", "danger")
            return redirect(url_for('new_advert'))

        for img in images:
            if img.filename == "":
                continue
            result, err = predict([img])

            if not result:
                flash(err, 'danger')
                return redirect(url_for('new_advert'))
        
        advert = Advert(
            vehicle=vehicle,
            price=form.price.data,
            mileage=form.mileage.data,
            type=form.type.data,
            description=form.description.data,
            year=form.year.data,
            date_posted=datetime.now(),
            author=current_user,
            main_image=main_image,
            images=image_string
        )
        db.session.add(advert)
        db.session.commit()
        flash('Your advert has been created! cost added to bill', 'success')
        return redirect(url_for('home'))
    return render_template('create_advert.jinja', title='New Advert',
                           form=form, legend='New advert')

@app.route("/advert/<int:advert_id>")
def advert(advert_id):
    advert = Advert.query.get_or_404(advert_id)
    images = []
    if advert.images == None:
        images.append(util.no_image_base64)
    else:
        images = advert.images.split("@")
    return render_template('advert.jinja', title=advert, advert=advert, images=images)

@app.route("/update_advert/<int:advert_id>", methods=['GET', 'POST'])
@login_required
def update_advert(advert_id):
    advert = Advert.query.get_or_404(advert_id)
    if advert.author != current_user:
        abort(403)
    form = AdvertForm()
    if form.validate_on_submit():
        images = flask.request.files.getlist("images")

        if len(images) == 1 and not images[0].filename:
            flash("An advert must have at least one image!", "danger")
            return redirect(url_for('update_advert', advert_id=advert_id))

        main_image = util.to_img64(images[0], 300)
        if len(images) > 9:
            flash("An advert can only have a max of 9 images!", "danger")
            return redirect(url_for('update_advert', advert_id=advert_id))

        for img in images:
            result, err = predict([img])

            if not result:
                flash(err, 'danger')
                return redirect(url_for('update_advert', advert_id=advert_id))

        vehicle = Vehicle.query.filter_by(brand=str(form.brand.data), model=str(form.model.data)).first()
        if vehicle == None:
            flash("Brand or model not found!", 'danger')
            return redirect(url_for('update_advert', advert_id=advert_id))

        advert.vehicle = vehicle
        advert.price = form.price.data
        advert.mileage = form.mileage.data
        advert.description = form.description.data
        advert.year = form.year.data
        advert.main_image = main_image
        advert.images = util.build_image_string(flask.request.files.getlist("images"))
        db.session.commit()
        flash('Your advert has been updated!', 'success')
        return redirect(url_for('advert', advert_id=advert.id))
    elif request.method == 'GET':
        brand = Brand.query.filter_by(name=advert.vehicle.brand).first()
        #model = Model.query.filter_by(name=advert.vehicle.model).first()
        form.brand.data = brand
        # form.model.data = model
        form.type.data = advert.type
        form.year.data = advert.year
        form.description.data = advert.description
        form.price.data = advert.price
        form.mileage.data = advert.mileage
    return render_template('create_advert.jinja', title='Update advert',
                           form=form, legend='Update advert')

@app.route("/advert/<int:advert_id>/delete", methods=['GET','POST'])
@login_required
def delete_advert(advert_id):
    advert = Advert.query.get_or_404(advert_id)
    if advert.author != current_user:
        abort(403)
    db.session.delete(advert)
    db.session.commit()
    flash('Your advert has been deleted!', 'success')
    return redirect(url_for('home'))

@app.route("/search/adv", methods=['GET', 'POST'])
def search_adv():
    form = SearchFormAdv()
    if form.validate_on_submit():
        results = db.session.query(Advert).join(Advert.vehicle).filter(
            Vehicle.brand==str(form.brand.data),
            Vehicle.model==str(form.model.data),
            Advert.year >= form.year_from.data,
            Advert.year <= form.year_to.data,
            Vehicle.fuel==str(form.fuel.data),
            Vehicle.transmission == str(form.transmission.data)
        ).all()
        if len(results) == 0:
            flash('No results for this search!', 'danger')
            return render_template("search_adv.jinja", title="No Results", form=form)
        return render_template("results.jinja", title="Search Results", results=results)
    return render_template("search_adv.jinja", title="Search Engine", form=form)

@app.route("/search/simple", methods=['GET', 'POST'])
def search_simple():
    form = SearchFormSimple()
    if form.validate_on_submit():
        results = db.session.query(Advert).join(Advert.vehicle).filter(
            Vehicle.role == str(form.role.data),
            Vehicle.transmission == str(form.transmission.data),
            Vehicle.seats >= util.get_seats_integer(form.seats.data),
            Advert.price <= int(form.budget.data),
            Advert.year >= util.get_lowest_age_allowed(form.age.data)
        ).all()
        if len(results) == 0:
            flash('No results for this search!', 'danger')
            return render_template("search_simple.jinja", title="Search Results", form=form)
        return render_template("results.jinja", title="Search Results", results=results)
    return render_template("search_simple.jinja", title="Search Engine", form=form)

@app.route("/api/models/<brand_id>")
def models(brand_id):
    brand = Brand.query.get_or_404(brand_id)
    models = []
    for m in brand.models:
        models.append(m.name)

    return jsonify(models)

@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    form = UpdateAccountForm()
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.email = form.email.data
        if form.picture.data != None:
            current_user.image = util.to_img64(form.picture.data, 200)
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('profile'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    return render_template('profile.jinja', form=form, user=current_user, title=f"{current_user.username}'s Profile")

@app.route("/user/<int:id>")
@login_required
def view_user(id):
    if current_user.id == id:
        return redirect(url_for('profile'))
    user = User.query.get_or_404(id)
    return render_template('user.jinja', user=user, title=f"{current_user.username}'s Profile")

@app.route("/send_message/<int:recipient>/<subject>", methods=['GET', 'POST'])
@login_required
def send_message(recipient, subject):
    user = User.query.get_or_404(recipient)
    form = SendMessageForm()
    form.subject.data = subject
    if form.validate_on_submit():
        msg = Message(author=current_user, recipient=user, body=form.body.data, subject=form.subject.data)
        db.session.add(msg)
        db.session.commit()
        flash('Your message has been sent!', 'success')
        return redirect(url_for("view_user", id=recipient))
    return render_template('send_message.jinja', title="Send Message", form=form, recipient=user)

@app.route("/messages")
@login_required
def messages():
    messages = current_user.messages_received.order_by(Message.timestamp.desc())
    if messages.count() == 0:
        flash("No messages!", 'info')
    return render_template("messages.jinja", messages=messages)

@app.route("/membership", methods=['GET', 'POST'])
@login_required
def membership():
    form = MembershipForm()
    form.card_number.data = "1234123412341234"
    form.mm_yy.data = "01/23"
    form.cvc.data = "123"
    if form.validate_on_submit():
        if current_user.membership == form.type.data:
            flash('You already have this tier!', 'danger')
            return redirect(url_for("membership"))
        if util.get_member_value(current_user.membership) > util.get_member_value(form.type.data):
            flash("You already have a higher tier membership!", "danger")
            return redirect(url_for("membership"))
        current_user.membership = form.type.data
        db.session.commit()
        flash('Membership Purchased!', 'success')
        return redirect(url_for('profile'))
    return render_template("membership.jinja", title="Membership", user=current_user, form=form)