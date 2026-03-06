# Building for Xbox 360 (TODO)
Some stuff needs to be changed to build for Xbox 360

## Prerequisites
* Xbox 360 SDK (full install)
* Patched source code in `/Source`

## Getting XboxMedia
The main reason Xbox 360 builds fail is because of a missing folder at `Minecraft.Client/XboxMedia`

XboxMedia should look like this:
```
XboxMedia
    AvatarAwards
    584111F70AAAAAAA
    strings.h
    4J_strings.h
    XZP
        Minecraft.xzp
        TMSFiles.xzp
```

### Method 1: Generating with script
You will need:
* [XZP Tool](https://digiex.net/threads/xzp-tool-v2-0-browse-edit-xbox-360-zxp-files.15990/)
* [Node.js](https://nodejs.org/en)

Run `node ./Scripts/generate-xboxmedia.js`

Open XZP Tool, select build and set `Build Directory` and `Output Name` to what it shown in the scripts output

### Method 2: Extracting from an existing release (TODO: missing strings.h)
You will need:
* Base game
* Title Update (preferably TU18 as that is the closest version to the source code)
* [Horizon](https://www.wemod.com/horizon)
* [XEXTool](https://digiex.net/threads/xextool-6-3-download.9523/)

Open the base game file in Horizon and extract `/default.xex`, `/AvatarAwards` and `/584111F70AAAAAAA`

Open the title update file in Horizon and extract `/default.xexp` and `/res/TMS/TMSFiles.xzp`

Patch the XEX with `xextool.exe -p <path_to_xexp> <path_to_xex>`

Extract the XEX with `xextool.exe -d <path_to_output> <path_to_xex>`

Rename the `media` file from the extracted XEX to `Minecraft.xzp`

Create the folder `Minecraft.Client/XboxMedia` and copy the extracted files to where they should be

## Building
Once XboxMedia has been acquired, you should be able to successfully build

By default, it will automatically try and deploy to your Xbox 360, and likely fail. You can either cancel the build once it gets to that stage, or go to `Minecraft.Client Properties > Console Deployment > General` and set `Excluded From Build` to Yes

## Running the build
The build does not output all of the files where they need to be

### Method 1: Copying with script
You will need [Node.js](https://nodejs.org/en)

Run `node ./Scripts/generate-xbox-360.js`, this will output the finished build at `Builds/Xbox 360`, which can then be copied to a Xbox 360 or opened in Xenia

### Method 3: Manually copying
Create a new folder where you want the final build to be

Copy files like this:
* `Minecraft.Client/Release/Minecraft.Client.xex`: `/Minecraft.Client.xex`
* `Minecraft.Client/Common/res`: `/res`
* `Minecraft.Client/Common/DummyTexturePack`: `DummyTexturePack`
* `Minecraft.Client/Common/Tutorial/Tutorial`: `/Tutorial/Tutorial`
* `Minecraft.Client/Xbox/kinect/speech`: `/`
* `Minecraft.Client/XboxMedia/AvatarAwards`: `/AvatarAwards`
* `Minecraft.Client/XboxMedia/584111F70AAAAAAA`: `/584111F70AAAAAAA`
* `Minecraft.Client/XboxMedia/XZP/TMSFiles.xzp`: `/TMSFiles.xzp`