# Roadmap

## Prototype

The purpose of the prototype is to verify if the original idea is feasible,
test the chosen technologies and look for possible critical design errors

### Features

- [x] Define stack
- [x] Basic api express server
- [x] Env setup
- [x] Api JWT auth
- [x] Web JWT auth and sessions
- [x] Login via passport
- [x] Database setup
- [x] Add syndication providers
- [x] Add oauth providers
- [x] Define posts types
- [x] Syndication provider 
- [x] Web layout with public sections
- [x] Protect private routes
- [x] Sign-in page

### Fixes

- [x] Google provider shouldn't exist
- [x] Can we rename "adapters" into something else?
- [x] Use async/await only where needed
- [x] Repo proxy should handle errors
- [x] Interface for providers
- [x] Save user name on sign-up
- [x] Save posts date to sort them

## Alpha

The alpha version is a deployable but closed to the public version, which
implements only strictly necessary features

### Features

- [x] Define monorepo scructure
- [x] Docker and devcontainer setup
- [x] Basic UI design
- [ ] User account page
- [ ] User unique handlers
- [ ] Puplic wall
- [ ] Logout
- [ ] Pagination
- [ ] Facebook webhooks
- [ ] Github webhooks
- [ ] Providers settings

### Fixes

- [ ] Change `subtle` button color

## Beta

The beta version is a version open to a small number of selected users,
improves and consolidates the basic features and and prepares to be used by the
public 

### Features
 
- [ ] Syndication provider profile pic
- [ ] User profile pic
- [ ] Delete account
- [ ] Responsive layout
- [ ] Terms of service and privacy policy
- [ ] Awesome landing page

## MVP

The first publicly open version, fully functional and well tested but still
MVP. From here on use semver from `1.0.0`.
