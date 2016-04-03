from app import db

order_customer = db.Table('order_customer',
	db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
	db.Column('customer_id', db.Integer, db.ForeignKey('customer.id'))
)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    company = db.Column(db.String(120), unique=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String)
    addresses = db.relationship('Address', backref='customer')
    orders = db.relationship('Order', secondary=order_customer, backref='customers')
    # You need to a relationship to Address table here
    # see http://flask-sqlalchemy.pocoo.org/2.1/models/#one-to-many-relationships

# Your Address code should go here
# class Address(db.Model):
class Address(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	street_address = db.Column(db.String, unique=False)
	city = db.Column(db.String(120))
	state = db.Column(db.String(120))
	country = db.Column(db.String(120))
	zip_code = db.Column(db.Integer)
	customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))

	def __repr__(self):
		return '<Address (%r, %r, %r, %r, %r)>' % (self.street_address, self.city, self.state, self.country, self.zip_code)

class Order(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	total_spent = db.Column(db.Integer)
	num_parts_ordered = db.Column(db.Integer)

	def __repr__(self):
		return '<Order (%r, %r, %r)>' % (self.id, self.total_spent, self.num_parts_ordered)
