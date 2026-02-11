"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Rudratic HR System API is running', timestamp: new Date() });
});
app.get('/api', (req, res) => {
    res.json({
        status: 'Operational',
        version: '1.0.0-GA',
        latency: 'minimal',
        compression: 'enabled'
    });
});
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const timeEntry_routes_1 = __importDefault(require("./routes/timeEntry.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const holiday_routes_1 = __importDefault(require("./routes/holiday.routes"));
const leave_routes_1 = __importDefault(require("./routes/leave.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const announcement_routes_1 = __importDefault(require("./routes/announcement.routes"));
const ticket_routes_1 = __importDefault(require("./routes/ticket.routes"));
const calendar_routes_1 = __importDefault(require("./routes/calendar.routes"));
const kudos_routes_1 = __importDefault(require("./routes/kudos.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const cron_service_1 = require("./services/cron.service");
// Initialize Scheduled Tasks
(0, cron_service_1.initCronJobs)();
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/holidays', holiday_routes_1.default);
app.use('/api/leaves', leave_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/time', timeEntry_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/announcements', announcement_routes_1.default);
app.use('/api/tickets', ticket_routes_1.default);
app.use('/api/calendar', calendar_routes_1.default);
app.use('/api/kudos', kudos_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
exports.default = app;
