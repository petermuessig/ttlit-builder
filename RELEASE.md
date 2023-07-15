# Release `ttlit-builder`

:warning: NPM > v8.x must be used for the release process!

First, make sure that you pull the latest state of the GitHub repository and then proceed with the following steps:

1. Update the version: `npm version patch|minor|major`

2. Push the new commit and tag: `git push && git push --tags`

A GitHub action will do the rest once the new tag has been pushed.
