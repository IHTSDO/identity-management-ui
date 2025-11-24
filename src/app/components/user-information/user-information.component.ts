import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-user-information',
    imports: [
        RouterLink,
        CommonModule,
        FormsModule
    ],
    templateUrl: './user-information.component.html',
    styleUrl: './user-information.component.scss'
})
export class UserInformationComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;

    saveEnabled: boolean = false;

    constructor(private readonly authenticationService: AuthenticationService, private readonly toastr: ToastrService, private readonly router: Router) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        this.authenticationService.httpGetUser('').subscribe({
            next: (user) => {
                this.authenticationService.setUser(user);
            },
            error: () => {
                this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
            }
        });
    }

    getInitials(user: User): string {
        let initials = '';

        if (user.firstName) {
            initials += user.firstName?.charAt(0).toUpperCase();
        }

        if (user.lastName) {
            initials += user.lastName?.charAt(0).toUpperCase();
        }

        return initials;
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
