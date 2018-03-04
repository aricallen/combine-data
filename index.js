const fs = require('fs');
const shelljs = require('shelljs');

/**
 * get dir name
 * collect data from each
 * remove header row if it exists
 * add header row to new file
 * combine into single csv
 */

const dir = './data';
const headerRow = 'id,symbol,exchangeCode,timestamp,lastPrice,prevPrice,highTrade,lowTrade,volume,btcVolume\n';
const combinedDir = './_combined';

if (fs.existsSync(combinedDir)) {
    shelljs.rm('-rf', combinedDir);
}
shelljs.mkdir(combinedDir);

const subDirs = fs.readdirSync(dir);

subDirs.forEach((subDir) => {
    if (subDir.includes('.DS')) {
        shelljs.rm('-rf', subDir);
        return;
    }

    if (combinedDir.includes(subDir) === true) {
        // dont do anything for combined dir
        return;
    }

    const combinedFilePath = `${combinedDir}/${subDir}.csv`;

    // start fresh
    if (fs.existsSync(combinedFilePath)) {
        fs.unlinkSync(combinedFilePath);
    }

    // get only data files
    const files = fs.readdirSync(`${dir}/${subDir}`);

    // create new file with headerRow
    const combinedFile = fs.writeFileSync(combinedFilePath, headerRow);

    // combine each
    files.forEach((file) => {
        const content = fs.readFileSync(`${dir}/${subDir}/${file}`, { encoding: 'utf8' });
        const cleaned = content
            .replace('undefined', '')
            .replace(headerRow, '');
        fs.appendFileSync(combinedFilePath, cleaned);
    });
});