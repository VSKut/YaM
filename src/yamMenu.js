'use strict';

const { app, Menu } = require('electron');
const store = require('./store');

class YamMenu {
    build() {
        Menu.setApplicationMenu(this.getMenuStructure());
        this.subscribeEvents();
    }

    subscribeEvents() {
        store.onDidChange('settings.notifications', () => {
            Menu.setApplicationMenu(this.getMenuStructure());
        });

        store.onDidChange('settings.tray', () => {
            Menu.setApplicationMenu(this.getMenuStructure());
        });

        store.onDidChange('settings.shortcuts', () => {
            Menu.setApplicationMenu(this.getMenuStructure());
        });
    }

    getMenuStructure() {
        return Menu.buildFromTemplate([
            {
                label: 'YaM',
                submenu: [
                    {
                        label: 'About',
                        role: 'about',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        label:'Quit',
                        click: () => {
                            app.isQuiting = true;
                            app.quit();
                        },
                        accelerator: "CommandOrControl+Q",
                    },
                ],
            },
            {
                label: 'Settings',
                submenu: [
                    {
                        label: store.get('settings.tray') ? 'Hide from tray' : 'Show in tray',
                        click: () => {
                            store.set('settings.tray', !store.get('settings.tray'));
                        },
                    },
                    {
                        label: store.get('settings.notifications') ? 'Disable notifications' : 'Enable notifications',
                        click: () => {
                            store.set('settings.notifications', !store.get('settings.notifications'));
                        },
                    },
                    {
                        label: store.get('settings.shortcuts') ? 'Disable global shortcuts' : 'Enable global shortcuts',
                        click: () => {
                            store.set('settings.shortcuts', !store.get('settings.shortcuts'));
                        },
                    },
                ]
            }
        ]);
    }

}

module.exports.YamMenu = YamMenu;
