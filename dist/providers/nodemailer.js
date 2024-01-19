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
exports.MailSender = void 0;
const console_1 = require("console");
const mailTransporter_1 = require("../infrastructure/config/mailTransporter");
const getMailTemplate_1 = require("../infrastructure/helperFunctions/getMailTemplate");
const fs_1 = __importDefault(require("fs"));
class MailSender {
    sendOTP(email, otp) {
        const template = (0, getMailTemplate_1.getOTPTemplate)(otp);
        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "CineSnap Verification",
            html: template
        };
        mailTransporter_1.mailTransporter.sendMail(details, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
    sendBookingSuccessMail(email, ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTemplate = yield (0, getMailTemplate_1.getMovieSuccessMailTemplate)(ticket);
            // Assuming you've generated the PDF and saved it on your server
            const pdfPath = yield (0, getMailTemplate_1.generateInvoiceAndGetPath)(ticket);
            // Read the PDF file as a buffer
            const pdfBuffer = fs_1.default.readFileSync(pdfPath);
            const details = {
                from: process.env.EMAIL,
                to: email,
                subject: "Movie Booking Success",
                html: mailTemplate,
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                        contentType: 'application/pdf', // Set the content type for the attachment
                    },
                ]
            };
            mailTransporter_1.mailTransporter.sendMail(details, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        });
    }
    invoiceDownloadMail(email, ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTemplate = yield (0, getMailTemplate_1.getMovieSuccessMailTemplate)(ticket);
            // Assuming you've generated the PDF and saved it on your server
            const pdfPath = yield (0, getMailTemplate_1.generateInvoiceAndGetPath)(ticket);
            // Read the PDF file as a buffer
            const pdfBuffer = fs_1.default.readFileSync(pdfPath);
            const details = {
                from: process.env.EMAIL,
                to: email,
                subject: "Invoice",
                html: mailTemplate,
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                        contentType: 'application/pdf', // Set the content type for the attachment
                    },
                ]
            };
            (0, console_1.log)('details added with attachment , sending mail');
            mailTransporter_1.mailTransporter.sendMail(details, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        });
    }
}
exports.MailSender = MailSender;
