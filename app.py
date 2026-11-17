from flask import Flask , render_template

app=Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/anasayfa')
def anasayfa():
    return render_template('anasayfa.html')

@app.route('/kutuphanem')
def kutuphanem():
    return render_template('kutuphanem.html')

@app.route('/profil')
def profil():
    return render_template('profil.html')

@app.route('/sonra-okuyacaklarim')
def sonra_okuyacaklarim():
    return render_template('sonra-okuyacaklarim.html')

if __name__=='__main__':
    app.run(debug=True)

