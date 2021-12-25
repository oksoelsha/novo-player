import * as crypto from 'crypto';
import * as fs from 'fs';
import { Stream } from 'stream';
import { FileTypeUtils } from './utils/FileTypeUtils';

export class HashService {

    private smallFileScanBatchSize: any;
    private largeFileScanBatchSize: any;

    constructor() {
        const pLimit = require('p-limit');
        this.smallFileScanBatchSize = pLimit(50);
        this.largeFileScanBatchSize = pLimit(1);
     }

    getSha1Code(filename: string): Promise<any> {
        var sha1: Promise<any>;
        if (fs.statSync(filename)['size'] > 10485760) {
            // any files larger than 10Mb are considered large that we need to send them to the more limited promise batch size
            sha1 = this.largeFileScanBatchSize(() => this.getSha1(filename));
        } else {
            sha1 = this.smallFileScanBatchSize(() => this.getSha1(filename));
        }

        return sha1;
    }

    private getSha1(filename: string): Promise<any> {
        let shasum = crypto.createHash('sha1');
        if (FileTypeUtils.isZip(filename)) {
            const StreamZip = require('node-stream-zip');
            return new Promise<any>((resolve, reject) => {
                let zip = new StreamZip({
                    file: filename,
                    storeEntries: true
                });
                zip.on('error', (err: string) => {
                    return reject(err);
                });
                zip.on('ready', () => {
                    let entries = Object.keys(zip.entries()).map(e => zip.entries()[e]);
                    let msxFileIndex = this.getMSXFileIndexInZip(entries);
                    if (msxFileIndex < entries.length) {
                        zip.stream(entries[msxFileIndex].name, function (err: string, stm: Stream) {
                            stm.on('data', function (data) {
                                shasum.update(data);
                            })
                            stm.on('end', function () {
                                const hash = shasum.digest('hex');
                                zip.close();
                                return resolve({hash: hash, size: entries[msxFileIndex].size, filename: entries[msxFileIndex].name});
                            })
                        })
                    } else {
                        return resolve(null);
                    }
                });
            });
        } else {
            return new Promise<any>((resolve, reject) => {
                let s: fs.ReadStream = fs.createReadStream(filename);
                s.on('data', function (data) {
                    shasum.update(data);
                })
                s.on('end', function () {
                    const hash = shasum.digest('hex');
                    return resolve({hash: hash, size: fs.statSync(filename)['size'], filename: filename});
                })
            });
        }
    }

    private getMSXFileIndexInZip(entries: any): number {
        let index: number;
        for(index = 0; index < entries.length; index++) {
            if (FileTypeUtils.isMSXFile(entries[index].name)) {
                return index;
            }
        }

        return index;
    }
}
