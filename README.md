[<img alt="Snomed CT" style="height:125px;" src="https://static.wixstatic.com/media/49d95c_f232b9c10b72410b802fbbd35b357698~mv2.png"/>](https://www.snomed.org/)

Main:
[![Build Status](https://jenkins.ihtsdotools.org/view/all/job/jobs/job/snomed-sso-service/job/master/badge/icon)](https://jenkins.ihtsdotools.org/view/all/job/jobs/job/snomed-sso-service/job/master/)

Develop:
[![Build Status](https://jenkins.ihtsdotools.org/view/all/job/jobs/job/snomed-sso-service/job/develop/badge/icon)](https://jenkins.ihtsdotools.org/view/all/job/jobs/job/snomed-sso-service/job/develop/)
[![Quality Gate Status](https://sonarqube.ihtsdotools.org/api/project_badges/measure?project=org.snomed%3Asnomed-sso-service&metric=alert_status&token=sqb_4ab88d20b777acb2f2ae7e9d0ffed5c55111f00e)](https://sonarqube.ihtsdotools.org/dashboard?id=org.snomed%3Asnomed-sso-service)

![Contributers](https://img.shields.io/github/contributors/IHTSDO/snomed-sso-service)
![Last Commit](https://img.shields.io/github/last-commit/ihtsdo/snomed-sso-service)
![GitHub commit activity the past year](https://img.shields.io/github/commit-activity/m/ihtsdo/snomed-sso-service)
&nbsp;&nbsp;
![Tag](https://img.shields.io/github/v/tag/IHTSDO/snomed-sso-service)
![Java Version](https://img.shields.io/badge/Java_Version-17-green)
[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)
&nbsp;&nbsp;
![LOC](https://jenkins.ihtsdotools.org/buildStatus/icon?job=snomed-sso-service&status=lineOfCode&subject=line%20of%20code&color=blue)
![Coverage](https://jenkins.ihtsdotools.org/buildStatus/icon?job=snomed-sso-service&subject=Coverage)
![Tests](https://jenkins.ihtsdotools.org/buildStatus/icon?job=snomed-sso-service&status=numberOfTest&subject=Tests&color=brightgreen)
![Tests](https://jenkins.ihtsdotools.org/buildStatus/icon?job=snomed-sso-service&subject=Coverage&status=instructionCoverage)

# IHTSDO Tools Identity Management UI

This module is the IMS API written in Spring Boot. It provides single sign-on authentication and authorisation functionality, backed by Atlasian Crowd. User groups (labeled as roles) are cached to provide a faster lookup.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via Jest.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Nginx Support

To get this project running locally using nginx, the following config settings can be used, changing ports where required:

    server {
        listen      8080;
        server_name localhost.ihtsdotools.org;

        location / {
            proxy_pass http://127.0.0.1:4200;
        }

        location /api {
            proxy_pass https://dev-ims.ihtsdotools.org/api;
            proxy_set_header Accept "application/json";
        }
    }
