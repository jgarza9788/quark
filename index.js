const electron = require('electron');
const {app, BrowserWindow,Menu, ipcMain,shell} = electron; 

const fs = require('fs')
const path = require('path');
const dateFormat = require('dateformat');

const storage = require('electron-json-storage');
var dataPath = '';
const os = require('os');

let mainWindow;
let addScore;
let forceAddScore = false;

var highScores = 
[
{name:' ',score:09},
{name:' ',score:08},
{name:' ',score:07},
{name:' ',score:06},
{name:' ',score:05},
{name:' ',score:04},
{name:' ',score:03},
{name:' ',score:02},
{name:' ',score:01},
{name:' ',score:00}
];


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

	addScore = new BrowserWindow({
		width: 400,
		height: 275,
		resizable: false,
		frame: false,
	});
	addScore.loadURL('file://' + __dirname + '/addScore.html');
	addScore.setMenu(null);

	forceAddScore= true;
	addScore.on('blur', function (event) 
	{
		if (forceAddScore)
		{
			addScore.show();
		}
	});


	mainWindow.on('move', moveAddScore)
	mainWindow.on('resize', moveAddScore)


	function moveAddScore () 
	{
		var mwSize = mainWindow.getSize();
		var pos = mainWindow.getPosition();
		addScore.setPosition(pos[0] + parseInt(mwSize[0]/2) - 200, pos[1] + 50)
	}

	var thisfolder = (process.platform=='win32')?'/AppData/Local/.quark/':'/.quark';
	thisfolder = path.join(os.homedir(),thisfolder);
	console.log(thisfolder);

	if(!fs.existsSync(thisfolder))
	{
		fs.mkdirSync(thisfolder);
	}

	storage.setDataPath(thisfolder);




	// storage.set(  'highScores' , highScores, function(error, data) 
	// {
	// 	if (error) throw error;
	// 	highScores = data.highScores;
	// });

	storage.has('highScores', function(error, hasKey) 
	{
		if (error) throw error;
	  
		if (hasKey) 
		{
		  //NOTHING
			console.log('Has Key');
			storage.getAll(function(error, data) 
			{
				if (error) throw error;
				highScores= data.highScores;
			});
		}
		else
		{
			console.log('No Key');
			storage.set(  'highScores' , highScores, function(error, data) 
			{
				if (error) throw error;
				highScores = data;
			});

			storage.getAll(function(error, data) 
			{
				if (error) throw error;
				highScores= data.highScores;
			});
		}
	  });

	highScores=sort(highScores);

	console.log(highScores);

});

ipcMain.on('addHighScore', function(event, score) 
{
	// highScores[highScores.length] = {name:'_?_',score:score};

	mainWindow.webContents.send("renderScores",highScores);

	console.log("addHighScore: " + score);
	console.log(highScores);

	var isHighScore = false;
	var scorei = 0;

	for(var i = 0 ;i < highScores.length;i++)
	{
		if (score >= highScores[i].score)
		{
			isHighScore= true;
			var temp = highScores[i];
			highScores[i] = {name:'???',score:score};
			scorei = i;

			for (var j = i + 1;j < highScores.length;j++)
			{
				var temp2 = highScores[j];
				highScores[j] = temp;
				temp = temp2;
			}

			i += 100;
		}
	}

	console.log(highScores);
	storage.set(  'highScores' , highScores, null);
	
	if (isHighScore)
	{
		// showAddScore();
		forceAddScore = true;
		addScore.show();
		addScore.webContents.send('openAddScore', {placement:(scorei+1),scorei:scorei,score:score,defaultName:Name});
	}
	
});


// function showAddScore()
// {

// 	if (addScore==null)
// 	{
// 		addScore = new BrowserWindow({
// 			width: 400,
// 			height: 275,
// 			resizable: false,
// 		});
// 		addScore.loadURL('file://' + __dirname + '/addScore.html');
// 		addScore.setMenu(null);
// 		addScore.hide();
// 	}
// 	addScore.show();
// }


var Name = "";
ipcMain.on('addName', function(event, data) 
{
	highScores[data.scorei].name = data.name;
	Name = data.name;

	storage.set(  'highScores' , highScores, null);

	mainWindow.webContents.send("renderScores",highScores);

	forceAddScore = false;
	addScore.hide();
});


function sort(arr)
{
	for(var i = 0; i < arr.length;i++)
	{
		for(var j = 0; j < arr.length;j++)
		{
			var t = arr[i];
			
			if (arr[j].score < arr[i].score)
			{
				arr[i] = arr[j];
				arr[j] = t;
			}
		}
	}

	return arr;
}


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