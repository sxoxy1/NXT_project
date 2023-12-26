import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import bot_engine.process as process
class react:
    def __init__(self,summary,llm,memory,retriever,qa):
        self.llm = llm
        self.memory = memory
        self.summary = summary
        self.retriever = retriever
        self.qa = qa
    def message_giver(self,message):
        self.message = message.lower()
    def dev_message(self,m):
        self.daemon = process.process()
        check = self.daemon.extra_point(m)
        return check