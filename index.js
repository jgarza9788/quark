const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron; 
const path = require('path');

let mainWindow;

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

	// const mainMenu = Menu.buildFromTemplate(menuTemplate);
	// Menu.setApplicationMenu(mainMenu);

});