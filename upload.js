var fs = require('fs');
var ssh2 = require('ssh2');

require('dotenv').load();
 
var conn = new ssh2();
 
conn.on(
    'connect',
    function () {
        console.log( "- connected" );
    }
);
 
conn.on(
    'ready',
    function () {
        console.log( "- ready" );
 
        conn.sftp(
            function (err, sftp) {
                if ( err ) {
                    console.log( "Error, problem starting SFTP: %s", err );
                    process.exit( 2 );
                }
 
                console.log( "- SFTP started" );
 
                // upload file
                var readStream = fs.createReadStream( "/proc/meminfo" );
                var writeStream = sftp.createWriteStream( process.env.SSH_BASE_UPLOAD_PATH + "/meminfo.txt" );
 
                // what to do when transfer finishes
                writeStream.on(
                    'close',
                    function () {
                        console.log( "- file transferred" );
                        sftp.end();
                        process.exit( 0 );
                    }
                );
 
                // initiate transfer of file
                readStream.pipe( writeStream );
            }
        );
    }
);
 
conn.on(
    'error',
    function (err) {
        console.log( "- connection error: %s", err );
        process.exit( 1 );
    }
);
 
conn.on(
    'end',
    function () {
        process.exit( 0 );
    }
);

conn.connect(
    {
        "host": process.env.SSH_HOST,
        "port": 22,
        "username": process.env.SSH_USER,
        "password": process.env.SSH_PASSWORD
    }
);
