'use strict';

const { app, Menu } = require('electron');
const store = require('./store');

const isMac = process.platform === 'darwin';

class YamMenu {
    constructor(player) {
        this.player = player
    }

    build() {
        Menu.setApplicationMenu(this.getMenuStructure());
        this.subscribeEvents();
    }

    subscribeEvents() {
        store.onDidChange('settings.tray', () => {
            Menu.setApplicationMenu(this.getMenuStructure());
        });

        store.onDidChange('settings.notifications', () => {
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
                        role: 'help',
                        submenu: [
                            {
                                label: 'Website',
                                click: async () => await require('electron').shell.openExternal('https://yam.vskut.ru')
                            },
                            {
                                label: 'GitHub',
                                click: async () => await require('electron').shell.openExternal('https://github.com/VSKut/YaM')
                            },
                            {
                                label: 'Telegram',
                                click: async () => await require('electron').shell.openExternal('https://t.me/vskut')
                            },
                            { type: 'separator' },
                            {
                                label: 'Ver. '+app.getVersion(),
                            },
                        ]
                    },
                    { type: 'separator' },
                    {
                        label: 'Hide',
                        role: isMac ? 'close' : 'quit',
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
                label: 'Player',
                submenu: [
                    {
                        label: '⏯ Play/Pause',
                        click: this.player.play,
                    },
                    {
                        label: '⏪ Previous',
                        click: this.player.prev,
                    },
                    {
                        label: '⏩ Next',
                        click: this.player.next,
                    },
                    { type: 'separator' },
                    {
                        label: '🔊 Volume up',
                        click: this.player.volumeUp,
                        accelerator: "CommandOrControl+Shift+Option+L",
                    },
                    {
                        label: '🔉 Volume down',
                        click: this.player.volumeDown,
                        accelerator: "CommandOrControl+Shift+Option+K",
                    },
                    {
                        label: '🔇 Mute',
                        click: this.player.volumeMute,
                        accelerator: "CommandOrControl+Shift+Option+J",
                    },
                ],
            },
            {
                label: 'Settings',
                submenu: [
                    {
                        label: store.get('settings.tray') ? 'Hide from tray' : 'Show in tray',
                        click: () => store.set('settings.tray', !store.get('settings.tray')),
                    },
                    {
                        label: store.get('settings.notifications') ? 'Disable notifications' : 'Enable notifications',
                        click: () => store.set('settings.notifications', !store.get('settings.notifications')),
                    },
                    {
                        label: store.get('settings.shortcuts') ? 'Disable global shortcuts' : 'Enable global shortcuts',
                        click: () => store.set('settings.shortcuts', !store.get('settings.shortcuts')),
                    },
                ]
            },
        ]);
    }

}

module.exports.YamMenu = YamMenu;
