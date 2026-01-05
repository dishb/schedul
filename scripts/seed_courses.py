"""
Description
Author: Dishant Bhandula <code.dishb@gmail.com>
"""

from os import getenv
from pathlib import Path
from json import load

from dotenv import load_dotenv
from firebase_admin import credentials, firestore
import firebase_admin

load_dotenv()
credential_path = getenv("FIREBASE_ADMIN_PATH")
if credential_path == "" or not credential_path:
    raise EnvironmentError("Missing required environment variable: FIREBASE_ADMIN_PATH")
CRED = credentials.Certificate(credential_path)

firebase_admin.initialize_app(CRED)
db = firestore.client()

COURSE_FILE = Path(__file__).parent / "courses" / "2754.json" # Amador Valley High School
courses = []
with open(COURSE_FILE, encoding = "utf-8") as course_file:
    courses = load(course_file)

change_counter = 499 # pylint: disable=invalid-name
current_batch = -1 # pylint: disable=invalid-name
batches = []
for course in courses:
    if change_counter == 499:
        batches.append(db.batch())
        current_batch += 1
        change_counter = 0 # pylint: disable=invalid-name

    ref = db.collection("courses").document()
    batches[current_batch].set(ref, course)
    change_counter += 1

for batch in batches:
    batch.commit()
