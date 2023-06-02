from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

import urllib.parse
import os





class CleanURLHTTPHandler(SimpleHTTPRequestHandler):
	def __init__(self, *args, directory=None, **kwargs):
		super().__init__(*args, directory, **kwargs)
		self.extensions_map[""] = "text/html"
	
	def translate_path(self, path):
		url = urllib.parse.urlparse(path)
		
		fragment = url.fragment
		queries  = url.query
		params   = url.params
		path     = url.path
		
		if not os.path.exists(path):
			path += ".html"
		return super().translate_path(path+params+queries+fragment)





if __name__ == "__main__":
	with TCPServer(("", 8000), CleanURLHTTPHandler) as httpd:
		print(f"Server started...")