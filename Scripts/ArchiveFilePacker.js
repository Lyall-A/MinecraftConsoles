// extracts and creates .arc files
// extract example: node ArchiveFilePacker.js e "../Source/Minecraft.Client/Common/Media/MediaWindows64.arc" "./MediaWindows64"
// create example: node ArchiveFilePacker.js c "./MediaWindows64" "./MediaWindows64.arc"
const fs = require('fs');
const path = require('path');

const method = process.argv[2]?.toLowerCase();
const inputPath = process.argv[3];
const outputPath = process.argv[4];

if (method?.startsWith('e')) {
    // extract .arc
    console.log(`Reading '${inputPath}'...`);
    const archiveBuffer = fs.readFileSync(inputPath);

    console.log(`Parsing '${inputPath}'...`);
    const files = parseArc(archiveBuffer);
    
    if (path.extname(outputPath) === '.txt') {
        // create index file
        console.log(`Creating index file for '${inputPath}'...`);
        fs.writeFileSync(outputPath, files.map(file => file.name).join('\n'));
    } else {
        for (const file of files) {
            console.log(`Extracting '${file.name}'...`);
            const filePath = path.join(outputPath, file.name);

            fs.mkdirSync(path.dirname(filePath), { recursive: true }); // make sure directory exists
            fs.writeFileSync(filePath, archiveBuffer.subarray(file.offset, file.offset + file.length));
        }
    }
} else if (method?.startsWith('c')) {
    // create .arc
    console.log('Creating archive...');
    const archiveBuffer = createArc(inputPath);

    console.log(`Writing archive to '${outputPath}'...`);
    fs.writeFileSync(outputPath, archiveBuffer);
} else {
    console.log('??');
}

function parseArc(buffer, offset = 0) {
    const files = [];

    // read file count
    const fileCount = buffer.readUint32BE(offset);
    offset += 4;

    // loop each file
    for (let fileIndex = 0; fileIndex < fileCount; fileIndex++) {
        // read length of file name
        const fileNameLength = buffer.readUint16BE(offset);
        offset += 2;

        // read file name
        const fileName =  buffer.subarray(offset, offset += fileNameLength).toString();
        
        // read file offset
        const fileOffset = buffer.readUint32BE(offset);
        offset += 4;

        // read file length
        const fileLength = buffer.readUint32BE(offset);
        offset += 4;

        // add file
        files.push({
            name: fileName,
            offset: fileOffset,
            length: fileLength
        });
    }

    return files;
}

function createArc(inputPath) {
    const files = [];

    if (path.extname(inputPath) === '.txt') {
        // get files from index
        fs.readFileSync(inputPath, 'utf-8').split(/\r?\n/).forEach(file => {
            const filePath = path.join(path.dirname(inputPath), file);
            files.push({
                path: filePath,
                shortPath: file,
                length: fs.statSync(filePath).size
            });
        })
    } else {
        // get all files in dir recursively
        (function readDir(dir = '') {
            const dirPath = path.join(inputPath, dir);
            fs.readdirSync(dirPath).forEach(file => {
                const filePath = path.join(dirPath, file);
                const shortFilePath = path.join(dir, file);
                const fileStat = fs.statSync(filePath);
                if (fileStat.isDirectory()) return readDir(shortFilePath);
                files.push({
                    path: filePath,
                    shortPath: shortFilePath,
                    length: fileStat.size,
                });
            })
        })();
    }

    let offset = 0;
    let fileDataOffset = 0;

    const fileInfoLength = files.reduce((acc, file) => acc + 2 + Buffer.byteLength(file.shortPath) + 4 + 4, 0);
    const buffer = Buffer.alloc(4 + fileInfoLength + files.reduce((acc, file) => acc + file.length, 0));

    // write file count
    offset += buffer.writeUint32BE(files.length, offset);

    // loop each file
    for (const file of files) {
        const fileOffset = 4 + fileInfoLength + fileDataOffset;

        // write file name length
        buffer.writeUint16BE(Buffer.byteLength(file.shortPath), offset);
        offset += 2;

        // write file name
        offset += buffer.write(file.shortPath, offset);

        // write file offset
        buffer.writeUint32BE(fileOffset, offset);
        offset += 4;

        // write file length
        buffer.writeUint32BE(file.length, offset);
        offset += 4;

        // write file
        fs.readFileSync(file.path).copy(buffer, fileOffset);

        fileDataOffset += file.length;
    }

    return buffer;
}