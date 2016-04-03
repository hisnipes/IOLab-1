from flask.ext.wtf import Form
from wtforms import StringField, IntegerField
from flask_wtf.html5 import EmailField
from wtforms.validators import DataRequired

class CustomerForm(Form):
	first_name = StringField('first_name', validators=[DataRequired()])
	last_name = StringField('last_name', validators=[DataRequired()])
	company = StringField('company', validators=[DataRequired()])
	email = EmailField('email', validators=[DataRequired()])
	phone = StringField('phone', validators=[DataRequired()])

class AddressForm(Form):
	street_address = StringField('street_address', validators=[DataRequired()])
	city = StringField('city', validators=[DataRequired()])
	state = StringField('state', validators=[DataRequired()])
	country = StringField('country', validators=[DataRequired()])
	zip_code = StringField('zip_code', validators=[DataRequired()])

class OrderForm(Form):
	total_spent = IntegerField('total_spent', validators=[DataRequired()])
	num_parts_ordered = IntegerField('num_parts_ordered', validators=[DataRequired()])