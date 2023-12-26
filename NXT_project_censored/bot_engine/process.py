import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

class process:
    def __init__(self):
        self.qa = ""
    def extra_point(self,message):
        return message+"에 대한 반응"