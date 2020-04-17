'use strict';

const { TouchBar } = require('electron');
const { TouchBarButton, TouchBarSpacer, TouchBarLabel, TouchBarPopover, TouchBarSlider, TouchBarScrubber } = TouchBar;
const nativeImage = require('electron').nativeImage;

class YamTouchBar {
    constructor(player) {
        this.player = player;

        this.images = {
            play: nativeImage.createFromNamedImage('NSTouchBarPlayTemplate', [-1, 0, 1]),
            pause: nativeImage.createFromNamedImage('NSPauseTemplate', [-1, 0, 1]),
            prev: nativeImage.createFromNamedImage('NSTouchBarSkipToStartTemplate', [-1, 0, 1]),
            next: nativeImage.createFromNamedImage('NSTouchBarSkipToEndTemplate', [-1, 0, 1]),
            like: nativeImage.createFromNamedImage('NSTouchBarAddTemplate', [-1, 0, 1]),
            volumeMax: nativeImage.createFromNamedImage('NSTouchBarAudioOutputVolumeHighTemplate', [-1, 0, 1]),
            volumeMid: nativeImage.createFromNamedImage('NSTouchBarAudioOutputVolumeMediumTemplate', [-1, 0, 1]),
            volumeLow: nativeImage.createFromNamedImage('NSTouchBarAudioOutputVolumeLowTemplate', [-1, 0, 1]),
            volumeMin: nativeImage.createFromNamedImage('NSTouchBarAudioOutputVolumeOffTemplate', [-1, 0, 1]),
            mute: nativeImage.createFromNamedImage('NSTouchBarAudioOutputMuteTemplate', [-1, 0, 1]),
        };

        this.colors = {
            purple: '#7851A9',
            blue: '#4f53a9',
            green: '#78ccaa',
            red: '#ff5555',
            gray: '#777',
        };
    }

    build() {
        this.playButton = new TouchBarButton({
            icon: this.images.play,
            backgroundColor: this.colors.green,
            click: this.player.play,
        });

        this.prevButton = new TouchBarButton({
            icon: this.images.prev,
            backgroundColor: this.colors.purple,
            click: this.player.prev,
        });

        this.nextButton = new TouchBarButton({
            icon: this.images.next,
            backgroundColor: this.colors.purple,
            click: this.player.next,
        });

        this.likeButton = new TouchBarButton({
            icon: this.images.like,
            backgroundColor: this.colors.red,
            click: this.player.like,
        });

        this.muteButton = new TouchBarButton({
            icon: this.images.mute,
            click: this.player.mute,
        });

        this.trackLabel = new TouchBarLabel({
            label: '',
        });

        this.volumeSlider = new TouchBarSlider({
            minValue: 0,
            maxValue: 100,
            value: Math.floor(this.player.state.volume * 100),
            change: (volume) => {
                this.player.volumeSet(parseFloat(volume / 100).toFixed(2));
                this.volumeSlider.label = volume.toString();
            }
        });

        this.volumePopover = new TouchBarPopover({
            label: 'Vol',
            items: new TouchBar({
                items: [
                    this.muteButton,
                    this.volumeSlider,
                ],
            }),
        });

        this.trackSlider = new TouchBarSlider({
            label: "0:00 - 0:00",
            minValue: 0,
            maxValue: 0,
            value: 0,
            change: (position) => {
                if (!this.player.hasCurrentTrack()) {
                    return;
                }
                if(!this.player.state.progress.loaded) {
                    this.trackSlider.value = 0;
                    return;
                }
                this.player.setPosition(position);
                this.trackSlider.label = this.formatSeconds(Math.floor(position))+' - '+this.formatSeconds(Math.floor(this.player.state.track.duration));
            }
        });

        this.trackPopover = new TouchBarPopover({
            label: 'Track',
            items: new TouchBar({
                items: [
                    this.playButton,
                    this.prevButton,
                    this.nextButton,
                    this.trackSlider,
                ],
            }),
        });

        this.listScrubber = new TouchBarScrubber({
            items: [],
            selectedStyle: 'outline',
            mode: 'free',
            showArrowButtons: true,
            continuous: false,
            select: (value) => {
                this.player.playByIndex(value)
            }

        });

        this.listPopover = new TouchBarPopover({
            label: 'List',
            items: new TouchBar({
                items: [
                    this.listScrubber,
                ],
            }),
        });

        this.touchBar = new TouchBar({
            items: [
                this.volumePopover,
                this.trackPopover,
                this.listPopover,
                this.playButton,
                new TouchBarSpacer({ size: 'small' }),
                this.trackLabel,
            ],
        });

        this.subscribeEvents();

        return this.touchBar;
    }

    subscribeEvents() {
        this.player.on('EVENT_TRACK', () => {
            const track = this.player.currentTrack();
            if(!this.player.hasCurrentTrack()) {
                this.trackLabel.label = null;
                this.trackSlider.maxValue = 0;
                this.trackSlider.label = '0:00 - 0:00';
                return;
            }

            const artists = track.artists.map((item) => {
                return item.title;
            }).join(', ');

            const trackLabelPre = (!artists && track.album.title) ? track.album.title : artists;

            this.trackLabel.label = [trackLabelPre, track.title].join(' - ');
            this.likeButton.backgroundColor = this.player.isCurrentTrackLiked() ? this.colors.red : this.colors.gray;

            this.trackSlider.maxValue = Math.floor(track.duration);
            this.trackSlider.label = '0:00'+' - '+this.formatSeconds(Math.floor(track.duration));
        });

        this.player.on('EVENT_STATE', () => {
            this.playButton.icon = this.player.isPlaying() ? this.images.pause : this.images.play;
        });

        this.player.on('EVENT_PROGRESS', () => {
            if(this.player.state.progress.duration) {
                this.trackSlider.maxValue = Math.floor(this.player.state.progress.duration);
                this.trackSlider.value = Math.floor(this.player.state.progress.position);
                this.trackSlider.label = this.formatSeconds(Math.floor(this.player.state.progress.position))+' - '+this.formatSeconds(Math.floor(this.player.state.progress.duration));
            }
        });

        this.player.on('EVENT_TRACKS_LIST', () => {
            let trackList = this.player.currentTrackList();
            if(!trackList) {
                this.listScrubber.items = null;
                return;
            }

            const finalTrackList = trackList.slice(0,75).map((item) => {
                const artists =  (item && item.artists) ? item.artists.map((item) => item.title).join(', ') : null;
                const trackLabelPre = (!artists && item.album.title) ? item.album.title : (artists) ? artists : null;
                return { label: [trackLabelPre, item.title].join(' - ') };
            });

            if(JSON.stringify(this.listScrubber.items) !== JSON.stringify(finalTrackList)) {
                this.listScrubber.items = finalTrackList;
            }
        });

        this.player.on('EVENT_VOLUME', () => {
            let playerVolume =  Math.round(this.player.state.volume * 100);
            this.volumeSlider.value = playerVolume;
            this.volumeSlider.label = playerVolume.toString();

            if(this.player.state.volume === 0) {
                this.muteButton.backgroundColor = '#ff5555';
                this.muteButton.icon = this.images.volumeMin;
            } else if(this.player.state.volume > 0 && this.player.state.volume <= 0.33) {
                this.muteButton.backgroundColor = '#ff9994';
                this.muteButton.icon = this.images.volumeLow;
            } else if(this.player.state.volume > 0.33 && this.player.state.volume <= 0.66) {
                this.muteButton.backgroundColor = '#8ccc96';
                this.muteButton.icon = this.images.volumeMid;
            } else if(this.player.state.volume > 0.66) {
                this.muteButton.backgroundColor = '#37cc56';
                this.muteButton.icon = this.images.volumeMax;
            }
        });

        this.player.on('EVENT_CONTROLS', () => {
            this.playButton.backgroundColor = this.player.hasCurrentTrack() ? this.colors.green : this.colors.gray;
            this.prevButton.backgroundColor = this.player.canPrev() ? this.colors.purple : this.colors.gray;
            this.nextButton.backgroundColor = this.player.canNext() ? this.colors.purple : this.colors.gray;
        });
    }

    formatSeconds(s) {
        return (s-(s%=60))/60+(9<s?':':':0')+s;
    }
}

module.exports.YamTouchBar = YamTouchBar;
