import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface LauncherApp {
  Application: string;
  icon: string;
  faIcon: string;
  link: string;
  description: string;
  client: string;
  colour: string; // tailwind colour token e.g. sky-400
  group: number;  // 1..4
}

@Injectable({ providedIn: 'root' })
export class LauncherConfigService {
  constructor(private http: HttpClient) {}

  getApps(): Observable<LauncherApp[]> {
    return this.http.get<any>('/assets/launcherConfig.json').pipe(
      map(raw => {
        if (Array.isArray(raw)) {
          // Expect shape: [ configObject, appsArray ]
          return raw[1] ?? [];
        }
        if (raw && Array.isArray(raw.apps)) {
          return raw.apps;
        }
        return [];
      }),
      map((apps: any[]) => (apps as LauncherApp[])
        .filter(a => !!a && !!a.link && !!a.Application)
        .sort((a, b) => (a.group ?? 99) - (b.group ?? 99) || a.Application.localeCompare(b.Application))
      )
    );
  }

  groupByGroup(apps: LauncherApp[]): Record<number, LauncherApp[]> {
    return apps.reduce((acc, app) => {
      const g = app.group ?? 4;
      (acc[g] ||= []).push(app);
      return acc;
    }, {} as Record<number, LauncherApp[]>);
  }
}
