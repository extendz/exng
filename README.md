# ExtNg - Extendz Angular

The purpose of this library is to automate most of the views associated with CRUD operations in REST APIs.

## Developer setup

### Prerequieties

1. NodeJS v 12.14.0
2. Angular CLI 9.x.x or later

### Start developing

1. Start a new terminal

```bash
ng build extendz --watch
```

2. In other tab/terminal,

```bash
ng s
```

## Project structure

Under the **_projects_** dir there are two main dirs.

- extendz (Library)
  - api (API related components/modules)
    - data-table
    - root (show available api endpoints with an icon)
  - core (core application models)
    - models
  - service (common services)
    - entity-meta
- extendz-playground (Test application)


## release

npm publish --ignore-scripts