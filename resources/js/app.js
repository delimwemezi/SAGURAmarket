import './bootstrap';

const routes = {
    '/':          renderHomePage,
    '/login':     renderLoginPage,
    '/register':  renderRegisterPage,   // <-- new
    '/dashboard': renderDashboard,
    '/super-admin': renderSuperAdmin,
};