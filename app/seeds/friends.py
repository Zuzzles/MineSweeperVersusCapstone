from app.models import db, Friend, environment, SCHEMA
from sqlalchemy.sql import text


# Adds demo friends, you can add other friends here if you want
def seed_friends():
    demo_friends = [
      Friend(user_id=1, friend_id=3, accepted=True),
      Friend(user_id=3, friend_id=1, accepted=True),
      Friend(user_id=1, friend_id=4, accepted=False),
      Friend(user_id=2, friend_id=1, accepted=False)
    ]

    db.session.add_all(demo_friends)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the friends table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))
        
    db.session.commit()