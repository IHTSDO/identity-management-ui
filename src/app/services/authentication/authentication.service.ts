import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Login, User, UnauthorizedResponse} from '../../models/user';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import { AuthoringService } from '../authoring/authoring.service';
import { ConfigService } from '../config.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly user = new BehaviorSubject<User>(undefined!);
    private readonly referer = new BehaviorSubject<string>('');
    private readonly logoutStep = new BehaviorSubject<'backend' | 'keycloak'>('backend');
    private redirecting = false;

    uiConfiguration: any;
    uiConfigurationSubscription: Subscription;

    constructor(
        private readonly http: HttpClient, 
        private readonly authoringService: AuthoringService,
        private readonly configService: ConfigService
    ) {
        this.uiConfigurationSubscription = this.authoringService.getUIConfiguration().subscribe( data => this.uiConfiguration = data);
    }

    setUser(user: User) {
        this.user.next(user);
    }

    getUser() {
        return this.user.asObservable();
    }

    setReferer(referer: string) {
        this.referer.next(referer);
    }

    getReferer() {
        return this.referer.asObservable();
    }

    getLogoutStep() {
        return this.logoutStep.asObservable();
    }

    httpGetUser() {
        return this.http.get<User>('/api/account', { withCredentials: true });
    }

    httpUpdateUser(user: User) {
        return this.http.put<User>('/api/user?username=' + user.login, user);
    }

    httpLogin(loginInformation: Login) {
        return this.http.post<Login>('/api/authenticate', loginInformation);
    }

    httpLogout() {
        return this.http.post<Login>('/api/account/logout', {});
    }

    httpUpdatePassword(password: string) {
        return this.http.put('/api/user/password', { newPassword: password });
    }

    /**
     * Handle 401/403 responses by doing a top-level navigation to the login endpoint
     * This method handles the logout process by first calling the backend logout endpoint,
     * then redirecting to Keycloak for proper session termination
     */
    logout(): void {
        if (this.redirecting) {
            console.log('Already redirecting, skipping...');
            return;
        }
        this.redirecting = true;
        
        // Clear user immediately for better UX
        this.user.next(undefined!);
        
        // First call the backend logout endpoint to clear local session data
        this.httpLogout().subscribe({
            next: (data) => {
                console.log('Backend logout successful:', data);
                this.logoutStep.next('keycloak');
                this.redirectToKeycloak();
            },
            error: (error) => {
                console.error('Backend logout error:', error);
                // Even if backend logout fails, still redirect to Keycloak
                this.logoutStep.next('keycloak');
                this.redirectToKeycloak();
            }
        });
    }

    /**
     * Redirect to Keycloak logout endpoint
     * This is called after the backend logout endpoint is hit
     */
    private redirectToKeycloak(): void {
        // Get the Keycloak logout URL with returnTo parameter
        const logoutUrl = this.configService.getLogoutUrlWithReturnTo();
        
        console.log('Redirecting to Keycloak logout:', logoutUrl);
        // Use top-level navigation to Keycloak logout endpoint
        window.location.href = logoutUrl;
    }

    /**
     * Handle 401/403 responses with proper error parsing
     * This method can be called directly with the error object from HTTP calls
     */
    handleUnauthorizedError(error: any) {
        if (error && (error.status === 401 || error.status === 403)) {
            this.handleUnauthorizedResponse(error);
        } else {
            console.error('Unexpected error:', error);
        }
    }

    /**
     * Handle 401/403 responses by doing a top-level navigation to the login endpoint
     * This avoids CORS issues that occur when following 302 redirects from XHR calls
     */
    handleUnauthorizedResponse(error?: any) {
        if (this.redirecting) {
            console.log('Already redirecting, skipping...');
            return;
        }
        this.redirecting = true;
        
        let loginUrl: string;
        
        // Try to extract loginUrl from the error response if it's a proper 401/403 response
        if (error && error.error && error.error.loginUrl) {
            loginUrl = error.error.loginUrl;
            console.log('Using loginUrl from 401/403 response:', loginUrl);
        } else {
            // Fallback to constructing the login URL with current location
            const returnTo = encodeURIComponent(window.location.href);
            loginUrl = `/api/auth/login?returnTo=${returnTo}`;
            console.log('Using fallback loginUrl:', loginUrl);
        }
        
        console.log('Redirecting to login endpoint:', loginUrl);
        // Use top-level navigation instead of fetch to avoid CORS issues
        window.location.href = loginUrl;
    }

    /**
     * Legacy method - kept for backward compatibility but now redirects to the new login endpoint
     * @deprecated Use handleUnauthorizedResponse() instead
     */
    redirectToKeycloakAuth() {
        console.warn('redirectToKeycloakAuth() is deprecated. Use handleUnauthorizedResponse() instead.');
        this.handleUnauthorizedResponse();
    }

    /**
     * Check if user is currently authenticated
     * Returns true if user exists and has login property
     */
    isAuthenticated(): boolean {
        const currentUser = this.user.value;
        return !!(currentUser && (currentUser as any).login);
    }

    /**
     * Attempt silent SSO login without showing any UI to the user
     * This can be used for background authentication checks
     */
    attemptSilentLogin(): void {
        if (this.redirecting) {
            console.log('Already redirecting, skipping silent login...');
            return;
        }
        
        const returnTo = encodeURIComponent(window.location.href);
        const silentLoginUrl = `/api/auth/auto?returnTo=${returnTo}`;
        
        console.log('Attempting silent SSO login:', silentLoginUrl);
        // Use top-level navigation for silent login
        window.location.href = silentLoginUrl;
    }

    /**
     * Clear current user and redirect to login
     * Useful for logout scenarios
     */
    clearUserAndRedirect(): void {
        this.user.next(undefined!);
        this.handleUnauthorizedResponse();
    }
}
