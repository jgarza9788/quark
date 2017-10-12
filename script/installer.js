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

    return Promise.resolve({
      appDirectory: path.join(outPath, 'quark-win32-ia32'),
      authors: 'Justin Garza',
      noMsi: true,
      outputDirectory: path.join(outPath, 'windows-installer'),
      exe: 'Quark.exe',
      setupExe: 'Quark_Installer.exe',
      setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico')
   })
}

/*
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')

const appName = 'Quark'

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  const rootPath = path.join(__dirname, '..')
  const outPath = path.join(rootPath, 'out')

  return Promise.resolve({
    appDirectory: path.join(outPath, appName + '-win32-ia32'),
    exe: appName +'.exe',
    iconUrl: 'https://raw.githubusercontent.com/electron/electron-api-demos/master/assets/app-icon/win/app.ico',
    loadingGif: path.join(rootPath, 'assets', 'img', 'loading.gif'),
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    setupExe: appName + 'Setup.exe',
    setupIcon: path.join(rootPath, 'icons', 'win', 'app.ico'),
    skipUpdateIcon: true
  })
}

function deleteOutputFolder () {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
      error ? reject(error) : resolve()
    })
  })
}
*/
