const gulp = require("gulp");
const fs = require("fs");

gulp.task("default", function () {

    const builtScriptComment = "/** This file is automatically generated. **/\n";
    const standardsDefDir = "data/standards";

    // Build all the standards listings into a single features.js file.
    const combinedStandards = fs.readdirSync(standardsDefDir)
        .reduce(function (prev, next) {

            if (next.indexOf(".json") === -1) {
                return prev;
            }

            const fileContents = fs.readFileSync(standardsDefDir + "/" + next, {encoding: "utf8"});
            const standardContents = JSON.parse(fileContents);

            const stdName = standardContents.info.name;
            const stdSubName = standardContents.info.subsection_name;
            const nameParts = [stdName, stdSubName].filter(part => !!part);

            const standardIdentifier = nameParts.join(": ").trim();
            standardContents.info.identifier = standardIdentifier;
            prev[standardIdentifier] = standardContents;
            return prev;
        }, {});

    let renderedStandardsModule = builtScriptComment + "\n";
    renderedStandardsModule += "window.WEB_API_MANAGER.standards = ";
    renderedStandardsModule += JSON.stringify(combinedStandards) + ";";

    fs.writeFileSync("add-on/lib/standards.js", renderedStandardsModule);
});
