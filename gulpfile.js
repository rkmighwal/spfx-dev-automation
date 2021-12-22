"use strict";

const gulp = require("gulp");
const gutil = require("gulp-util");
const build = require("@microsoft/sp-build-web");
const fs = require("fs");

const CONFIG_FOLDER_PATH = "./config";
const PACKAGE_SOLUTION_FILE_PATH = `${CONFIG_FOLDER_PATH}/package-solution.json`;
const PACKAGE_JSON_FILE_PATH = "./package.json";

let updatePackageVersionSubTask = build.subTask(
  "update-package-version-subtask",
  function (gulp, buildOptions, done) {
    const skipBumpRevision = buildOptions.args["revision"] === false;
    let updateFile = false;

    this.log("Skip Revision: " + skipBumpRevision);

    const pkgConfig = require(PACKAGE_JSON_FILE_PATH);
    const pkgSolution = require(PACKAGE_SOLUTION_FILE_PATH);

    const solutionVersion = String(pkgSolution.solution.version);
    const packageVersion = String(pkgConfig.version);
    this.log(`Package Version: ${packageVersion}`);
    this.log(`Solution Version: ${solutionVersion}`);

    const solutionVersionParts = solutionVersion
      .split(".")
      .map((part) => parseInt(part));
    let updatedVersionParts = packageVersion
      .split(".")
      .map((part) => parseInt(part));

    updateFile =
      solutionVersionParts[0] !== updatedVersionParts[0] ||
      solutionVersionParts[1] !== updatedVersionParts[1] ||
      solutionVersionParts[2] !== updatedVersionParts[2];

    updatedVersionParts.push(updateFile ? 0 : solutionVersionParts[3]);

    if (!skipBumpRevision && !updateFile) {
      updateFile = true;
      const oldBuildNumber = updatedVersionParts[3];
      this.log("Old Build Number: " + oldBuildNumber);
      const newBuildNumber = oldBuildNumber + 1;
      this.log("New Build Number: " + newBuildNumber);

      updatedVersionParts[3] = newBuildNumber;
    }

    if (updateFile) {
      this.log("New Version: " + updatedVersionParts.join("."));
      pkgSolution.solution.version = updatedVersionParts.join(".");

      fs.writeFileSync(
        PACKAGE_SOLUTION_FILE_PATH,
        JSON.stringify(pkgSolution, null, 4)
      );
      this.log("Package Solution updated!");
    }

    return gulp
      .src(PACKAGE_SOLUTION_FILE_PATH)
      .pipe(gulp.dest(CONFIG_FOLDER_PATH));
  }
);

let updatePackageVersionTask = build.task(
  "update-package-version",
  updatePackageVersionSubTask
);

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set("serve", result.get("serve-deprecated"));

  return result;
};

build.rig.addPreBuildTask(updatePackageVersionTask);

build.initialize(gulp);
