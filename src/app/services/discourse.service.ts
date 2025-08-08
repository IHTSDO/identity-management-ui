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
  private readonly baseUrl = '/discourse';

  constructor(private http: HttpClient) {}

  getLatestTopics(categoryId: number = 12, limit: number = 6): Observable<DiscourseTopic[]> {
    const url = `${this.baseUrl}/c/company-news/${categoryId}/l/latest.json?limit=${limit}`;
    
    return this.http.get<DiscourseResponse>(url).pipe(
      map(response => {
        console.log('Discourse API response:', response);
        const topics = response.topic_list.topics;
        console.log('Topics:', topics);
        return topics.map(topic => ({
          ...topic,
          created_by: topic.created_by || { username: 'Unknown', id: 0, name: 'Unknown', avatar_template: '' },
          last_poster: topic.last_poster || { username: 'Unknown', id: 0, name: 'Unknown', avatar_template: '' }
        }));
      })
    );
  }

  formatTopicDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  getTopicUrl(topic: DiscourseTopic): string {
    return `${this.baseUrl}/t/${topic.slug}/${topic.id}`;
  }
}
