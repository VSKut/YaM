'use strict';

const { app } = require('electron');

class YamDock {
    constructor(player) {
        this.player = player;
    }

    build() {
        this.subscribeEvents();
    }

    subscribeEvents() {
        this.player.on('EVENT_TRACK', () => {
            if(!app.dock.isVisible()) {
                return;
            }

            const track = this.player.currentTrack();
            if(!this.player.hasCurrentTrack() || !this.player.state.progress || !this.player.state.progress.loaded || !this.player.hasCurrentTrackList()) {
                app.dock.setBadge('');
                return;
            }

            app.dock.setBadge('0:00'+' - '+this.formatSeconds(Math.floor(track.duration)));
        });

        this.player.on('EVENT_PROGRESS', () => {
            if(!app.dock.isVisible()) {
                return;
            }

            if(this.player.state.progress.duration) {
                app.dock.setBadge(this.formatSeconds(Math.floor(this.player.state.progress.position))+' - '+this.formatSeconds(Math.floor(this.player.state.progress.duration)));
            }
        });
    }

    formatSeconds(s) {
        return (s-(s%=60))/60+(9<s?':':':0')+s;
    }
}

module.exports.YamDock = YamDock;