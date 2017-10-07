const electron = require('electron');
const {app, BrowserWindow,Menu, ipcMain,shell} = electron; 
const path = require('path');

let mainWindow;
let scoresWindow;
let instructionsWindow;

app.on('ready',()=>
{
	//console.log('app is ready');

	mainWindow = new BrowserWindow({
		width: 350,
		height: 800,
		minWidth: 350,
		minHeight: 800,
		// resizable: false,
	});
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	mainWindow.on('closed',()=>app.quit());
	mainWindow.on('blur', function () { mainWindow.webContents.send('playpause', ""); })

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

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
	// {
	// label: 'Window',
	// submenu:
	// [
	// 	{
	// 		label: 'Scores',
	// 		accelerator: 'S',
	// 		click() {app.quit();}
	// 	},
	// 	{
	// 		label: 'Instructions',
	// 		accelerator: 'I',
	// 		click() {app.quit();}
	// 	}
	// ]
	// },
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
				click() { openDonate();}
			}
		]
	}
	,
	{
		label: 'View',
		submenu:
		[
			//TODO: make custom zoom that zoomsin/out and resizes the window
			// {
			// 	label: 'zoomin',
			// 	accelerator: 'CmdOrCtrl+=',
			// 	click() { console.log("++"); }
			// },
			// {
			// 	label: 'zoomout',
			// 	accelerator: 'CmdOrCtrl+-',
			// 	click() { console.log("--"); }
			// }

			{role: 'resetzoom'},
			{role: 'zoomin'},
			{role: 'zoomout'},
		]
	}
];

if (process.env.NODE_ENV !== 'production')
{
	menuTemplate.push
	(	
		{
			label: 'DEVELOPER!',
			submenu: 
			[
				{role:'reload'},
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
				}
			]
		}
	);
}



//if OSX/macOS
if (process.platform === 'darwin')
{
	//shift menu over by 1
	menuTemplate.unshift({});
}


function openDonate()
{
	console.log("openLink");
	shell.openExternal("https://paypal.me/JGarza9788/1", true);
}