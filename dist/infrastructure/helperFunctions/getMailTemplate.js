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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceAndGetPath = exports.getMovieSuccessMailTemplate = exports.getOTPTemplate = void 0;
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const console_1 = require("console");
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = require("fs");
const uuid_1 = require("uuid");
function getOTPTemplate(otp) {
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
    `;
}
exports.getOTPTemplate = getOTPTemplate;
function getMovieSuccessMailTemplate(ticket) {
    return __awaiter(this, void 0, void 0, function* () {
        const templateData = { ticket };
        const templatePath = path_1.default.join(__dirname, '../templates/mail/bookingSuccess.ejs');
        (0, console_1.log)(templatePath, 'template path');
        const renderedTemplate = ejs_1.default.renderFile(templatePath, templateData);
        return yield renderedTemplate;
    });
}
exports.getMovieSuccessMailTemplate = getMovieSuccessMailTemplate;
function generateInvoiceAndGetPath(ticket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Render the invoice.ejs template with ticket data
            const templatePath = path_1.default.join(__dirname, '../templates/pdf/invoice.ejs'); // Replace with the actual path
            const templateContent = yield fs_1.promises.readFile(templatePath, 'utf-8');
            const renderedHtml = ejs_1.default.render(templateContent, { ticket });
            const uuid = (0, uuid_1.v4)();
            (0, console_1.log)(uuid, 'generated uuid using uuidv4()');
            // Create a temporary HTML file to load in Puppeteer
            const tempHtmlDir = path_1.default.join(__dirname, '../templates/temp/html');
            const tempHtmlPath = path_1.default.join(tempHtmlDir, `invoice-${uuid}.html`);
            // Ensure the directory exists
            yield fs_1.promises.mkdir(tempHtmlDir, { recursive: true });
            yield fs_1.promises.writeFile(tempHtmlPath, renderedHtml);
            // Configure Puppeteer
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            (0, console_1.log)(page, 'browser page from puppeteer');
            // Load the HTML file
            yield page.goto(`file://${tempHtmlPath}`, { waitUntil: 'domcontentloaded' });
            // Wait for the image to load using a function
            const imageSelector = 'img[src^="https://image.tmdb.org"]';
            yield page.waitForFunction((selector) => {
                const img = document.querySelector(selector);
                return img && img.complete && img.naturalWidth > 0;
            }, {}, imageSelector);
            // Generate PDF
            const pdfDir = path_1.default.join(__dirname, '../templates/temp/pdf');
            yield fs_1.promises.mkdir(pdfDir, { recursive: true });
            const pdfPath = path_1.default.join(pdfDir, `invoice-${uuid}.pdf`); // Replace with your desired output directory
            yield page.pdf({ path: pdfPath, format: 'A4' });
            // Close Puppeteer
            yield browser.close();
            // Return the path to the generated PDF
            return pdfPath;
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    });
}
exports.generateInvoiceAndGetPath = generateInvoiceAndGetPath;
