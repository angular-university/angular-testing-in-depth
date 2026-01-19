import {Course} from '../model/course';
import {COURSES} from '../../../server/db-data';
import {sortCoursesBySeqNo} from './sort-course-by-seq';


export function setupCourses() : Course[] {
  
  const coursesArray = Object.values(COURSES) as Course[];
  return coursesArray.sort(sortCoursesBySeqNo);
}

