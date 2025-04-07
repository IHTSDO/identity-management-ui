import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

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
export class UserInformationComponent {
    user!: User;
    userSubscription: Subscription;

    saveEnabled: boolean = false;

    constructor(private readonly authenticationService: AuthenticationService, private readonly toastr: ToastrService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    getInitials(user: User): string {
        return user.firstName?.charAt(0).toUpperCase() + user.lastName?.charAt(0).toUpperCase();
    }

    saveUser(user: User): void {
        this.authenticationService.httpUpdateUser(user).subscribe({
            next: () => {
                this.authenticationService.setUser(user);
                this.toastr.success('Saved');
            }
        })
    }
}
