// creates XboxMedia from existing files scattered around source
// you must have the Xbox 360 SDK and XZP Tool downloaded

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// paths
const sourceDir = path.join(__dirname, '../Source');
const xzpDir = path.join(__dirname, 'XZP');
const targetDir = path.join(sourceDir, 'Minecraft.Client/XboxMedia');
const mediaDir = path.join(sourceDir, 'Minecraft.Client/Common/Media');
const sdkDir = 'C:\\Program Files (x86)\\Microsoft Xbox 360 SDK\\bin\\win32';

// delete existing XZP
if (fs.existsSync(xzpDir)) fs.rmSync(xzpDir, { recursive: true });
fs.mkdirSync(xzpDir, { recursive: true });

// delete existing XboxMedia
if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
fs.mkdirSync(targetDir, { recursive: true });

// for creation of Minecraft.xzp
const allowedMediaTypes = [
    '.xui',
    '.resx',
    '.xsb',
    '.xwb',
    // '.xgs', // some file that's in Sound/Xbox, but not in official XZP
    '.txt',
    '.ttf',
    '.abc',
    '.png',
    '.col'
];
const blacklistedMediaFiles = [
    // don't need these
    /^media\.txt$/,
    /^movies.+\.txt$/
];

// create strings.h
console.log('Creating strings.h...');
child_process.spawnSync(path.join(sdkDir, 'resx2bin.exe'), ['/HEADER', '/I', path.join(mediaDir, 'strings.resx'), path.join(targetDir, 'strings.h')]);

// create 4J_strings.h
console.log('Creating 4J_strings.h...');
child_process.spawnSync(path.join(sdkDir, 'resx2bin.exe'), ['/HEADER', '/I', path.join(mediaDir, '4J_strings.resx'), path.join(targetDir, '4J_strings.h')]);

// create wood theme (empty), actual file can be found in contents of base game
console.log('Creating 584111F70AAAAAAA...');
fs.writeFileSync(path.join(targetDir, '584111F70AAAAAAA'), '');

// create AvatarAwards, file can also be found in contents of base game
console.log('Creating AvatarAwards...');
fs.cpSync(path.join(sourceDir, 'Minecraft.Client/Xbox/GameConfig/AvatarPackages/AvatarAwards'), path.join(targetDir, 'AvatarAwards'));

// create TMSFiles.xzp, file can also be found in contents of title update
console.log('Creating TMSFiles.zxp...');
fs.cpSync(path.join(sourceDir, 'Minecraft.Client/Xbox/Title Update/TitleUpdate/Package/res/TMS/TMSFiles.xzp'), path.join(targetDir, 'XZP/TMSFiles.xzp'));

// create Minecraft.xzp... kinda, user needs to build the XZP with XZP Tool
// based from stuff in Minecraft.Client/Xbox/loc
// TODO: error handling on xbox 360 sdk tools
// NOTE: the 4J_strings.xus file from a official XZP shows a different header than what is expected from resx2bin?
console.log('Building media for Minecraft.xzp...');

const mediaFiles = getFilesRecursively(mediaDir);

(function checkMediaFile(fileIndex) {
    const filePath = mediaFiles[fileIndex]; // full file path
    const relativePath = filePath.split(mediaDir)[1].substring(1); // relative file path
    const fileExt = path.extname(filePath).toLowerCase(); // file extension
    const fileName = path.basename(filePath, fileExt); // file name (no extension)
    const outputDir = path.join(xzpDir, 'media', path.dirname(relativePath)); // where the file is going to be saved

    fs.mkdirSync(outputDir, { recursive: true });

    if (allowedMediaTypes.includes(fileExt) && !blacklistedMediaFiles.some(i => i.test(relativePath))) {
        if (fileExt === '.xui') {
            // build .xui to .xur
            console.log(`Converting ${relativePath} to .xur...`);
            child_process.spawnSync(path.join(sdkDir, 'xui2bin.exe'), [filePath, path.join(outputDir, `${fileName}.xur`)]);
        } else if (fileExt === '.resx') {
            // build .resx to .xus
            console.log(`Converting ${relativePath} to .xus...`);
            child_process.spawnSync(path.join(sdkDir, 'resx2bin.exe'), [filePath, path.join(outputDir, `${fileName}.xus`)]);
        } else {
            // copy file
            console.log(`Copying ${relativePath}...`);
            fs.cpSync(filePath, path.join(outputDir, path.basename(filePath)));
        }
    }

    if (mediaFiles[fileIndex += 1]) checkMediaFile(fileIndex);
})(0);

console.log(`
Build Directory: ${xzpDir}
Output Name: ${path.join(sourceDir, 'XboxMedia/XZP/Minecraft.xzp')}
Almost done! 'Minecraft.xzp' must be built using XZP Tool. Put the paths above into XZP Tool then you should have a complete XboxMedia folder
`.trimEnd());

function getFilesRecursively(rootDir) {
    const allFiles = [];
    (function getFiles(dir) {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                getFiles(filePath);
            } else {
                allFiles.push(filePath);
            }
        });
    })(rootDir);
    return allFiles;
}