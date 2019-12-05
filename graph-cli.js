
/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
 */

var replace = require("replace");

async function deployment(/*env = 'test'*/){
    //require('dotenv').config({ path: process.cwd()+'/'+ env+'.env'});

    await execShellCommand(/*'./node_modules/mocha/bin/mocha'*/'yarn install').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Yarn install failed');return;});
    await execShellCommand(/*'./node_modules/mocha/bin/mocha'*/'yarn mocha').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Mocha testing failed');return;});
    await execShellCommand('git checkout '+(process.env.ENV == 'test'?'develop':env)).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('failed in git checkout');return;});
    await execShellCommand('git pull').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('failed in git pull');return;});
    await execShellCommand('git reset --hard').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during git clean.');});


    let packageJson = require('./package.json');
    let newVersion;
    switch(process.env.ENV){
        case 'test':
            newVersion = packageJson.deploymentVersionTesting + 1;
            replace({ regex: "deploymentVersionTesting.*,", replacement: `deploymentVersionTesting": `+ newVersion +',', paths: ['./package.json'], recursive: true, silent: true, });
            break;
        case 'staging':
            newVersion = packageJson.deploymentVersionStaging + 1;
            replace({ regex: "deploymentVersionStaging.*,", replacement: `deploymentVersionStaging": `+ newVersion +',', paths: ['./package.json'], recursive: true, silent: true, });
            break;
        default:
            break;
    }
    replace({ regex: "deployment_version_place_holder", replacement: newVersion, paths: ['./src/mapping.ts'], recursive: true, silent: true, });
    replace({ regex: "network_place_holder", replacement: process.env.SUBGRAPH_NETWORK, paths: ['./subgraph.yaml'], recursive: true, silent: true, });
    replace({ regex: "address_place_holder", replacement: process.env.SUBGRAPH_ADDRESS, paths: ['./subgraph.yaml'], recursive: true, silent: true, });
    replace({ regex: "user_name_place_holder", replacement: process.env.SUBGRAPH_USER, paths: ['./package.json'], recursive: true, silent: true, });
    replace({ regex: "sg_name_place_holder", replacement: process.env.SUBGRAPH_NAME, paths: ['./package.json'], recursive: true, silent: true, });

    await execShellCommand('yarn codegen').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during graph codegen, please run graph codegen command for full error message');return});
    await execShellCommand('yarn deploy').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during yarn deploy.');return});
    replace({ regex: process.env.SUBGRAPH_USER+'/'+process.env.SUBGRAPH_NAME, replacement: 'user_name_place_holder/sg_name_place_holder', paths: ['./package.json'], recursive: true, silent: true, });
    await execShellCommand('git add package.json').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during yarn deploy.');return});
    await execShellCommand(`git commit -m "[auto-deploy]graph-ropsten/cd-version-`+newVersion+`-`+require('git-user-name')()+`-`+process.env.ENV+`"`).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during yarn deploy.');return});
    await execShellCommand(`git push`).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during git push.');return});
    await execShellCommand('git reset --hard').then((res)=>{console.log(res);}).catch((err)=>{console.log(err);console.log('Failed during git clean.');return});
    //Get the auth code from config file and register the CLI.
    console.log('after testing');
    // console.log(`stdout: ${stdout}`);// console.log(`stderr: ${stderr}`);
    //In case 5 minutes passed, send to slack chat a message with the URL for the logs.
}


function execShellCommand(cmd){
    const { exec } = require('child_process');
    return new Promise((resolve, reject) =>{
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.log(`err: ${err.message}`);// console.log(`stderr: ${stderr}`);
                // console.log(`stderr: ${stderr}`);
                return;
            }
            // the *entire* stdout and stderr (buffered)// console.log(`stdout: ${stdout}`);// console.log(`stderr: ${stderr}`);
            resolve(stdout);
        });
    });
}

let environmentFiles = {
    1: 'test.env',
    2: 'staging.env',
    3: 'prod.env'
};

process.stdout.write('\033c');
console.log('\x1b[33m%s\x1b[0m', "    ~    ~    ~    Welcome to Graph-cli    ~    ~    ~    ");
let readlineSync = require('readline-sync'),
    actions = [/*1*/ 'Deployment', /*2*/'Re-create cloudFormation templates','Development'],
    actionIndex = 1 /*because it starts with 0*/ + readlineSync.keyInSelect(actions, 'Which operation you want to use?');

switch (actionIndex) {
    case 1:{
        process.stdout.write('\033c');
        console.log('\x1b[33m%s\x1b[0m', "    ~    ~    ~    Which environment    ~    ~    ~    ");
        let readlineSync = require('readline-sync'),
            environments = [/*1*/ 'Testing', /*2*/'Staging'],
            envIndex = 1 /*because it starts with 0*/ + readlineSync.keyInSelect(environments, 'Please choose environment:');
        if ([1,2,3].includes(envIndex) == false){
            console.log("\x1b[31m", 'Not a valid environment');
            console.log("\x1b[34m", 'Bye Bye');
            return;
        }
        require('dotenv').config({ path: process.cwd()+'../'+ environmentFiles[envIndex]});
        process.stdout.write('\033c');
        console.log('\x1b[33m%s\x1b[0m', "    ~    ~    ~    Operation details    ~    ~    ~    ");
        process.stdout.write('Subgraph '+process.env.SUBGRAPH_NAME+' will be deployed to the hosted solution. Env: ');
        console.log("\x1b[34m", process.env.ENV);
        console.log("\x1b[0m", "----------------------------------------------------------------------------------------");
        let userApproval = readlineSync.keyInSelect(['Approve'],'To approve operation press [1].');
        if (userApproval != 0){
            process.exit();
        }
        deployment();
        break;
    }
    case 2:{
        console.log("\x1b[31m", 'Cloud formation templates not yet supported');
        console.log("\x1b[34m", 'Bye Bye');
        return;
    }
    case 3:{
        console.log('\x1b[33m%s\x1b[0m', "    ~    ~    ~    Which environment    ~    ~    ~    ");
        let readlineSync = require('readline-sync'),
            environments = [/*1*/ 'Testing', /*2*/'Staging'],
            envIndex = 1 /*because it starts with 0*/ + readlineSync.keyInSelect(environments, 'Please choose environment:');
        require('dotenv').config({ path: process.cwd()+'/'+ environmentFiles[envIndex]});

        replace({ regex: "deployment_version_place_holder", replacement: 1, paths: ['./src/mapping.ts'], recursive: true, silent: true, });
        replace({ regex: "network_place_holder", replacement: process.env.SUBGRAPH_NETWORK, paths: ['./subgraph.yaml'], recursive: true, silent: true, });
        replace({ regex: "address_place_holder", replacement: process.env.SUBGRAPH_ADDRESS, paths: ['./subgraph.yaml'], recursive: true, silent: true, });
        replace({ regex: "user_name_place_holder", replacement: process.env.SUBGRAPH_USER, paths: ['./package.json'], recursive: true, silent: true, });
        replace({ regex: "sg_name_place_holder", replacement: process.env.SUBGRAPH_NAME, paths: ['./package.json'], recursive: true, silent: true, });
    }
    default:
        return;
}


