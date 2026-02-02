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
exports.sendWeeklyReport = exports.sendClockOutReminder = exports.sendWelcomeEmail = exports.sendEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_mock_key');
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.RESEND_API_KEY) {
        console.log(`[MOCK EMAIL] TO: ${to} | SUBJECT: ${subject}`);
        console.log(`[CONTENT]: ${html}`);
        return { id: 'mock-email-id' };
    }
    try {
        const data = yield resend.emails.send({
            from: 'HR System <onboarding@resend.dev>', // Update with verified domain in prod
            to,
            subject,
            html,
        });
        return data;
    }
    catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Welcome to HR Management System';
    const html = `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been created successfully. Please wait for admin approval to access the dashboard.</p>
    `;
    return (0, exports.sendEmail)(email, subject, html);
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendClockOutReminder = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Reminder: Clock Out';
    const html = `
        <p>Hi ${name},</p>
        <p>It's past 7 PM. If you have finished your work, please remember to clock out.</p>
    `;
    return (0, exports.sendEmail)(email, subject, html);
});
exports.sendClockOutReminder = sendClockOutReminder;
const sendWeeklyReport = (email, stats) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Weekly HR Report - ${new Date().toLocaleDateString()}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h1 style="color: #2563eb;">Weekly Workforce Summary</h1>
            <p>Here is the automated summary for the past 7 days:</p>
            <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
                <tr style="background: #f8fafc;">
                    <td>Total Active Employees</td>
                    <td><strong>${stats.totalUsers}</strong></td>
                </tr>
                <tr>
                    <td>Total Hours Logged</td>
                    <td><strong>${stats.totalHours} hrs</strong></td>
                </tr>
                <tr style="background: #f8fafc;">
                    <td>Leave Requests Pending</td>
                    <td><strong>${stats.pendingLeaves}</strong></td>
                </tr>
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
                This satisfies task 5.7 in your Project Tracker.
            </p>
        </div>
    `;
    return (0, exports.sendEmail)(email, subject, html);
});
exports.sendWeeklyReport = sendWeeklyReport;
