from flask import render_template, redirect, request
from app import app, models, db
from .forms import CustomerForm, AddressForm, OrderForm


@app.route('/')
def index():
    return redirect('/create_customer')


@app.route('/create_customer', methods=['GET', 'POST'])
def create_customer():
    form = CustomerForm()
    if form.validate_on_submit():
        customer = models.Customer(
                        first_name = form.first_name.data,
                        last_name = form.last_name.data,
                        company = form.company.data,
                        email = form.email.data,
                        phone = form.phone.data)
        db.session.add(customer)
        db.session.commit()
        return redirect('/customers')
    return render_template('customer.html', form=form)


@app.route('/create_address', methods=['GET', 'POST'])
@app.route('/create_address/<customer_id>', methods=['GET', 'POST'])
def add_address(customer_id=None):
    form = AddressForm()
    customer = models.Customer.query.filter_by(id = customer_id).first()
    first_name = customer.first_name
    last_name = customer.last_name
    if form.validate_on_submit():
        address = models.Address(
                        street_address = form.street_address.data,
                        city = form.city.data,
                        state = form.state.data,
                        country = form.country.data,
                        zip_code = form.zip_code.data,
                        customer_id = customer_id)
        db.session.add(address)
        db.session.commit()
        return redirect('/customer_info/' + str(customer.id))
    return render_template('address.html', form=form, first_name=first_name, last_name=last_name)


@app.route('/create_order/<customer_id>', methods=['GET', 'POST'])
def create_order(customer_id=None):
    form = OrderForm()
    customer = models.Customer.query.filter_by(id = customer_id).first()
    first_name = customer.first_name
    last_name = customer.last_name
    if form.validate_on_submit():
        order = models.Order(
                        total_spent = form.total_spent.data,
                        num_parts_ordered = form.num_parts_ordered.data)
        order.customers.append(customer)
        db.session.add(order)
        db.session.commit()
        return redirect('/customer_info/' + str(customer.id))
    return render_template('order.html', form=form, first_name=first_name, last_name=last_name)


@app.route('/customers')
def display_customer():
    customers = models.Customer.query.all()
    orders = models.Order.query.all()
    return render_template('home.html',customers=customers, orders=orders)


@app.route('/customer_info/<customer_id>')
def display_customer_info(customer_id):
    customer = models.Customer.query.filter_by(id = customer_id).first()
    orders = models.Order.query.filter(models.Order.customers.any(id = customer_id)).all()
    # orders = models.Order.query.filter(models.Customer.orders.any(id = customer_id)).all()
    return render_template('customer_info.html', customer=customer, orders=orders)
