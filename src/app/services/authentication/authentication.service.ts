import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Login, User} from '../../models/user';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import { AuthoringService } from '../authoring/authoring.service';
import {PrincipleService} from "../principle/principle.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private user = new BehaviorSubject<User>(undefined!);

    uiConfiguration: any;
    uiConfigurationSubscription: Subscription;

    constructor(private http: HttpClient, private authoringService: AuthoringService, private principleService: PrincipleService) {
        this.uiConfigurationSubscription = this.authoringService.getUIConfiguration().subscribe( data => this.uiConfiguration = data);
    }

    setUser(user: User) {
        this.user.next(user);
    }

    getUser() {
        return this.user.asObservable();
    }

    httpGetUser() {
        return this.http.get<User>('/auth');
    }

    httpLogin(loginInformation: Login) {
        return this.http.post<Login>('api/authenticate', loginInformation);
    }

    httpLogout() {
        return this.http.post<Login>('api/account/logout', {});
    }

    login(credential: any) {
        const promise = new Promise<void>((resolve, reject) => {
            this.http.post('api/authenticate', credential).subscribe(() => {
                // login successful
                resolve();
            }, error => {
                console.error('Error while trying to logIn. Error message: ' + error.message);
                reject(error);
            });
        });

        return promise;
    }

    logout() {
        const promise = new Promise<void>((resolve, reject) => {
            this.http.post('api/account/logout', {}).subscribe(() => {
                this.principleService.authenticate(null);
                resolve();
            }, error => {
                console.error('Error while trying to logout. Error message: ' + error.message);
                reject(error);
            });
        });

        return promise;
    }
}
