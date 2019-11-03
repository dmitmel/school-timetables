#!/usr/bin/env python3

import os
import shutil
from jinja2 import Environment, FileSystemLoader
from css_html_js_minify import html_minify, css_minify

PROJECT_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(PROJECT_DIR, "templates")
STATIC_FILES_DIR = os.path.join(PROJECT_DIR, "static")
RENDERED_FILES_DIR = os.path.join(PROJECT_DIR, "rendered")

loader = FileSystemLoader(TEMPLATES_DIR)
env = Environment(loader=loader, autoescape=True)

shutil.rmtree(RENDERED_FILES_DIR)
os.makedirs(RENDERED_FILES_DIR, exist_ok=True)

for root, dirs, files in os.walk(STATIC_FILES_DIR, topdown=True):
    for name in dirs:
        full_path = os.path.join(root, name)
        relative_path = os.path.relpath(full_path, STATIC_FILES_DIR)
        os.makedirs(os.path.join(RENDERED_FILES_DIR, relative_path), exist_ok=True)

    for name in files:
        full_path = os.path.join(root, name)
        with open(full_path, "r") as file:
            file_contents = file.read()

        if os.path.splitext(name)[1] == ".css":
            file_contents = css_minify(file_contents)

        relative_path = os.path.relpath(full_path, STATIC_FILES_DIR)
        with open(os.path.join(RENDERED_FILES_DIR, relative_path), "w") as file:
            file.write(file_contents)

template = env.get_template("timetable.jinja2")
rendered_html = template.render()
minified_html = html_minify(rendered_html)
with open(os.path.join(RENDERED_FILES_DIR, "index.html"), "w") as file:
    file.write(minified_html)
