# Guide for building Minecraft Legacy Console Edition on Windows

## Prerequisites
* Microsoft Visual Studio 2012
* MinecraftConsoles (both are the same):
  * `mc-console-oct2014.zip` (MD5: 7132eb8132a66b1ca362177afdb06ae0)
  * `minecraft.rar` (MD5: 66ecffa7d23adb20476a4c8c24757692)

## Building
* Open `MinecraftConsoles.sln` in Visual Studio 2012
  * Select "No" if asked to enable source control
* Right click the `Minecraft.Client` in the Solution Explorer and select "Set as StartUp Project"
* Select either `Debug` or `Release` for release type and `Windows64` for platform
  * If building with `Debug`, navigate to `Minecraft.Client > Windows64 > Source Files > Windows64_Minecraft.cpp` and comment out line 480 (`//createDeviceFlags |= D3D11_CREATE_DEVICE_DEBUG;`)
* Press F7 to build the solution
* Click `Local Windows Debugger` to launch the game

## Running the binary directly
By default, running the binary directly will cause a crash, to fix this some files need to be copied to the build directory:
* `Common/res` Required to run
* `Common/Media` Required to run
* `Durango/Sound` For sound
* `music` For music
* `Windows64Media/DLC` Default DLC's
* `Windows64/GameHDD` Random world left in source
* `Windows64/GameConfig` Game configs (maybe different from default?)

There will probably be some unneeded files that can later be deleted (like source files)

## Combining DLC's
DLC's from other platforms can be added by copying their `DLC` folder to `Windows64`
* `DurangoMedia/DLC` Xbox One DLC's
* `PS3Media/DLC` PS3 DLC's
* `PSVitaMedia/DLC` PlayStation Vita DLC's

## Preprocessor Definitions
The Preprocessor Definitions can be found in `Configuration Properties > C/C++ > Preprocessor > Preprocessor Definitions`, this can let you remove/add definitions
* `_DEBUG` Debug
* `_DEBUG_MENUS_ENABLED` In-game debug menu
* `_LARGE_WORLDS` Large worlds (?)
* `_FINAL_BUILD` Final build (?)
* `_CONTENT_PACKAGE` Content package (?)
* `_WINDOWS64` Build for Windows 64
* `_XBOX` Build for Xbox 360 (?)
* `__PS3__` Build for PS3
* `__PSVITA__` Build for PS Vita
* `__ORBIS__` Build for PS4
* `_XBOX_ONE` Build for Xbox One (?)
* `_DURANGO` Build for Xbox One (?)