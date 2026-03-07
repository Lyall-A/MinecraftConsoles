# MinecraftConsoles
Minecraft Console Legacy Edition source code with some scripts and patches. This repository doesn't include the source code itself.

See [Docs](/Docs) for steps on how to build

See [Scripts](/Scripts) for various scripts that could be useful for development

## Setting up source
Copy the original source code to `Scripts`, then run the `Apply-Patches.sh` script (can be run in Git Bash)

## Contributing
This is a bit annoying

Create a new branch, commit the patched source code, modify the code, Run `Create-Patch.sh <name_of_patch> <source_commit_id>` with `source_commit_id` being the commit ID that added the source code

After making changes and creating patch files, switch branch (which should keep the patch files) and then create a PR

You can also do it your own way, as long as the source code isnt pushed
