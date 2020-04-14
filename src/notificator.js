'use strict';

const { Notification } = require('electron');
const Store = require('electron-store');
const store = new Store();

class Notificator {
    constructor(player) {
        this.player = player;
    }

    build() {
        this.subscribeEvents();
    }

    subscribeEvents() {
        this.player.on('EVENT_TRACK', () => {
            const track = this.player.currentTrack();
            if(!track) {
                return false;
            }

            if(store.get('settings.notifications') && this.player.isPlaying() && Notification.isSupported()) {
                const artists = track.artists.map((item) => {
                    return item.title;
                }).join(', ');

                let secFormat = (s) => (s-(s%=60))/60+(9<s?':':':0')+s;

                const notification = new Notification({
                    title: track.title,
                    subtitle: artists,
                    body: secFormat(Math.ceil(track.duration)),
                    // icon: 'https://'+this.player.getCoverLink(),
                    silent: true,
                });

                notification.show();
            }

        });
    }
}

module.exports.Notificator = Notificator;