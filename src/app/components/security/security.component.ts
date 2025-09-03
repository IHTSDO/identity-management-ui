import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
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
export class SecurityComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;

    lengthCheck: boolean | undefined = undefined;
    caseCheck: boolean | undefined = undefined;
    numeralCheck: boolean | undefined = undefined;
    specialCheck: boolean | undefined = undefined;
    matchCheck: boolean | undefined = undefined;

    currentPassword: string = '';
    newPassword: string = '';
    newPasswordConfirm: string = '';

    currentPasswordVisible: boolean = false;
    passwordVisible: boolean = false;
    passwordConfirmVisible: boolean = false;

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

    showCurrentPassword(): void {
        this.currentPasswordVisible = true;
    }

    hideCurrentPassword(): void {
        this.currentPasswordVisible = false;
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
        if (this.newPasswordConfirm !== '') {
            this.matchCheck = (this.newPassword === this.newPasswordConfirm) && (this.newPasswordConfirm !== '');
        }
    }

    savePassword(): void {
        this.authenticationService.httpUpdatePassword(this.currentPassword, this.newPassword).subscribe({
            next: () => {
                this.toastr.success('Password updated successfully');
                // Clear the form fields after successful update
                this.currentPassword = '';
                this.newPassword = '';
                this.newPasswordConfirm = '';
                // Reset validation states
                this.lengthCheck = undefined;
                this.caseCheck = undefined;
                this.numeralCheck = undefined;
                this.specialCheck = undefined;
                this.matchCheck = undefined;
            },
            error: err => {
                console.error('Password update error:', err);
                this.toastr.error('Failed to update password. Please check your current password and try again.');
            }
        })
    }
}
