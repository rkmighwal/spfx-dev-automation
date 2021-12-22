# SPFx Automation Scripts

## Description

These files were created for SharePoint Framework (SPFx) projects to automate below mentioned points:

1. Update version in **package.json** and **package-solution.json** files
2. Deploy SPFx package to SharePoint App Catalog site

## Package Details

This package contains **deploymentScripts** folder and **gulpfile.js**, which have different roles:

### deploymentScripts Folder

Contains **Powershell** scripts to create and deploy package to SharePoint Online using **gulp**, **NPM** and **m365** npm package commands.

### gulpfile.js

Updated gulpfile.js from SPFx (version 1.13) project, it basically add one sub task before SPFx build command to syncronize version between **package.json** and **package-solution.json** files.

## How to Use

Following are steps to add these files into SPFx project:

1. Copy **deploymentScripts** folder (including all powershell files) to root level of your project.
2. Update **$app_catalog_url** variable in **deployement.ps1** file to your SharePoint Online App Catalog website.
3. Install CLI for Microsoft 365 globally. ([Documentation](https://pnp.github.io/cli-microsoft365/))

```console
npm i -g @pnp/cli-microsoft365
```

4. Replace **gulpfile.js** with **gulefile.js** in your project (exists on root level).
5. Add following script commands in **package.json** file of your project. (Sample package.json added to this project)

```json
 "scripts": {
    "pack-revision": "@powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./deploymentScripts/package_revision.ps1",
    "pack-patch": "@powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./deploymentScripts/package_patch.ps1",
    "pack-minor": "@powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./deploymentScripts/package_minor.ps1",
    "pack-major": "@powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./deploymentScripts/package_major.ps1",
    "deploy": "@powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./deploymentScripts/deployment.ps1",
  }
```

**Please note: This gulpfile.js was based on SPFx version 1.13, hence there is no guarantee whether it will work it other versions or not. But you can reuse code to modify gulpfile.js in your project. For more details, please refer to [Microsoft Documentation](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/integrate-gulp-tasks-in-build-pipeline#custom-gulp-tasks).**

