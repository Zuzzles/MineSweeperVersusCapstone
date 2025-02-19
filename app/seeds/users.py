from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo 1', email='demo1@aa.io', wins=0, losses=0, password='password')
    demo_2 = User(
        username='Demo 2', email='demo2@aa.io', wins=0, losses=0, password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', wins=0, losses=0, password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', wins=0, losses=0, password='password')
    Smeagol = User(
        username='Smeagol', email='smeg@aa.io', wins=0, losses=0, password='password')
    hoblin = User(
        username='hoblin', email='hob@aa.io', wins=0, losses=0, password='password')

    db.session.add(demo)
    db.session.add(demo_2)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(Smeagol)
    db.session.add(hoblin)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
