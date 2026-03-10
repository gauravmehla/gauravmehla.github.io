#!/usr/bin/env python3
"""
SPA dev server — serves index.html for any unknown route.
Mimics GitHub Pages' 404.html redirect behavior locally.

Usage: python3 serve.py [port]
"""

import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Try to serve the file normally
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            return super().do_GET()

        # For directory index files
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.isfile(index):
                return super().do_GET()

        # For any other path, serve index.html (SPA fallback)
        self.path = '/index.html'
        return super().do_GET()


if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), SPAHandler) as httpd:
        print(f'SPA dev server running at http://localhost:{PORT}')
        print(f'Serving files from {DIRECTORY}')
        print('Press Ctrl+C to stop\n')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nStopped.')
