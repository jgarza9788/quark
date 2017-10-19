#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
     .then(createWindowsInstaller)
     .catch((error) => {
     console.error(error.message || error)
     process.exit(1)
 })

function getInstallerConfig () {
    console.log('creating windows installer')
    // const rootPath = path.join('./')
    // const outPath = path.join(rootPath, 'release-builds')
    const rootPath = path.join(__dirname, '..')
    const outPath = path.join(rootPath, 'out')

    // console.log(path.join(rootPath, 'assets', 'app-icons', 'win', 'app.ico'))

    //https://github.com/electron/windows-installer
    return Promise.resolve({
      appDirectory: path.join(outPath, 'quark-win32-ia32'),
      authors: 'Justin Garza',
      noMsi: true,
      outputDirectory: path.join(outPath, 'windows-installer'),
      exe: 'quark.exe',
      setupExe: 'Quark_Installer.exe',
      setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico')
   })
}
