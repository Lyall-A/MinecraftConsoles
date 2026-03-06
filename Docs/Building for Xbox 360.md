# Building for Xbox 360 (TODO)
do not read this!

XboxMedia should look something like this:
```
XboxMedia
    XZP
        Minecraft.xzp
        TMSFiles.xzp
    584111F70AAAAAAA
    AvatarAwards
    4J_strings.h
    strings.h
```

## Method 1: Extracting from a existing release
You can get most required files by extracting the files from a full release of the game

You need:
* Base game
* Title Update (preferably TU18 as that is the closest version to the source code)
* [Horizon](https://www.wemod.com/horizon)
* [XEXTool](https://digiex.net/threads/xextool-6-3-download.9523/)

Open the base game in Horizon and extract `/default.xex`, `/AvatarAwards` and `/584111F70AAAAAAA`

Open the title update in Horizon and extract `/default.xexp` and `/res/TMS/TMSFiles.xzp`

Patch the XEX with `xextool.exe -p <path_to_xexp> <path_to_xex>`

Extract the XEX with `xextool.exe -d <path_to_output> <path_to_xex>`

Rename the `media` file from the extracted XEX to `Minecraft.xzp`

## Method 2: Copying files from source
Some required files can be retrieved from other places in the source, it is currently unknown whether some of the files are different revisions than they should be or not

Run the `create-xboxmedia.js` script with Node to get this