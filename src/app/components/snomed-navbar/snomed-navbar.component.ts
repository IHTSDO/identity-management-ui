import {Component} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-snomed-navbar',
    standalone: true,
    imports: [NgIf],
    templateUrl: './snomed-navbar.component.html',
    styleUrl: './snomed-navbar.component.scss'
})
export class SnomedNavbarComponent {

    user!: User;
    userSubscription: Subscription;

    constructor(private authenticationService: AuthenticationService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

}
