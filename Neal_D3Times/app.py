import os

import pandas as pd
import numpy as np



from flask import Flask, jsonify, render_template

app = Flask(__name__)


#################################################
# Database Setup
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/data")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    df = pd.read_csv("data/data.csv")
    result = df.to_dict(orient='records')

    # Return a list of the column names (sample names)
    return jsonify(result)




if __name__ == "__main__":
    app.run(debug=True)
