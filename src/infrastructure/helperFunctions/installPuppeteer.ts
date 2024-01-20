import { join } from "path";
import { fork } from "child_process";
import { existsSync } from 'fs';
import { once } from 'events';

export const installPuppeteer = async (): Promise<void> => {
  try {
    const cacheDirectory = join(process.cwd(), '.cache', 'puppeteer');

    // Check if Puppeteer is already installed in the cache directory
    if (existsSync(cacheDirectory)) {
      console.log('Puppeteer is already installed.');
      return;
    }

    // If not installed, fork the install.js script and wait for it to close
    const child = fork(require.resolve('puppeteer/install.mjs'));

    // Wait for the 'close' event on the child process
    await once(child, 'close');

    console.log('Puppeteer installation completed successfully.');
  } catch (error) {
    console.error('Error installing Puppeteer:', error);
    throw error; // Propagate the error to the caller
  }
};
