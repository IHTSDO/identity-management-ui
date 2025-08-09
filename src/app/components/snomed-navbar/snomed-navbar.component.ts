import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {Router} from "@angular/router";
import {LauncherApp, LauncherConfigService} from "../../services/launcher-config.service";

@Component({
    selector: 'app-snomed-navbar',
    standalone: true,
    imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgClass],
    templateUrl: './snomed-navbar.component.html',
    styleUrl: './snomed-navbar.component.scss'
})
export class SnomedNavbarComponent implements OnInit {

    environment: string = '';

    user!: User;
    userSubscription: Subscription;

    expandedUserMenu: boolean = false;
    expandedAppMenu: boolean = false;
    expandedItemMenu: boolean = false;
    rolesView: boolean = false;

    apps: LauncherApp[] = [];

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly launcherConfig: LauncherConfigService,
        private readonly router: Router
    ) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
        router.events.subscribe(() => this.closeMenus());
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.launcherConfig.getApps().subscribe(apps => this.apps = apps);
    }

    appsByGroup(group: number): LauncherApp[] {
        return this.apps.filter(a => (a.group ?? 4) === group);
    }

    colourClass(colour: string): string {
        // map tailwind token to text colour class
        return colour ? `text-${colour}` : 'text-slate-600';
    }

    switchMenu(name: string): void {
        switch (name) {
            case 'user':
                this.expandedUserMenu = true;
                this.expandedAppMenu = false;
                this.expandedItemMenu = false;
                break;
            case 'app':
                this.expandedUserMenu = false;
                this.expandedAppMenu = true;
                this.expandedItemMenu = false;
                break;
            case 'item':
                this.expandedUserMenu = false;
                this.expandedAppMenu = false;
                this.expandedItemMenu = true;
                break;
        }
    }

    closeMenus(): void {
        this.expandedUserMenu = false;
        this.expandedAppMenu = false;
        this.expandedItemMenu = false;
        this.rolesView = false;
    }

    openRolesView(): void {
        this.closeMenus();
        this.rolesView = true;
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

    navigateTo(location: string): void {
        this.router.navigate([location]);
    }

    redirectTo(url: string): void {
        window.open(url, '_blank');
    }

    logout(): void {
        this.authenticationService.httpLogout().subscribe({
            next: () => {
                this.authenticationService.setUser(undefined!);
                this.router.navigate(['/']);
            },
            error: (e) => console.error('error: ', e)
        });
    }
}
