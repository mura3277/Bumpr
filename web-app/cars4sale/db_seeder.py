import json

from cars4sale.models import *
from cars4sale import bcrypt

seed_car_data_set = 1

membership_basic = None
membership_standard = None
membership_premium = None

# adds some initial data to the database
def seed():
    membership_basic = add_membership("Basic", 10)
    membership_standard = add_membership("Standard", 20)
    membership_premium = add_membership("Premium", 30)

    role_commuter = add_car_role("Commuter")
    role_road_trip = add_car_role("Road Trips")
    role_weekend_driving = add_car_role("Weekend Driving")

    if seed_car_data_set == 1:
        with open("car_data_small.json") as input:
            data = json.load(input)
            for i in range(len(data)):
                fuelType = "Petrol"
                if data[i]["fuelType"] == "Diesel":
                    fuelType = "Diesel"

                trans = "Automatic"
                if "Manual" in data[i]["trans"]:
                    trans = "Manual"

                add_vehicle(data[i]["make"], data[i]["model"], "None", data[i]["displ"], 0, fuelType, data[i]["drive"], trans, data[i]["VClass"], role_commuter, 5, "")

    user1 = add_user("testusername_1", "example_1@host.com", "123")
    user2 = add_user("testusername_2", "example_2@host.com", "1q2w3e4r")

    vehicle = add_vehicle("Audi", "A6", "3.0 TDI quattro 171kW Diesel Tiptronic", 3.0, 171, "Diesel", "AWD", "Automatic", "Estate", role_commuter, 5, "static/audia6.png")
    add_advert(vehicle, 4500, 190000, 2019, user1, "Some long description about old car, which is in perfect condition, without any accidents, full service history, no rust, with winter/summer tires, full of extras etc. sold cheaply in some other universe called paradise")

    vehicle = add_vehicle("Mercesdes-Benz", "S-Class", "S63 AMG 5.5 430kW Gasoline", 5.5, 430, "Petrol", "FWD", "Automatic", "Sedan", role_weekend_driving, 5, "")
    add_advert(vehicle, 6400, 90000, 2014, user2, "Some long description about old car, which is in perfect condition, without any accidents, full service history, no rust, with winter/summer tires, full of extras etc. sold cheaply in some other universe called paradise")

    vehicle = add_vehicle("Audi", "Q7", "4.2 FSI quattro 257kW Gasoline", 4.2, 257, "Petrol", "AWD", "Automatic", "SUV", role_road_trip, 5, "")
    add_advert(vehicle, 9000, 140000, 2017, user2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at libero vestibulum enim aliquet fermentum vulputate ac arcu. Etiam tempor lacus vitae justo malesuada placerat. Aliquam at ex est. Donec maximus sodales condimentum")

    vehicle = add_vehicle("Mercesdes-Benz", "5667", "4.2 FSI quattro 257kW Gasoline", 4.2, 257, "Diesel", "AWD", "Automatic", "SUV", role_commuter, 5, "")
    add_advert(vehicle, 9000, 140000, 2017, user2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at libero vestibulum enim aliquet fermentum vulputate ac arcu. Etiam tempor lacus vitae justo malesuada placerat. Aliquam at ex est. Donec maximus sodales condimentum")

def add_user(username, email, password):
    user = User(username=username, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    db.session.add(user)
    db.session.commit()
    return user

def add_advert(vehicle, price, miles, year, user, desc):
    advert = Advert(vehicle_id=vehicle.id, description=desc, price=price, mileage=miles, year=year, user_id=user.id, type="All Out", main_image=util.no_image_base64)
    db.session.add(advert)
    db.session.commit()
    return advert

def add_car_role(name):
    role = CarRole(name=name)
    db.session.add(role)
    db.session.commit()
    return role

def add_vehicle(brand, model, variant, volume, power, fuel, drive, transmission, body, role, seats, image):
    brandObj = db.session.query(Brand).filter_by(name=brand).first()
    if brandObj == None:
        brandObj = Brand(name=brand)
        db.session.add(brandObj)

    modelObj = db.session.query(Model).filter_by(name=model).first()
    if modelObj == None:
        modelObj = Model(name=model, brand_id=brandObj.id)
        db.session.add(modelObj)

    brandObj.models.append(modelObj)

    fuelObj = db.session.query(Fuel).filter_by(name=fuel).first()
    if fuelObj == None:
        fuelObj = Fuel(name=fuel)
        db.session.add(fuelObj)

    transObj = db.session.query(Transmission).filter_by(name=transmission).first()
    if transObj == None:
        transObj = Transmission(name=transmission)
        db.session.add(transObj)

    vehicle = Vehicle(brand=brand, model=model, variant=variant, generation="", volume=volume, power=power, fuel=fuel, drive=drive, transmission=transmission, body=body, role=role.name, seats=seats, image=image)
    db.session.add(vehicle)
    db.session.commit()

    return vehicle

def add_membership(name, cost):
    membershipObj = db.session.query(Membership).filter_by(name=name).first()
    if membershipObj == None:
        membershipObj = Membership(name=name, cost=cost)
        db.session.add(membershipObj)
        db.session.commit()
    return membershipObj