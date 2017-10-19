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
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'out')

  console.log(outPath);

  return Promise.resolve({
    appDirectory: path.join(outPath, 'quark-win32-ia32/'),
    authors: 'Justin Garza',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'quark.exe',
    setupExe: 'quark_Installer.exe',
    setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico')
  })
}

/*
const ChildProcess = require('child_process')
const path = require('path')

const metadata = require('../package')

const command = path.join(__dirname, '..', 'node_modules', '.bin', 'electron-windows-store.cmd')
const args = [
  '--input-directory',
  path.join(__dirname, '..', 'out', 'quark-win32-ia32'),
  '--output-directory',
  path.join(__dirname, '..', 'out', 'windows-store'),
  '--flatten',
  true,
  '--package-version',
  metadata.version + '.0',
  '--package-name',
  metadata.name,
  '--package-display-name',
  metadata.productName,
  '--assets',
  path.join(__dirname, '..', 'assets', 'tiles'),
  '--package-description',
  metadata.description
]

const windowsStore = ChildProcess.spawn(command, args, {stdio: 'inherit'})
windowsStore.on('close', (code) => {
  process.exit(code)
})
*/