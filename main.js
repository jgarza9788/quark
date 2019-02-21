const setupEvents = require('./setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}


const electron = require('electron');
const {app, BrowserWindow,Menu, ipcMain,shell} = electron; 

const fs = require('fs')
const path = require('path');
const dateFormat = require('dateformat');

//EJS
const storage = require('electron-json-storage');


const os = require('os');

let mainWindow;
let addScore;
let forceAddScore = false;

let highScores = 
[
{name:'',score:9},
{name:'',score:8},
{name:'',score:7},
{name:'',score:6},
{name:'',score:5},
{name:'',score:4},
{name:'',score:3},
{name:'',score:2},
{name:'',score:1},
{name:'',score:0}
];


app.on('ready',()=>
{
	//console.log('app is ready');

	var thisfolder = (process.platform=='win32')?'/AppData/Local/.quark/':'/.quark';
	thisfolder = path.join(os.homedir(),thisfolder);
	console.log(thisfolder);

	if(!fs.existsSync(thisfolder))
	{
		fs.mkdirSync(thisfolder);
	}

	storage.setDataPath(thisfolder);


	mainWindow = new BrowserWindow({
		width: 350,
		height: 800,
		minWidth: 350,
		minHeight: 800,
		// useContentSize: true,
		resizable: false,
		icon: `${__dirname}/assets/app-icon/png/64.png`
	});
	mainWindow.loadURL('file://' + __dirname + '/main.html');
	mainWindow.on('closed',()=>app.quit());
	mainWindow.on('blur', function () { mainWindow.webContents.send('pause', ""); })


	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	addScore = new BrowserWindow({
		width: 400,
		height: 275,
		resizable: false,
		frame: false,
		// webPreferences:{backgroundThrottling: false},
	});
	addScore.loadURL('file://' + __dirname + '/addScore.html');
	moveAddScore();
	addScore.setMenu(null);
	addScore.hide();

	// forceAddScore= true;
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

		// setTimeout(function() { saveNewSize(); }, 1000);
	}

	
	// function saveNewSize()
	// {
	// 	// console.log("trying to save");
	// 	// console.log(mainWindowSize);

	// 	// console.log(mainWindow.getSize());
	// 	// console.log(mainWindowSize);

	// 	if (!managerWindowSize)
	// 	{
	// 		managerWindowSize = true;
	// 		mainWindowSize= mainWindow.getSize();
	// 		// console.log(mainWindow.getSize());
	// 		console.log("newSize: " + mainWindowSize);
	// 		storage.set(  'mainWindowSize' , mainWindowSize, function(error, data) 
	// 		{
	// 			if (error) throw error;

	// 			setTimeout(function() { ()=>{managerWindowSize = false}; }, 1000);
	// 		});
	// 	}
	// }



//EJS
	storage.has('highScores', function(error, hasKey) 
	{
		if (error) throw error;
	  
		if (hasKey) 
		{
		  //NOTHING
			console.log('Has Key');
			// storage.getAll(function(error, data) 
			// {
			// 	if (error) throw error;
			// 	// console.log(data);
			// 	// console.log(data.highScores);
			// 	highScores= data.highScores;
			// });

			storage.get('highScores', function(error, data) {
				if (error) throw error;
				highScores= data;
				console.log(data);
			});


		}
		else
		{
			console.log('No Key');
			mainWindow.title = "Quark: Saving..."
			storage.set(  'highScores' , highScores, function(error, data) 
			{
				if (error) throw error;

				mainWindow.title = "Quark: Tetris Clone"
			});


		}
	  });
//EJS

	highScores=sort(highScores);

	console.log(highScores);

	// mainWindow.webContents.send('newState', "start");
	// mainWindow.webContents.send('newState', "start"); 
	
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


	if (isHighScore)
	{
		// showAddScore();
		forceAddScore = true;
		addScore.show();
		addScore.webContents.send('openAddScore', {placement:(scorei+1),scorei:scorei,score:score,defaultName:Name});
	}
	
});





var Name = "";
ipcMain.on('addName', function(event, data) 
{

	console.log(storage.getDataPath());

	console.log(data);
	console.log(data.name);
	console.log(data.scorei);
	console.log(highScores);
	// console.log(highScores[data.scorei]);

	for (var i = 0 ; i < highScores.length;i++)
	{
		console.log(highScores[i]);
	}

	highScores[data.scorei].name = data.name;
	highScores[data.scorei].score = data.score;
	Name = data.name;

//EJS
	// saveLoop();
	mainWindow.setTitle("Quark: Saving...");
	storage.set(  'highScores' , highScores, function(error, data) 
	{
		if (error) 
		{
			console.log("error here");
			throw error;
		}
		mainWindow.setTitle("Quark: Tetris Clone");
	});
//EJS

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

//EJS
// function saveLoop()
// {
// 	console.log("start loop");

// 	mainWindow.setTitle("Quark: Saving...");
// 	storage.set(  'highScores' , highScores, function(error, data) 
// 	{
// 		if (error) 
// 		{
// 			saveLoop0();
// 		}
// 		else
// 		{
// 			console.log("saved in saveLoop");
// 			mainWindow.setTitle("Quark: Tetris Clone");
// 		}
// 	});
// }

// function saveLoop0()
// {
// 	console.log("start loop 0 ");

// 	mainWindow.setTitle("Quark: Saving...");
// 	storage.set(  'highScores' , highScores, function(error, data) 
// 	{
// 		if (error) 
// 		{
// 			saveLoop();
// 		}
// 		else
// 		{
// 			console.log("saved in saveLoop0");
// 			mainWindow.setTitle("Quark: Tetris Clone");
// 		}
// 	});
// }
//EJS

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
				label: 'Reset',
				accelerator: 'R',
				click() {mainWindow.webContents.send('restart',"");}
			},
			{
				label: 'Donate',
				// accelerator: 'CmdOrCtrl+D',
				accelerator: 'D',
				click() { openDonate();}
			}
		]
	}
	,
	// {
	// 	label: 'View',
	// 	submenu:
	// 	[
	// 		//TODO: make custom zoom that zoomsin/out and resizes the window
	// 		// {
	// 		// 	label: 'zoomin',
	// 		// 	accelerator: 'CmdOrCtrl+=',
	// 		// 	click() { console.log("++"); }
	// 		// },
	// 		// {
	// 		// 	label: 'zoomout',
	// 		// 	accelerator: 'CmdOrCtrl+-',
	// 		// 	click() { console.log("--"); }
	// 		// }

	// 		{role: 'resetzoom'},
	// 		{role: 'zoomin'},
	// 		{role: 'zoomout'},
	// 	]
	// }
];


//MENU FOR DEBUGGING AND STUFF

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