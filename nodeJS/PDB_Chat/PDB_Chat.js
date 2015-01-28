var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var mysql = require('mysql');
var conn = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"4096",
    insecureAuth:true
});
conn.connect();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(__dirname + '/ChatRoom'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/ChatRoom/index.html');
});
app.post('/check-login',function(req,res){
    var user = req.body.user_user;
    var pass = req.body.user_pass;
    var sql = "select * from user_chat where user_user='"+user+"' and user_pass='"+pass+"'";
    conn.query(sql,function(error,result){
        if(result.length > 0){
            if(result[0].user_status == 1){
                var repeatedly = {
                    repeatedly:true,
                    pdb_user:result
                };
                console.log('Login Repeatedly');
                res.send(repeatedly);
            }else{
                console.log('Login Success');
                res.send(result);
            }
        }else{
            console.log('Login Fail');
            res.send(false);
        }
    });
});
app.get('/history',function(req,res){
    conn.query('select * from pdb_chat order by pdb_id',function(err,rs){
        if(err){
            throw err;
            return false;
        }else{
            res.send(rs);
        }
    });
});
var multer = require('multer');
var done = false;
app.use(multer(
    {
        dest: './ChatRoom/uploads/',
        rename: function (fieldname, filename) {
            return 'File_'+Date.now()+'-'+filename;
        },
        onFileUploadStart: function (file) {
            //console.log(file.originalname + ' is starting ...')
            console.log('upload status...');
        },
        onFileUploadComplete: function (file) {
            // console.log(file.fieldname + ' uploaded to  ' + file.path)
            console.log('upload complete...');
            done=true;
        }
    }
));
app.post('/upload-file',function(req,res){
    if(done==true){
        res.send(req.files.fileUpload);
    }else{
        res.send(0);
    }
});

server.listen(32211);
console.log("Server Start...");
console.log("Server Port : 32211");
console.log("Welcome to PDB Chat Room");
createDB();
/*------------------------------------------------------------------------------*/

function createDB(){
    conn.query("create database if not exists PDB_Chat");
    conn.query("use PDB_Chat");

    var sql = "CREATE TABLE IF NOT EXISTS pdb_chat(";
    sql += "pdb_id INT AUTO_INCREMENT PRIMARY KEY,";
    sql += "pdb_name VARCHAR(20),";
    sql += "pdb_massage TEXT,";
    sql += "pdb_date VARCHAR(20)";
    sql += ")";
    conn.query(sql);

    var sql = "CREATE TABLE IF NOT EXISTS user_chat(";
    sql += "user_id INT AUTO_INCREMENT PRIMARY KEY,";
    sql += "user_user VARCHAR(35) UNIQUE,";
    sql += "user_name VARCHAR(20),";
    sql += "user_pass VARCHAR(35),";
    sql += "user_status INT(2)";
    sql += ")";
    conn.query(sql);
}
function insertChatON_DB(nameUser,msgData,upload){
    var now = datetime();
    if(upload){
        var dbReturn = {
            pdb_name:nameUser,
            pdb_massage:msgData.trim(),
            pdb_date:now,
            pdb_upload:upload
        };
    }else{
        var dbReturn = {
            pdb_name:nameUser,
            pdb_massage:msgData.trim(),
            pdb_date:now
        };
    }
    var dbInsert = {
        pdb_name:nameUser,
        pdb_massage:msgData.trim(),
        pdb_date:now
    };
    conn.query("insert into pdb_chat set ?",dbInsert);
    return dbReturn;
}
function datetime(){
    Number.prototype.padLeft = function (n,str) {
        return (this < 0 ? '-' : '') + 
            Array(n-String(Math.abs(this)).length+1).join(str||'0')+(Math.abs(this));
    }
    var d = new Date();
    var month = d.getMonth()+1;
    var date = d.getDate();
    var houres = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    var DateTime = d.getFullYear()+"-"+month+"-"+date.padLeft(2,'0')+" ";
    DateTime += houres.padLeft(2,'0')+":"+minutes.padLeft(2,'0')+":"+seconds.padLeft(2,'0');
    return DateTime;
}
/*------------------------------------------------------------------------------*/
var nameUser = {};
var oldUser = Array(),n=0;
var new_user = Array(),index=0;
io.sockets.on('connection', function (socket) {
    socket.on('story chat',function(){
        conn.query('select * from pdb_chat order by pdb_id desc limit 0,10',function(error,result){
            socket.emit('last chat',result);
        });
    });
    socket.on('check username',function(){
        conn.query('select * from user_chat',function(error,result){
            if(error){
                throw error;
            }else{
                var username = {};
                for(var i=0; i<result.length; i++){
                    username[i]=result[i].user_user;
                }
                socket.emit('user chat',username);
            }
        });
    });
    socket.on('user register',function(userData){
        var sql = "INSERT INTO user_chat(user_user,user_name,user_pass) VALUES(";
        sql += "'"+userData.user_user+"','"+userData.user_name+"','"+userData.user_pass+"'";
        sql += ")";
        conn.query(sql);
    });

    /*-------------------------------------------------------------------------------*/
    socket.on('new user', function (newUser) {
        nameUser[socket.id] = newUser.user_id;
        conn.query("update user_chat set user_status=1 where user_id="+newUser.user_id);
        io.sockets.emit('new user', newUser);
        /*------------------------------------------------------------*/
        conn.query('select * from user_chat where user_status=1',function(error,result){
            io.sockets.emit('user online',result);
        });
    });
    socket.on('msg chat', function (msg) {
        if(msg.upload){
            var nameUser = msg.nameUser;
            var fileName = msg.file_name;
            var fileType = msg.file_type;
            var filePath = msg.file_path.replace(/\\/gi,'/');
            var file_size = msg.file_size;
            filePath = filePath.replace('ChatRoom/','');
            var massage='';
            if(fileType==="image/jpeg"||fileType === 'image/jpg'||fileType === 'image/gif'||fileType === 'image/png'){
                if(file_size < 480){
                    massage = "<a href='"+filePath+"' target='_blank'><img src='"+filePath+"' id='image-chat' class='image-chat'></a>";
                }else{
                    massage = "<a href='"+filePath+"' target='_blank'><img src='"+filePath+"' data-imagesize='200'  class='image-chat' onload='img_resize(this)'></a>";
                }
            }else{
                massage = "<a href='"+filePath+"' target='_blank'><i class='glyphicon glyphicon-file'></i> "+fileName+"</a> <br><small class='filesize'>Size:[ "+parseInt(file_size)+" KB ]</small>";
            }
            var DataInsert = insertChatON_DB(nameUser,escape(massage),true);
            io.sockets.emit('msg chat', DataInsert);
            return false;
        }
        if(msg.msgData.trim() === ""){
            return false;
        }
        var massage = htmlToText(msg.msgData);
        var ProcessMsg = massage.split(' ');
        var countSrtng = ProcessMsg.length;
        var textJoin = '';
        for(var i=0; i<countSrtng; i++){
            textJoin += strToUrl(ProcessMsg[i])+" ";
        }
        massage = textJoin;
        var DataInsert = insertChatON_DB(msg.nameUser,escape(massage),false);
        io.sockets.emit('msg chat', DataInsert);
    });
    socket.on('delete user',function(user){
        io.sockets.emit('user disconnected',user);
        conn.query("update user_chat set user_status=0 where user_id="+user.user_id);
    });
    socket.on('repeat user',function(){
        socket.emit('repeat user');
    });
    socket.on('user disconnected',function(user_id){
        socket.disconnect();
    });
    socket.on('disconnect', function (data,er) {
        var user_id = nameUser[socket.id];
        if(user_id !== undefined){
            conn.query("update user_chat set user_status=0 where user_id="+user_id);
            conn.query("select user_name from user_chat where user_id="+user_id,function(error,result){
                io.sockets.emit('out user',result[0].user_name);
            });
            conn.query('select * from user_chat where user_status=1',function(error,result){
                io.sockets.emit('user online',result);
            });
            conn.query("OPTIMIZE TABLE  user_chat");
            console.log(user_id+' Disconnect...');
            delete nameUser[socket.id];
        }
    });
});

// function manager ---------------------------------------------
function str_replace(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function htmlToText(str){
    var htmlToText;
    htmlToText =  str_replace('<','&lt;', str);
    htmlToText =  str_replace('>','&gt;', htmlToText);
    //htmlToText =  str_replace("'",'&#39;',htmlToText);
    return htmlToText;
}
function strToUrl(str){
    var url,strlink;
    var reg = /^((http|https|HTTP|HTTP):\/\/+(www|WWW\.)?[A-Za-z0-9\-\.]{1,}\.[A-Za-z])|((www|WWW\.)?[A-Za-z0-9\-\.]{1,}\.[A-Za-z])$/;
    var chekUrl = reg.test(str);
    if(reg.test(str)){
        strlink = str_replace('https://','',str);
        strlink = str_replace('http://','',strlink);
        url = '<a href="'+str+'" target="_blank">'+strlink+'</a>';
    }else{
        url = str;
    }
    return url;
}