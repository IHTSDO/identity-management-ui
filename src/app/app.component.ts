import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {SnomedNavbarComponent} from "./components/snomed-navbar/snomed-navbar.component";
import {AuthenticationService} from "./services/authentication/authentication.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SnomedNavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'identity-management';

    constructor(private readonly authenticationService: AuthenticationService, private readonly route: ActivatedRoute) {
    }

    ngOnInit() {
        this.authenticationService.httpGetUser().subscribe({
            next: (user) => {
                this.authenticationService.setUser(user);
            },
            error: () => {}
        });
    }
}
