# CI & CD

The repo follows a feature branching model.

  1. New features are developed into an appropriately named branch
  2. Feature branch is merged to **develop** and deployed to staging environment
  3. Manual user testing in staging environment
  4. **develop** is merged to **main** and deployed to **production** environment

Merges into **main** and **develop** should be via PR.

## Github Actions

There are two actions `ci.yml` and `deploy.yml`

  - `ci.yml` should run on any push or merge to **main** or **develop** branch.
  - `ci.yml` should run on creation or update of PR where **main** or **develop** is the target branch.

  - `deploy.yml` should run on push or merge to **main** or **develop**
  - `deploy.yml` should not run on creation or update of PR
  - **develop** branch shoudl deploy to **staging** environment
  - **main** branch should deploy to **production** environment
