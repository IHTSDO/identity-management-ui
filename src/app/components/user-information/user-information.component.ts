import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-information',
    imports: [
        RouterLink,
        NgIf,
        FormsModule
    ],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss'
})
export class UserInformationComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;

    constructor(private readonly authenticationService: AuthenticationService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        console.log('info user: ', this.user);
    }
}
