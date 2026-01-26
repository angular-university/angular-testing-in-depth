import { Course } from '../model/course';
import {  Lesson } from '../model/lesson';
import { TabData } from '../tabs/tabs.model';

export function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 12,
    seqNo: 1,
    titles: {
      description: 'Angular Testing',
      longDescription: 'A deep dive into testing'
    },
    iconUrl: 'test.png',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 10,
    ...overrides
  };
}

export const MOCK_COURSES: Course[] = [
  createCourse({ id: 1, category: 'BEGINNER', titles: { description: 'Beginner Course', longDescription: 'Theory' } }),
  createCourse({ id: 2, category: 'ADVANCED', titles: { description: 'Advanced Course', longDescription: 'Practice' } })
];

export const MOCK_LESSONS: Lesson[] = [
  { id: 101, seqNo: 1, description: 'Lesson 1', duration: '5:00', courseId:1 },
  { id: 102, seqNo: 2, description: 'Lesson 2', duration: '10:00', courseId: 2 }
];

export const MOCK_TABS: TabData[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Advanced', value: 'advanced' }
];