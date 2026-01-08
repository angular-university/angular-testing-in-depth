import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';
import { Courses } from './courses/courses';
import { CourseView } from './courses/components/course-view/course-view';
import { courseResolver } from './courses/services/course.resolver';

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
        component: CourseView,
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
