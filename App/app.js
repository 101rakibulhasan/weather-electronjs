const {app,BrowserWindow, ipcMain, globalShortcut, systemPreferences, remote, Tray, Menu} = require('electron')
const fs = require('fs');
const path = require('path');

var filepath = __dirname.substring(0, __dirname.lastIndexOf('\\')) + '\\setting.json';
//const filepath = path.join(__dirname,  '/setting.json');

function mainWindows()
{
    if (!fs.existsSync(filepath)) {
    fs.copyFile( path.join(__dirname,'/setting.json'), filepath, (err) => {
        const datas = JSON.parse(fs.readFileSync(filepath));
        datas["appPath"] = filepath;
        fs.writeFileSync(filepath, JSON.stringify(datas, null, 4));
      });
    }
    
    const win = new BrowserWindow({
        width:380,
        height:600,
        title: "Weather",
        autoHideMenuBar: true,
        frame: false,
        icon: path.join(__dirname, 'images/icon.png'),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: false
        }

    })

    win.loadFile(path.join(__dirname,"setup.html"));
    tray = new Tray(path.join(__dirname,'images/icon.png'))
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
            devTools: false
        }

    })

    main.loadFile(path.join(__dirname,"index.html"));

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
        main.loadFile(path.join(__dirname,"index.html"));
        main.show();
        win.hide();
    })

    ipcMain.on('go-setup', (event) => {
        win.loadFile(path.join(__dirname,"setup.html"));
        win.show();
        main.hide();
    })

    
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
        const data = JSON.parse(fs.readFileSync(filepath));
        if(data["isSetup"] != 0)
        {
            main.show();
        }else{
            app.quit();
        }
        
    })
}  

app.whenReady().then(mainWindows)

ipcMain.on('parseJSON_pos', (event, x) => {
    const data = JSON.parse(fs.readFileSync(filepath));
    data["loc_key"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

ipcMain.on('parseJSON_loc', (event, x) => {
    const data = JSON.parse(fs.readFileSync(filepath));
    data["cityName"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

ipcMain.on('parseJSON_isSetup', (event, x) => {
    const data = JSON.parse(fs.readFileSync(filepath));
    data["isSetup"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

ipcMain.on('parseJSON_unit', (event, x) => {
    const data = JSON.parse(fs.readFileSync(filepath));
    data["unit"] = x;
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
})

function OfflineWindow()
{
    const main = new BrowserWindow({
        width:250,
        height:350,
        title: "No Network Found",
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: true,
        movable:false,
        resizable:false,
        icon: path.join(__dirname, 'images/alert.png'),
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: false
        }

    })

    main.loadFile(path.join(__dirname,"offline.html"));
    main.hide();

    main.on('close', () => {
        app.exit();
    })

    ipcMain.on('checkoffline', (event) => {
        main.show();
    })
}

app.whenReady().then(OfflineWindow);

