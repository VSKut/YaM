[![Build Status](https://travis-ci.org/vskut/YaM.svg?branch=master)](https://travis-ci.org/vskut/YaM)

# YaM - Yandex.Music client for macOS
<img width="128" alt="yam_main" src="https://user-images.githubusercontent.com/1468809/79557851-f8ca6c80-80ab-11ea-9c5e-c0c50618d34b.png">

## Description
This is a client for the <b>Yandex.Music</b> service written using <b>Electron</b> specifically for <b>macOS</b>.

Support for <b>[Touchbar](#touchbar)</b>, <b>[Global shortcuts](#global-shortcuts)</b>, <b>[Tray](#tray)</b> and <b>System notifications</b>

### Main window
<img alt="yam_main" src="https://user-images.githubusercontent.com/1468809/79513409-6b0b6480-804c-11ea-9686-bbcc53325ca2.png">

### Menu
<img width="342" alt="menu_1" src="https://user-images.githubusercontent.com/1468809/79513399-6646b080-804c-11ea-9066-3fd9bf1b393c.png">
<img width="375" alt="menu_2" src="https://user-images.githubusercontent.com/1468809/79513404-69da3780-804c-11ea-806d-972c226c1a7e.png">

### Tray
<img width="233" alt="tray_1" src="https://user-images.githubusercontent.com/1468809/79513406-6a72ce00-804c-11ea-8786-7736642cbf52.png">

### Touchbar
``Main panel``
<img width="1085" alt="touchbar_main" src="https://user-images.githubusercontent.com/1468809/79512302-d3a51200-8049-11ea-916a-8c1d9ef2c096.png">
``In-app sound panel``
<img width="1085" alt="tauchbar_sound_1" src="https://user-images.githubusercontent.com/1468809/79512296-d1db4e80-8049-11ea-83c9-ad9ba6af12f8.png">
<img width="1085" alt="tauchbar_sound_2" src="https://user-images.githubusercontent.com/1468809/79512297-d273e500-8049-11ea-96c0-45ccbabaddc0.png">
``Track panel``
<img width="1085" alt="tauchbar_track" src="https://user-images.githubusercontent.com/1468809/79512300-d30c7b80-8049-11ea-9ab2-20a950e7b6ca.png">
``Track list panel``
<img width="1085" alt="tauchbar_list" src="https://user-images.githubusercontent.com/1468809/79512294-cf78f480-8049-11ea-82a9-911abe4dff18.png">

### Global shortcuts
- In-app <b>volume UP</b> - ``CMD+OPT+SHIFT+L``
- In-app <b>volume DOWN</b> - ``CMD+OPT+SHIFT+K``
- In-app <b>volume MUTE</b> - ``CMD+OPT+SHIFT+J``
- <b>Show/Hide app</b> - ``CMD+OPT+SHIFT+H``

## Install

### From source
1. Clone this repo
```
git clone git@github.com:vskut/YaM.git
cd YaM
```

2. Install dependencies
```
npm i
```

3. Build
```
npm run dist
```

4. Run binary/installer from ./dist/


NOTE: On MacOS X for global shortcuts binding you must grant access to YaM in `System Preferences -> Security -> Accessibility`
