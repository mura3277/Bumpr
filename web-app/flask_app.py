from cars4sale import app, db
from cars4sale.db_seeder import seed

if __name__ == "__main__":
    db.drop_all()
    db.create_all()
    seed()
    app.run(debug=True)