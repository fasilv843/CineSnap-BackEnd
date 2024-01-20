import path from "path";
import ejs from 'ejs'
import { ITicketRes } from "../../interfaces/schema/ticketSchema";
import { log } from "console";
import puppeteer from "puppeteer";
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid';
import { installPuppeteer } from "./installPuppeteer";

export function getOTPTemplate (otp: number): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>One-Time Password (OTP)</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center;">One-Time Password (OTP) for Verification</h2>
        <p>Dear User,</p>
        <p>Your one-time password (OTP) for verification is:</p>
        <h1 style="text-align: center; font-size: 36px; padding: 20px; background-color: #f2f2f2; border-radius: 5px;">${otp}</h1>
        <p>Please use this OTP to complete your verification process.</p>
        <p>This OTP is valid for a single use and will expire after a short period of time.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Thank you,</p>
        <p>CineSnap</p>
    </body>
    </html>
    `
}

export async function getMovieSuccessMailTemplate (ticket: ITicketRes): Promise<string> {
    const templateData = { ticket };
    const templatePath = path.join(__dirname, '../templates/mail/bookingSuccess.ejs');
    log(templatePath, 'template path')
    const renderedTemplate = ejs.renderFile(templatePath, templateData);
    return await renderedTemplate;
}

export async function generateInvoiceAndGetPath (ticket: ITicketRes): Promise<string> {
    try {
        // Render the invoice.ejs template with ticket data
        const templatePath = path.join(__dirname, '../templates/pdf/invoice.ejs'); // Replace with the actual path
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const renderedHtml = ejs.render(templateContent, { ticket });

        await installPuppeteer() // Check first on localhost 

        const uuid = uuidv4()
        log(uuid, 'generated uuid using uuidv4()')

        // Create a temporary HTML file to load in Puppeteer
        const tempHtmlDir = path.join(__dirname, '../templates/temp/html');
        const tempHtmlPath = path.join(tempHtmlDir, `invoice-${uuid}.html`);

        // Ensure the directory exists
        await fs.mkdir(tempHtmlDir, { recursive: true });

        await fs.writeFile(tempHtmlPath, renderedHtml);
    
        // Configure Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        log(page, 'browser page from puppeteer')
    
        // Load the HTML file
        await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'domcontentloaded' });

        // Wait for the image to load using a function
        const imageSelector = 'img[src^="https://image.tmdb.org"]';
        await page.waitForFunction(
            (selector) => {
                const img = document.querySelector(selector) as HTMLImageElement | null
                return img && img.complete && img.naturalWidth > 0;
            },
            {},
            imageSelector
        );
        
        // Generate PDF
        const pdfDir = path.join(__dirname, '../templates/temp/pdf');
        await fs.mkdir(pdfDir, { recursive: true });
        const pdfPath = path.join(pdfDir, `invoice-${uuid}.pdf`); // Replace with your desired output directory
        await page.pdf({ path: pdfPath, format: 'A4' });
    
        // Close Puppeteer
        await browser.close();
    
        // Return the path to the generated PDF
        return pdfPath;
      } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
      }
}