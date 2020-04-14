'use strict';

const { globalShortcut, dialog, app } = require('electron');

class ShortcutManager {
    constructor(win, player) {
        this.win = win;
        this.player = player;
    }

    bindKeys(){
        if(!this.registerEvents()) {
            dialog.showMessageBox({
                    type: 'warning',
                    buttons: ['Try again', 'Disable'],
                    title: 'Cannot bing OS shortcuts',
                    message: 'Cannot bind global OS shortcuts',
                    detail: 'Please enable Accessibility:\nSystem Preferences -> Security & Privacy -> Accessibility -> Set checkbox "YaM"',
                }).then((response) => {
                switch (response.response) {
                    case 0:
                        this.bindKeys();
                        break;
                    case 1:
                        // Nothing to do
                        break;
                }
            })
        }
    }

    registerEvents() {
        const bindings = {
            'MediaPlayPause': this.player.play,
            'MediaNextTrack': this.player.next,
            'MediaPreviousTrack': this.player.prev,
            'CommandOrControl+Shift+Option+L': this.player.volumeUp,
            'CommandOrControl+Shift+Option+J': this.player.volumeDown,
            'CommandOrControl+Shift+Option+K': this.player.volumeMute,
            'CommandOrControl+Shift+Option+H': () => {
                if(this.win.isVisible()) {
                    app.dock.hide();
                    this.win.hide();
                } else {
                    app.dock.show();
                    this.win.show();
                }
            }
        };

        let result = true;
        for (let key in bindings) {
            result = result && globalShortcut.register(key, bindings[key]);
        }

        return result;
    }
}

module.exports.ShortcutManager = ShortcutManager;
