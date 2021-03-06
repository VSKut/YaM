const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;
delete window.module;

if (process.env.NODE_ENV === 'test') {
    window.electronRequire = require;
}

window.onready = function(){
    externalAPI.on(externalAPI.EVENT_READY, () => {
        ipcRenderer.send('EVENT_READY', null);
    });

    externalAPI.on(externalAPI.EVENT_TRACK, () => {
        ipcRenderer.send('EVENT_TRACK', null);
    });

    externalAPI.on(externalAPI.EVENT_STATE, () => {
        ipcRenderer.send('EVENT_STATE', null);
    });

    externalAPI.on(externalAPI.EVENT_CONTROLS, () => {
        ipcRenderer.send('EVENT_CONTROLS', null);
    });

    externalAPI.on(externalAPI.EVENT_PROGRESS, () => {
        ipcRenderer.send('EVENT_PROGRESS', null);
    });

    externalAPI.on(externalAPI.EVENT_VOLUME, () => {
        ipcRenderer.send('EVENT_VOLUME', null);
    });

    externalAPI.on(externalAPI.EVENT_TRACKS_LIST, () => {
        ipcRenderer.send('EVENT_TRACKS_LIST', null);
    });

    externalAPI.on(externalAPI.EVENT_ADVERT, (arg) => {
        ipcRenderer.send('EVENT_ADVERT', arg);
    });
};
