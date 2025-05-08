import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication/authentication.service";

export const authenticationGuard: CanActivateFn = (route, state) => {
    // const authenticationService = inject(AuthenticationService);
    //
    // let authenticated: boolean = false;
    //
    // authenticationService.getUser().subscribe({
    //     next: user => {
    //         console.log('user: ', user);
    //         console.log('route: ', route);
    //         console.log('state: ', state);
    //         if (user !== undefined) {
    //             authenticated = true;
    //         }
    //     }
    // });
    //
    // return authenticated;

    // console.log('loggedIn: ', authenticationService.loggedIn);
    return true;
};
