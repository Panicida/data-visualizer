const { series } = require("gulp");
const createDMG = require("electron-installer-dmg");

const { packageMac, packageWin } = require("./package");
const config = require("../config");

function installerWin(cb) {
    cb();
}
exports.installerWin = series(packageWin, installerWin);

function installerMac() {
    const options = {
        out: config.installer,
        appPath: config.package.output + "/DataVisualizer-darwin-x64/" + config.package.name + ".app",
        name: "DataVisualizer"
    };

    return createDMG(options);
}
exports.installerMac = series(packageMac, installerMac);