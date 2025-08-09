import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {catchError, map, of, switchMap, take, tap} from "rxjs";

export const authenticationGuard: CanActivateFn = (route, state) => {
    const authenticationService = inject(AuthenticationService);

    const hasOAuthParams = typeof window !== 'undefined' && (() => {
        const params = new URLSearchParams(window.location.search || '');
        return params.has('code') || params.has('session_state') || params.has('state') || params.has('error');
    })();

    // If we have OAuth params, try once to load the user (backend should accept the session/cookie now)
    if (hasOAuthParams) {
        return authenticationService.httpGetUser().pipe(
            tap(user => {
                if (user) {
                    authenticationService.setUser(user);
                    // Optionally clean the URL query string on success
                    try {
                        const newUrl = window.location.origin + window.location.pathname + window.location.hash;
                        window.history.replaceState({}, document.title, newUrl);
                    } catch {}
                }
            }),
            map(() => true),
            catchError(err => {
                // Do not redirect immediately to avoid loops; allow navigation to continue or show unauth state
                console.warn('OAuth callback present but user not loaded yet; not redirecting to avoid loop');
                return of(false);
            })
        );
    }

    // Normal path: check current user, otherwise attempt to fetch, then redirect if still unauthenticated
    return authenticationService.getUser().pipe(
        take(1),
        switchMap(user => {
            if (user && (user as any).login) {
                return of(true);
            }
            return authenticationService.httpGetUser().pipe(
                tap(fetchedUser => authenticationService.setUser(fetchedUser)),
                map(() => true),
                catchError(() => {
                    authenticationService.redirectToKeycloakAuth();
                    return of(false);
                })
            );
        })
    );
};
