import * as net from 'net';
import * as os from 'os';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
//import { parseString } from 'xml2js';
import { htonl, ntohl } from 'network-byte-order';

import * as NES from 'node-expose-sspi-strict';

let nes: typeof NES;
if (os.platform() == "win32") {
	nes = require('node-expose-sspi-strict');
}

// This class was based on the following implementation:
// https://github.com/S0urceror/DeZog/blob/master/src/remotes/openmsx/openmsxremote.ts
export class OpenmsxConnector {
	openmsx: net.Socket;
	pid: number;
	connected: boolean;

	constructor(pid: number) {
		this.pid = pid;
		this.connected = false;
	}

	async connect(): Promise<void> {
		try {
			this.openmsx = await this.connectOpenMSX();
			this.connected = true;
		} catch (error) {
			return;
		}

		this.openmsx.on('timeout', () => {
		});
		this.openmsx.on('error', err => {
		});
		this.openmsx.on('close', () => {
			this.connected = false;
		});
		this.openmsx.on('data', data => {
//			this.handleOpenMSXResponse(data);
		});

		if (os.platform() == "win32") {
			await this.authorize();
		}

		this.openmsx.write("<openmsx-control>");
	}

	sendCommand(cmd: string) {
		this.openmsx.write("<command>" + cmd + "</command>");
	}

	disconnect() {
		if (this.connected) {
			this.openmsx.destroy();
			this.connected = false;
		}
	}

	private async connectOpenMSX(): Promise<net.Socket> {
		return new Promise<net.Socket>(async (resolve, reject) => {
			try {
				let username: string;
				if (os.platform() == 'win32') {
					username = 'default';
				} else {
					username = os.userInfo().username;
				}

				let folder = path.join(os.tmpdir(), 'openmsx-' + username);
				const readDir = util.promisify(fs.readdir);
				const filenames = await readDir(folder);
				if (filenames.length == 0) {
					reject(new Error(`OpenMSX not running`));
				}

				var socketpath: string = path.join(folder, 'socket.' + this.pid);
				if (os.platform() != 'win32') {
					const client = net.createConnection(socketpath);
					var timer = setTimeout(function () {
						client.destroy();
						reject(new Error(`Timeout connecting to OpenMSX`));
					}, 15000);
					client.on('connect', () => {
						clearTimeout(timer);
						resolve(client);
					})
					client.on('error', (err: Error) => {
						try {
							fs.unlinkSync(socketpath);
						} catch (er) {
							//ignore
						}
					})
				} else {
					let ports: Buffer = fs.readFileSync(socketpath);
					let port = Number.parseInt(ports.toString());
					const client = net.createConnection(port);
					var timer = setTimeout(function () {
						client.destroy();
						reject(new Error(`Timeout connecting to OpenMSX:${port}`));
					}, 15000);
					client.on('connect', () => {
						clearTimeout(timer);
						resolve(client);
					})
					client.on('error', (err: Error) => {
						try {
							fs.unlinkSync(socketpath);
						} catch (er) {
							//ignore
						}
					})
				}
			} catch {
				reject(new Error("Error connecting to OpenMSX"));
			}
		});
	}
/*
	private async parse(str: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			parseString(str, (error: any, result: any) => {
				if (error) reject(error);
				else resolve(result);
			});
		});
	}
*/
	private async waitResponse(): Promise<ArrayBuffer> {
		return new Promise<ArrayBuffer>(async (resolve, reject) => {
			this.openmsx.once('readable', () => {
				let buflen: Buffer;
				while (null == (buflen = this.openmsx.read(4))) { };
				let len: number = ntohl(buflen, 0);
				let chunk: Buffer;
				while (null == (chunk = this.openmsx.read(len))) { };
				if (len != chunk.byteLength)
					reject(new Error(`Not the expected length ${len}:${chunk.byteLength}`));
				resolve(chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength));
			});
		})
	}

	private async authorize(): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {

			const credInput = {
				packageName: 'Negotiate',
				credentialUse: 'SECPKG_CRED_OUTBOUND' as NES.CredentialUseFlag,
			} as NES.AcquireCredHandleInput;

			const clientCred = nes.sspi.AcquireCredentialsHandle(credInput);
			const packageInfo = nes.sspi.QuerySecurityPackageInfo("Negotiate");

			///////////////////////////////////////////////
			// CHALLENGE
			var input: NES.InitializeSecurityContextInput = {
				credential: clientCred.credential,
				targetName: "",
				cbMaxToken: packageInfo.cbMaxToken
			};
			let clientSecurityContext = nes.sspi.InitializeSecurityContext(input);
			if (clientSecurityContext.SECURITY_STATUS !== 'SEC_I_CONTINUE_NEEDED') {
				throw new Error("Authentication error");
			}
			let len: number = clientSecurityContext.SecBufferDesc.buffers[0].byteLength;
			var blen: Uint8Array = new Uint8Array(4);
			htonl(blen, 0, len);
			let buffer: Uint8Array = new Uint8Array(clientSecurityContext.SecBufferDesc.buffers[0]);

			this.openmsx.write(blen);
			this.openmsx.write(buffer);
			let response: ArrayBuffer;
			try {
				response = await this.waitResponse();
			} catch (error) {
				reject(error);
				return;
			}

			////////////////////////////////////////////////
			// RESPONSE
			input = {
				credential: clientCred.credential,
				targetName: "",
				serverSecurityContext: {
					SecBufferDesc: {
						ulVersion: 0,
						buffers: [response],
					},
				},
				cbMaxToken: packageInfo.cbMaxToken,
				contextHandle: clientSecurityContext.contextHandle,
				targetDataRep: 'SECURITY_NETWORK_DREP',
			};
			clientSecurityContext = nes.sspi.InitializeSecurityContext(input);

			len = clientSecurityContext.SecBufferDesc.buffers[0].byteLength;
			var blen: Uint8Array = new Uint8Array(4);
			htonl(blen, 0, len);
			buffer = new Uint8Array(clientSecurityContext.SecBufferDesc.buffers[0]);

			this.openmsx.write(blen);
			this.openmsx.write(buffer);

			try {
				response = await this.waitResponse();
			} catch (error) {
				reject(error);
				return;
			}
			resolve(true);
		});
	}
/*
	private async handleOpenMSXResponse(data: Buffer) {
		let str: string = data.toString();
		if (str.indexOf("<openmsx-output>") == 0) {
		} else {
			if (str.indexOf("<openmsx>") == 0) {
				let v: any = await this.parse(`<openmsx>${str}</openmsx>`);
				if (v.openmsx.reply != undefined) {
					for (let r of v.openmsx.reply) {
					}
				}
				if (v.openmsx.update != undefined) {
					for (let u of v.openmsx.update) {
					}
				}
			}
		}
	}
*/
}
