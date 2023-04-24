const {app,BrowserWindow, ipcMain, globalShortcut, systemPreferences, remote, Tray, Menu} = require('electron')
const fs = require('fs');
const path = require('path');

app.commandLine.appendSwitch('enable-features', 'WinrtGeolocationImplementation');
function mainWindows()
{
    const win = new BrowserWindow({
        width:380,
        height:600,
        title: "Weather",
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'images/icon.png'),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }

    })

    win.loadFile("setup.html");
    tray = new Tray('images/icon.png')
    tray.on("click",()=>{
        win.isVisible() ? win.hide() : win.show()
    })


    const main = new BrowserWindow({
        width:420,
        height:600,
        title: "Weather",
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'images/icon.png'),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }

    })

    main.loadFile("index.html");

    let isFullscreen = 0;
    ipcMain.on('go-fullscrn', (event) => {    

        if(isFullscreen == 0){
            main.setSize(960, 600)
            isFullscreen = 1;
        }else
        {
            main.setSize(420, 600)
            isFullscreen = 0;
        }
        
    })

    

    ipcMain.on('go-main', (event) => {
        main.show();
        win.hide();
    })

    ipcMain.on('go-setup', (event) => {
        win.show();
        main.hide();
    })

    const filepath = './setting.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    if(data["isSetup"] == 0){
        win.show();
        main.hide();
    }else{
        main.show();
        win.hide();
    }

    main.on('close', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    win.on('close', () => {
        main.show();
    })
}



// function mainWindows()
// {
//     const win = new BrowserWindow({
//         width:420,
//         height:600,
//         title: "Weather",
//         autoHideMenuBar: true,
//         icon: path.join(__dirname, 'images/icon.png'),
//         webPreferences:{
//             nodeIntegration:true,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js'),
//         }

//     })

//     let isFullscreen = 0;
//     ipcMain.on('go-fullscrn', (event) => {    

//         if(isFullscreen == 0){
//             win.setSize(960, 600)
//             isFullscreen = 1;
//         }else
//         {
//             win.setSize(420, 600)
//             isFullscreen = 0;
//         }
        
//     })

//     win.loadFile("index.html");
// }

    

app.whenReady().then(mainWindows)

//  app.on('ready', () => {
//     const filepath = './setting.json';
//     const data = JSON.parse(fs.readFileSync(filepath));
//     if(data["isSetup"] == 0){
//         setupWindows();
//     }else{
//         mainWindows();
//     }
    
//  })


ipcMain.on('parseJSON_pos', (event, x) => {
    const filepath = './setting.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    data["loc_key"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

ipcMain.on('parseJSON_loc', (event, x) => {
    const filepath = './setting.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    data["cityName"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

ipcMain.on('parseJSON_isSetup', (event, x) => {
    const filepath = './setting.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    data["isSetup"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

// ipcMain.on('go-main', (event) => {
//     app.whenReady().then(mainWindows)
// })

// ipcMain.on('go-setup', (event) => {
//     app.whenReady().then(setupWindows)
// })

ipcMain.on('parseJSON_unit', (event, x) => {
    const filepath = './setting.json';
    const data = JSON.parse(fs.readFileSync(filepath));
    data["unit"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})