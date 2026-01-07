import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';
import { Courses } from './courses/courses';

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
