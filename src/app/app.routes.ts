import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';
import { Courses } from './courses/courses';
import { courseResolver } from './services/course.resolver';
import { CoursePage } from './course-page/course-page';

export const routes: Routes = [
    {
        path: "courses",
        component: Courses,
        title: 'Courses'
    },
    {
        path: "about",
        component: AboutUs,
        title: 'About Us'
    }, {
        path: 'courses/:id',
        component: CoursePage,
        resolve: {
            course: courseResolver
        }
    },
    {
        path: "",
        redirectTo: 'courses',
        pathMatch: 'full'
    },
    {
        path: "**",
        redirectTo: 'courses'
    }
];
