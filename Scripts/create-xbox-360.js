const fs = require('fs');
const path = require('path');

// list of game files, can be found from xbecopy command in Minecraft.Client.log
const files = [
    { source: 'Minecraft.Client/Release/Minecraft.Client.xex', target: 'Minecraft.Client.xex', errors: { ENOENT: { solution: 'Create a build with the \'Release\' and \'Xbox 360\' profile in Visual Studio 2012' } } },
    { source: 'Minecraft.Client/Common/res', target: 'res' },
    { source: 'Minecraft.Client/XboxMedia/AvatarAwards', target: 'AvatarAwards', optional: true, errors: { ENOENT: { solution: 'Can be found in \'Minecraft.Client/GameConfig/AvatarPackages/AvatarAwards\'' } } },
    { source: 'Minecraft.Client/Common/Tutorial/Tutorial', target: 'Tutorial/Tutorial', optional: true },
    { source: 'Minecraft.Client/XboxMedia/584111F70AAAAAAA', target: '584111F70AAAAAAA', optional: true, errors: { ENOENT: { fix: (file) => fs.writeFileSync(file.source) } } },
    { source: 'Minecraft.Client/Xbox/kinect/speech', optional: true },
    { source: 'Minecraft.Client/XboxMedia/XZP/TMSFiles.xzp', target: 'TMSFiles.xzp', optional: true, errors: { ENOENT: { solution: 'Can be found in \'Minecraft.Client/Xbox/Title Update/TitleUpdate/Package/res/TMS/TMSFiles.xzp\'' } } },
    { source: 'Minecraft.Client/Common/DummyTexturePack', target: 'DummyTexturePack', optional: true },
];

const sourceDir = path.join(__dirname, '../Source');
const targetDir = path.join(__dirname, '../Builds/Xbox 360');

if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const file of files) {
    const sourcePath = path.join(sourceDir, file.source);
    const targetPath = path.join(targetDir, file.target ?? '');

    (function copyFile(attempts) {
        console.log(`Copying '${sourcePath}' to '${targetPath}'...`);
    
        try {
            // copy the file
            fs.cpSync(sourcePath, targetPath, { recursive: true });
            if (attempts > 0) console.log('Fixed error!');
        } catch (err) {
            // error copying file
            console.log(`Error while copying: ${err.message}`);
            const error = file.errors?.[err.code];
            if (error?.fix && attempts === 0) {
                // attempt to fix the error
                console.log('Attempting to fix error...');

                try {
                    error.fix(file);
                    return copyFile(attempts + 1);
                } catch (err) {
                    console.log(`Error attempting to fix error: ${err.message}`);
                };
            } else if (error?.solution) {
                // log the solution
                console.log(`Solution: ${error.solution}`);
            }
            if (file.optional) return console.log('Continuing as file is optional, however you might encounter problems!'); // file is optional, continue

            process.exit(1); // exit
        }
    })(0);
}

console.log('Done!');