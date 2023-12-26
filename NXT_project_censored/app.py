import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from chat import react
from flask import *
#여기서 실행하심 돼요. F5
if __name__ == "__main__":
    main_container = Flask(__name__)
    bot_res = react.react("","","","","")
    @main_container.route("/", methods=["POST","GET"])
    def index():
        return render_template("chat.html")
    @main_container.route("/get_bot_response", methods=['POST'])
    def get_bot_response():
        select = request.form["select"]
        m = request.form["message"]
        response = bot_res.dev_message(m)
        buttons = []
        stat = 10
        return jsonify({"bot_response":response,"button":buttons,"status":stat,"select":"직접 대화"})
    main_container.run(host="0.0.0.0",debug=True,threaded=True) 