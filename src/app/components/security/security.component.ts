import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-security',
    imports: [
        RouterLink,
        FormsModule,
        NgIf
    ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent {
    user!: User;
    userSubscription: Subscription;

    lengthCheck: boolean = false;
    caseCheck: boolean = false;
    numeralCheck: boolean = false;
    specialCheck: boolean = false;
    matchCheck: boolean = false;

    constructor(private readonly authenticationService: AuthenticationService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    getInitials(user: User): string {
        return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    }
}
