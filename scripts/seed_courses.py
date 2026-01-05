"""
Upload all of the data from `get_courses.py` into Schedul's Firestore database.
Author: Dishant Bhandula <code.dishb@gmail.com>
"""

from os import getenv
from pathlib import Path
from json import load

from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
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
    Seeds Schedul's Firestore database with all of the course data generated from `get_courses.py`
    for a given institution.

    Args:
        institution_id (int): The 4-digit ID assigned to each school (aka institution) by the UC /
        CSU system. This can be found in the URL of the course list.
    """

    with open(COURSE_FILES / f"{institution_id}.json", encoding="utf-8") as course_file:
        courses = load(course_file)

    institution_title = ""
    match institution_id:
        case 2754:
            institution_title = "Amador Valley High School"
        case 2755:
            institution_title = "Foothil High School"
        case 2751:
            institution_title = "Dublin High School"

    school_ref = db.collection("schools").document(str(institution_id))
    school_ref.set({"institutionId": institution_id,
                    "title": institution_title,
                    "updatedAt": SERVER_TIMESTAMP,
                    "createdAt": SERVER_TIMESTAMP},
                   merge = True
                   )

    change_counter = 499
    current_batch = -1
    batches = []

    for course in courses:
        if change_counter == 499:
            batches.append(db.batch())
            current_batch += 1
            change_counter = 0

        course_credits = 0
        match course["courseLength"]:
            case "Full Year":
                course_credits = 10
            case "Half Year":
                course_credits = 5
            case "Two Years":
                course_credits = 20

        course_ref = school_ref.collection("courses").document(course["courseId"])
        course_with_timestamps = {**course,
                                  "institutionId": institution_id,
                                  "updatedAt": SERVER_TIMESTAMP,
                                  "createdAt": SERVER_TIMESTAMP,
                                  "credits": course_credits
                                  }

        batches[current_batch].set(course_ref, course_with_timestamps, merge = True)
        change_counter += 1

    for batch in batches:
        batch.commit()

if __name__ == "__main__":
    INSTITUTION_IDS = [
        2754,  # Amador Valley High School
        2755,  # Foothill High School
        2751,  # Dublin High School
    ]

    for id_ in INSTITUTION_IDS:
        seed_school_courses(id_)
        print(f"Course data successfully seeded for institution {id_}.")
