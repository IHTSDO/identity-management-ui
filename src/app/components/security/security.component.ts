import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-security',
    imports: [
        RouterLink
    ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        console.log('security user: ', this.user);
    }
}
