from flask import Flask
from flask import render_template
import pymysql

app = Flask(__name__)

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app.wsgi_app

app.secret_key = "flash message"
app.config['UPLOAD_FOLDER'] = 'app/static/uploads/' 

conn = pymysql.connect(host='den1.mysql2.gear.host', port=3306, user='bancoprojeto2020',
    passwd='Jg5euFT~-q39',db='bancoprojeto2020', charset="utf8")
    
@app.route("/")
def default():
    return render_template('default.html')

from app.empresa import empresa as empresa_blueprint
app.register_blueprint(empresa_blueprint)

from app.tipo import tipo as tipo_blueprint
app.register_blueprint(tipo_blueprint)

from app.caracteristica import caracteristica as caracteristica_blueprint
app.register_blueprint(caracteristica_blueprint)

from app.tipo_contagem import tipoc as tipoc_blueprint
app.register_blueprint(tipoc_blueprint)

from app.funcao import funcao as funcao_blueprint
app.register_blueprint(funcao_blueprint)

from app.linguagem import linguagem as linguagem_blueprint
app.register_blueprint(linguagem_blueprint)

from app.fator_ajuste import fatorA as fatorA_blueprint
app.register_blueprint(fatorA_blueprint)

from app.contagem_tela import contagemT as contagemT_blueprint
app.register_blueprint(contagemT_blueprint)

from app.contagem_modelo import contagemM as contagemM_blueprint
app.register_blueprint(contagemM_blueprint)

from app.contagem_script import contagemS as contagemS_blueprint
app.register_blueprint(contagemS_blueprint)

from app.projeto import projeto as projeto_blueprint
app.register_blueprint(projeto_blueprint)

from app.estimativa import estimativa as estimativa_blueprint
app.register_blueprint(estimativa_blueprint)

from app.login import login as login_blueprint
app.register_blueprint(login_blueprint)
  
