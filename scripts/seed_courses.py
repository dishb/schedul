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
CREDENTIAL_PATH = getenv("FIREBASE_ADMIN_PATH")
if CREDENTIAL_PATH == "" or not CREDENTIAL_PATH:
    raise EnvironmentError("Missing required environment variable: FIREBASE_ADMIN_PATH")

CRED = credentials.Certificate(CREDENTIAL_PATH)
COURSE_FILES = Path(__file__).parent / "courses"

firebase_admin.initialize_app(CRED)
db = firestore.client()

def seed_school_courses(institution_id: int) -> None:
    """
    Seeds Schedul's Firestore database with all of the course data generated from `get_courses.py`.

    Args:
        institution_id (int): The 4-digit ID assigned to each school (aka institution) by the UC /
        CSU system. This can be found in the URL of the course list.
    """

    courses = []
    with open(COURSE_FILES / f"{institution_id}.json", encoding = "utf-8") as course_file:
        courses = load(course_file)

    change_counter = 499
    current_batch = -1
    batches = []

    school_ref = db.collection("schools").document(str(institution_id))

    for course in courses:
        if change_counter == 499:
            batches.append(db.batch())
            current_batch += 1
            change_counter = 0

        course_ref = school_ref.collection("courses").document(course["courseId"])

        batches[current_batch].set(course_ref, course)
        change_counter += 1

    for batch in batches:
        batch.commit()


if __name__ == "__main__":
    INSTITUTION_IDS = [2754, # Amador Valley High School
                       2755, # Foothil High School
                       2751 # Dublin High School
                       ]

    for id_ in INSTITUTION_IDS:
        seed_school_courses(id_)
        print(f"Course data successfully seeded for institution {id_}.")
