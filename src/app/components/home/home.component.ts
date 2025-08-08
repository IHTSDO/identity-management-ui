import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {DiscourseService, DiscourseTopic} from "../../services/discourse.service";
import {NgIf, NgFor} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgIf, NgFor, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    user!: User;
    userSubscription: Subscription;
    discourseTopics: DiscourseTopic[] = [];
    loadingTopics = true;

    constructor(
        private readonly authenticationService: AuthenticationService, 
        private readonly discourseService: DiscourseService,
        public router: Router
    ) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
    }

    ngOnInit() {
        this.authenticationService.httpGetUser().subscribe({
            next: (user) => {
                this.authenticationService.setUser(user);
            },
            error: () => {
                this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
            }
        });

        // Load Discourse topics
        this.loadDiscourseTopics();
    }

    loadDiscourseTopics() {
        this.discourseService.getLatestTopics(12, 6).subscribe({
            next: (topics) => {
                this.discourseTopics = topics;
                this.loadingTopics = false;
            },
            error: (error) => {
                console.error('Error loading Discourse topics:', error);
                this.loadingTopics = false;
            }
        });
    }

    formatTopicDate(dateString: string): string {
        return this.discourseService.formatTopicDate(dateString);
    }

    getTopicUrl(topic: DiscourseTopic): string {
        return this.discourseService.getTopicUrl(topic);
    }

    redirectTo(url: string): void {
        window.open(url, '_blank');
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
}
