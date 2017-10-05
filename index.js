const electron = require('electron');
const {app, BrowserWindow,Menu, ipcMain} = electron; 
const path = require('path');

let mainWindow;
let scoresWindow;
let instructionsWindow;

app.on('ready',()=>
{
	//console.log('app is ready');

	mainWindow = new BrowserWindow({
		width: 300,
		height: 700,
		resizable: false,
	});
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	mainWindow.on('closed',()=>app.quit());
	mainWindow.on('blur', function () { mainWindow.webContents.send('playpause', ""); })

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	console.log("set state to start");
	mainWindow.webContents.send('newState',"start");

});


let menuTemplate = 
[
	{
	label: 'File',
	submenu:
	[
		{
			label: 'Quit',
			accelerator: 'CmdOrCtrl+Q',
			click() {app.quit();}
		}
	]
	},
	{
	label: 'Window',
	submenu:
	[
		{
			label: 'Scores',
			accelerator: 'S',
			click() {app.quit();}
		},
		{
			label: 'Instructions',
			accelerator: 'I',
			click() {app.quit();}
		}
	]
	},
	{
		label: 'Misc',
		submenu:
		[
			{
				label: 'Play/Pause',
				accelerator: 'P',
				click() {mainWindow.webContents.send('playpause', "");}
			},
			{
				label: 'Donate',
				accelerator: 'D',
				click() {app.quit();}
			}
		]
	}
	,
	{
		label: 'DEVELOPER!',
		submenu: 
		[
			{role:'reload'},
			// {
			// label: 'Reload',
			// accelerator: 'CmdOrCtrl+R',
			// click: function (item, focusedWindow) 
			// 	{
			// 	if (focusedWindow) 
			// 	{
			// 		// on reload, start fresh and close any old
			// 		// open secondary windows
			// 		if (focusedWindow.id === 1) {
			// 		BrowserWindow.getAllWindows().forEach(function (win) {
			// 			if (win.id > 1) {
			// 			win.close()
			// 			}
			// 		})
			// 		}
			// 		focusedWindow.reload()
			// 	}
			// 	}
			// }, 
			{
			label: 'Toggle Full Screen',
			accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
			click: function (item, focusedWindow) 
			{
				if (focusedWindow) 
				{
					focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
				}
			}
			}, 
			{
			label: 'Toggle Developer Tools',
			accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click: function (item, focusedWindow) 
			{
				if (focusedWindow) {
					focusedWindow.toggleDevTools()
				}
			}
			}, 
			{
			type: 'separator'
			}, 
			{
			label: 'About Todo',
			click: function (item, focusedWindow) 
			{
				if (focusedWindow) 
				{
					const options = 
					{
						type: 'info',
						title: 'about Todo',
						buttons: ['Ok'],
						message: 'Just a basic todo app.'
					}
					electron.dialog.showMessageBox(focusedWindow, options, function () {})
				}
			}
		}]
	}
];

//if OSX/macOS
if (process.platform === 'darwin')
{
	//shift menu over by 1
	menuTemplate.unshift({});
}