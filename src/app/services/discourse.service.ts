import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DiscourseTopic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  has_summary: boolean;
  archetype: string;
  like_count: number;
  incoming_link_count: number;
  category_id: number;
  pinned_globally: boolean;
  pinned_at: string;
  pinned_until: string;
  image_url: string;
  slow_mode_seconds: number;
  draft: string;
  draft_key: string;
  draft_sequence: number;
  posted: boolean;
  unpinned: string;
  pinned: boolean;
  current_post_number: number;
  highest_post_number: number;
  deleted_by: string;
  has_deleted: boolean;
  actions_summary: any[];
  chunk_size: number;
  bookmarked: boolean;
  bookmarks: any[];
  topic_timer: any;
  message_bus_last_id: number;
  participant_count: number;
  show_read_indicator: boolean;
  thumbnails: any;
  slow_mode_enabled_until: string;
  summarizable: boolean;
  tags: string[];
  tags_disable_ads: boolean;
  thumbnails_extra_size: any;
  created_by?: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
  };
  last_poster?: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
  };
}

export interface DiscourseResponse {
  topic_list: {
    topics: DiscourseTopic[];
    users: any[];
    categories: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DiscourseService {
  // Proxy for API calls (nginx forwards /discourse -> https://forums.snomedtools.org)
  private readonly apiBaseUrl = '/discourse';
  // Public base for user-facing links
  private readonly publicBaseUrl = 'https://forums.snomed.org';

  constructor(private http: HttpClient) {}

  private static topicTime(t: DiscourseTopic): number {
    const d = t.bumped_at || t.last_posted_at || t.created_at;
    return d ? new Date(d).getTime() : 0;
  }

  getLatestTopics(categoryId: number = 12, limit: number = 6): Observable<DiscourseTopic[]> {
    const url = `${this.apiBaseUrl}/c/company-news/${categoryId}/l/latest.json?limit=${limit}`;
    return this.http.get<DiscourseResponse>(url).pipe(
      map(response => (response?.topic_list?.topics ?? []).map(topic => ({
        ...topic,
        created_by: topic.created_by || { username: 'Unknown', id: 0, name: 'Unknown', avatar_template: '' },
        last_poster: topic.last_poster || { username: 'Unknown', id: 0, name: 'Unknown', avatar_template: '' }
      }))),
      map(topics => topics.sort((a, b) => DiscourseService.topicTime(b) - DiscourseService.topicTime(a)))
    );
  }

  formatTopicDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  getTopicUrl(topic: DiscourseTopic): string {
    // Ensure user clicks go to the real Discourse site, not the local /discourse proxy
    return `${this.publicBaseUrl}/t/${topic.slug}/${topic.id}`;
  }
}
