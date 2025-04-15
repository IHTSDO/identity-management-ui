import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";

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

    newPassword: string = '';
    newPasswordConfirm: string = '';

    passwordVisible: boolean = false;
    passwordConfirmVisible: boolean = false;

    constructor(private readonly authenticationService: AuthenticationService, private readonly toastr: ToastrService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
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

    showPassword(): void {
        this.passwordVisible = true;
    }

    hidePassword(): void {
        this.passwordVisible = false;
    }

    showConfirmPassword(): void {
        this.passwordConfirmVisible = true;
    }

    hideConfirmPassword(): void {
        this.passwordConfirmVisible = false;
    }

    validateNewPassword(): void {
        this.lengthCheck = this.containsLength(this.newPassword);
        this.caseCheck = this.containsUppercase(this.newPassword);
        this.numeralCheck = this.containsNumeral(this.newPassword);
        this.specialCheck = this.containsSpecial(this.newPassword);
    }

    containsLength(text: string): boolean {
        return text.length >= 12;
    }

    containsUppercase(text: string): boolean {
        return /[A-Z]/.test(text);
    }

    containsNumeral(text: string): boolean {
        return /\d/.test(text);
    }

    containsSpecial(text: string): boolean {
        return /[ `!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(text);
    }

    validateNewPasswordConfirm(): void {
        this.matchCheck = (this.newPassword === this.newPasswordConfirm) && (this.newPasswordConfirm !== '');
    }

    savePassword(): void {
        this.authenticationService.httpUpdatePassword(this.newPassword).subscribe({
            next: () => {
                this.toastr.success('Saved');
            },
            error: err => {
                this.toastr.error('Error');
            }
        })
    }
}
