"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPuppeteer = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const events_1 = require("events");
const installPuppeteer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheDirectory = (0, path_1.join)(process.cwd(), '.cache', 'puppeteer');
        // Check if Puppeteer is already installed in the cache directory
        if ((0, fs_1.existsSync)(cacheDirectory)) {
            console.log('Puppeteer is already installed.');
            return;
        }
        // If not installed, fork the install.js script and wait for it to close
        const child = (0, child_process_1.fork)(require.resolve('puppeteer/install.mjs'));
        // Wait for the 'close' event on the child process
        yield (0, events_1.once)(child, 'close');
        console.log('Puppeteer installation completed successfully.');
    }
    catch (error) {
        console.error('Error installing Puppeteer:', error);
        throw error; // Propagate the error to the caller
    }
});
exports.installPuppeteer = installPuppeteer;
