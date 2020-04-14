const Store = require('electron-store');

module.exports = new Store({
    migrations: {
        '0.0.1': store => {
            store.set('settings.tray', true);
            store.set('settings.notifications', true);
        }
    }
});