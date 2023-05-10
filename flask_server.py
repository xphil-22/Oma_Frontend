from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


pin_status = -1

@app.route('/read_pins', methods=['GET'])
@cross_origin()
def get_pin_state():
    # Execute the script and get the pin state
    # read pins, if pins change set the pin to -1 for yesterday and +1 for tomorrow.
    # if a request was done, the pin can be set to 0 again.
    global pin_status
    data = pin_status
    pin_status = 0
    return {"pin_status": data}


def read_pins():
    """
    set the pin_status due to the input of the pins here with the gpio.gpio library
    """
    pass


if __name__ == '__main__':
    app.run()