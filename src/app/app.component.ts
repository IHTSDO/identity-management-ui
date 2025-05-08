import {Component, Inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SnomedNavbarComponent} from "./components/snomed-navbar/snomed-navbar.component";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {DOCUMENT, NgIf} from "@angular/common";
import {User} from "./models/user";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SnomedNavbarComponent, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'identity-management';

    environment: string = '';

    user!: User;
    userSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService, @Inject(DOCUMENT) private readonly document: Document, private readonly router: Router) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.assignFavicon();

        this.authenticationService.httpGetUser().subscribe({
            next: (user) => {
                this.authenticationService.setUser(user);
            },
            error: () => {
                this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
            }
        });
    }

    assignFavicon() {
        switch (this.environment) {
            case 'local':
                this.document.getElementById('favicon')!.setAttribute('href', 'favicon_grey.ico');
                break;
            case 'dev':
                this.document.getElementById('favicon')!.setAttribute('href', 'favicon_red.ico');
                break;
            case 'uat':
                this.document.getElementById('favicon')!.setAttribute('href', 'favicon_green.ico');
                break;
            case 'training':
                this.document.getElementById('favicon')!.setAttribute('href', 'favicon_yellow.ico');
                break;
            default:
                this.document.getElementById('favicon')!.setAttribute('href', 'favicon.ico');
                break;
        }
    }
}
