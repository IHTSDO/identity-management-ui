import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Login, User} from '../../models/user';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import { AuthoringService } from '../authoring/authoring.service';
import { ConfigService } from '../config.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly user = new BehaviorSubject<User>(undefined!);
    private readonly referer = new BehaviorSubject<string>('');
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

    httpGetUser() {
        return this.http.get<User>('/api/account');
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

    redirectToKeycloakAuth() {
        if (this.redirecting) {
            console.log('Already redirecting, skipping...');
            return;
        }
        this.redirecting = true;
        
        // Use proper OAuth flow with the configured client
        const authUrl = this.configService.getAuthUrlWithReferrer();
        console.log('Redirecting to Keycloak OAuth:', authUrl);
        window.location.href = authUrl;
    }
}
