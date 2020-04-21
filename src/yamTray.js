'use strict';

const path = require('path');
const { app, Tray, Menu } = require('electron');
const store = require('./store');

class YamTray {
    constructor(win, player) {
        this.win = win;
        this.player = player;
    }

    build() {
        if(!this.tray && store.get('settings.tray')) {
            this.makeTray();
        }

        this.subscribeEvents();
    }

    subscribeEvents() {
        store.onDidChange('settings.tray', (val) => {
            if(val) {
                this.makeTray();
            } else {
                this.tray.destroy();
                this.tray = null;
                app.dock.show();
            }
        });

        this.player.on('EVENT_VOLUME', () => {
            if(this.tray) {
                let playerVolume = Math.round(this.player.currentVolume() * 100);
                this.tray.setTitle(playerVolume.toString()+'%');

                setTimeout((current) => {
                    if(current === this.player.currentVolume()) {
                        this.tray.setTitle('');
                    }
                }, 500, this.player.currentVolume());
            }
        });

        this.win.on('hide', () => {
            if(this.tray) {
                this.tray.setContextMenu(this.getTrayStructure());
            }
        });

        this.win.on('show', () => {
            if(this.tray) {
                this.tray.setContextMenu(this.getTrayStructure());
            }
        });
    }

    makeTray() {
        const icon = process.env.DEV ? path.join(__dirname, '..', 'build', 'tray.png') : path.join(process.resourcesPath, "tray.png");

        this.tray = new Tray(icon);
        this.tray.setContextMenu(this.getTrayStructure());
    }

    getTrayStructure() {
        return Menu.buildFromTemplate([
            {
                label: this.win.isVisible() ? 'Hide' : 'Show',
                click: () => {
                    if(this.win.isVisible()) {
                        this.win.hide();
                        if(store.get('settings.tray')) {
                            app.dock.hide();
                        }
                    } else {
                        this.win.show();
                        app.dock.show();
                    }
                },
                accelerator: "CommandOrControl+Shift+Option+H",
            },
            { type: 'separator' },
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
                label: '🔇 Mute',
                click: this.player.mute,
                accelerator: "CommandOrControl+Shift+Option+K",
            },
            {
                label: '🔉 Volume down',
                click: this.player.volumeDown,
                accelerator: "CommandOrControl+Shift+Option+J",
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: function(){
                    app.isQuiting = true;
                    app.quit();
                },
                accelerator: "CommandOrControl+Q",
            }
        ]);

    }

    setVolumeTitle() {
        let volume = this.player.currentVolume();
        console.log(volume);
        if(volume !== null) {
            this.tray.setTitle(Math.floor(volume * 100).toString());
        }
    }
}

module.exports.YamTray = YamTray;
