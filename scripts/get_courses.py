"""
Creates JSON files with details of every course offered by selected schools. All information deemed
irrelevant to Schedul is left out.
Author: Dishant Bhandula <code.dishb@gmail.com>
"""

from json import dump
from pathlib import Path
from os.path import exists
from os import remove

from requests import get

SAVE_DIR_PATH = Path(__file__).resolve().parent / "courses"
ALLOWED_KEYS = {"title",
                "subjectAreaCode",
                "email",
                "transcriptAbbreviations",
                "isOnline",
                "disciplineName",
                "isHonors",
                "courseId"
                }
WANTED_KEYS = {"gradeLevels",
               "isCte",
               "isClassroomBased",
               "courseLength",
               "honorsTypeName"
               }

def get_compiled_course_info(institution_id: int) -> None:
    """
    Gets detailed information on each course offered by a particular school including:

    - Course title
    - Course ID
    - Subject area
    - UC A-G code
    - Online or classroom
    - Weighted (honors) or not
    - Type of honors (honors or AP)
    - Grade levels allowed
    - Length of course
    - Part of CTE program or not

    Args:
        institution_id (int): The 4-digit ID assigned to each school (aka institution) by the UC /
        CSU system. This can be found in the URL of the course list.
    """

    courses_save_path = SAVE_DIR_PATH / f"{institution_id}.json"
    # pylint: disable=line-too-long
    res = get(f"https://hs-articulation.ucop.edu/api/public/courselist/institution/{institution_id}/list/29",
              timeout = 60
              )
    # pylint: enable=line-too-long
    courses = res.json()["courses"]
    compiled_data = []
    for course in courses:
        compiled_course = {}
        for key in course.keys():
            if key in ALLOWED_KEYS:
                compiled_course[key] = course[key]

        res = get(f"https://hs-articulation.ucop.edu/api/public/course/{course["courseId"]}/29",
                  timeout = 60
                  )
        course_info = res.json()
        for key in WANTED_KEYS:
            compiled_course[key] = course_info[key]

        compiled_data.append(compiled_course)

    if exists(courses_save_path):
        remove(courses_save_path)
    with open(courses_save_path, "w", encoding = "utf-8") as courses_save_file:
        dump(compiled_data, courses_save_file, indent = 2)

if __name__== "__main__":
    INSTITUTION_IDS = [2754, # Amador Valley High School
                       2755, # Foothil High School
                       2751 # Dublin High School
                       ]

    for id_ in INSTITUTION_IDS:
        get_compiled_course_info(id_)
        print(f"Course data successfully saved for institution {id_} in {SAVE_DIR_PATH}.")
