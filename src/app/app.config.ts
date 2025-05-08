import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {AuthenticationInterceptor} from "./interceptors/authentication.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptors([AuthenticationInterceptor])),
        provideAnimations(),
        provideToastr(),
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ]
};
