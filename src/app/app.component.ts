import {Component, Inject, OnInit, DOCUMENT} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SnomedNavbarComponent} from "./components/snomed-navbar/snomed-navbar.component";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {ConfigService} from "./services/config.service";
import {CommonModule} from "@angular/common";
import {User} from "./models/user";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SnomedNavbarComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'SNOMED International Account';

    environment: string = '';

    user!: User;
    userSubscription: Subscription;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly configService: ConfigService,
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly router: Router
    ) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.assignFavicon();

        // Load configuration first
        this.configService.loadConfig().subscribe({
            next: () => {
                // Configuration loaded successfully
                console.log('Configuration loaded');

                // Check if user is already authenticated
                this.authenticationService.httpGetUser('').subscribe({
                    next: (user) => {
                        console.log('User loaded in app component:', user);
                        this.authenticationService.setUser(user);
                    },
                    error: (error) => {
                        console.log('No authenticated user found in app component');
                        // Handle 401/403 responses by redirecting to login endpoint
                        this.authenticationService.handleUnauthorizedError(error);
                    }
                });
            },
            error: (error) => {
                console.error('Failed to load configuration:', error);
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
