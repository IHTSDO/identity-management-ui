import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
    constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {
    }

    ngOnInit() {
        console.log('logout');
        this.authenticationService.httpLogout().subscribe({
            next: data => {
                this.authenticationService.setUser(undefined!);
                this.router.navigate(['/']);
            },
            error: (e) => {
                console.error('e: ', e);
                this.authenticationService.setUser(undefined!);
                this.router.navigate(['/']);
            }
        });
    }
}
