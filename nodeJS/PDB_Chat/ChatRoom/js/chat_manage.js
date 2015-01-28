$(function () {
    //Check cookie
    var user1=getCookie("user");
    var pass1=getCookie("pass");
    if (user1==="" && pass1==="") {
        $('#login').modal({backdrop: 'static'});
    }else{
        $('#user_user').val(user1);
        $('#user_pass').val(pass1);
        checkLogin();
    }
    /*-----------------------------------------------------*/

    $('.userOnlinetooltip').each(function(){
        $(this).tooltip();
    });
    delete sessionStorage.pdbUser;
    delete sessionStorage.user_id;
});

/*-----------------------------------------------------------------------------*/
var msgIn = 0;
/*----------------------------------------------------------------------------*/
function history(){
    $.get('history',function(data){
        var ChatData = "";
        var pdbUser = sessionStorage.pdbUser;
        $.each(data,function(key,msg){
            var datetime_split = msg.pdb_date.split(' ');
            var date_split = datetime_split[0].split('-');
            var time_split = datetime_split[1].split(':');
            var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var DateCovert = date_split[2]+' '+m[parseInt(date_split[1])-1]+' '+(date_split[0]).substr(0,2);
            var nameUser = msg.pdb_name;
            var massage = msg.pdb_massage;
            if(pdbUser === nameUser){
                ChatData += '<li class="MyUser">';
                ChatData += '<span class="massage">' + unescape(massage) + '</span>';
                ChatData += '<span class="name">' + nameUser + ' <i class="glyphicon glyphicon-user"></i></span>';
                ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';
                ChatData += '</li>';
            }else{
                ChatData += '<li class="otherUser">';                    
                ChatData += '<span class="name"><i class="glyphicon glyphicon-user"></i> ' + nameUser + '</span>';
                ChatData += '<span class="massage">' + unescape(massage) + '</span>';
                ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';
                ChatData += '</li>';
            }
        });
        $('#showHistory-msgData ul.chatStory').append(ChatData);
    });
}
function chat(){
    $(window).click(function(){
        $('title').text('PDB Chat Room');
        $('#count_message').empty();
        msgIn=0;
    });
    var socket = io.connect();
    socket.on('user online',function(user_chat){
        $('#userOnline > ul').empty();
        $.each(user_chat,function(key,user){
            $('#userOnline > ul').append('<li><i class="glyphicon glyphicon-user"></i> '+user.user_name+'</li>');
        });
    });
    socket.on('new user', function (user) {
        var pdbUser = sessionStorage.pdbUser;
        var ChatData="";
        var newUser = user.user_name;
        ChatData += '<li class="otherUser"><span class="name">แจ้งเตือน</span><span class="online"><i>' + newUser + '</i> ออนไลน์</span></li>';
        $('#show-msgData ul.chatList').append(ChatData);
        scroll_BT();
        if($('#sound_close > i > small').text()==="ON"){
            sound_connect.play();
        }
    });
    socket.on('msg chat', function (msg) {
        var datetime_split = msg.pdb_date.split(' ');
        var date_split = datetime_split[0].split('-');
        var time_split = datetime_split[1].split(':');
        var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var DateCovert = date_split[2]+' '+m[parseInt(date_split[1])-1]+' '+(date_split[0]).substr(0,2);
        var pdbUser = sessionStorage.pdbUser;
        var ChatData = "";
        if(pdbUser === msg.pdb_name){
            ChatData += '<li class="MyUser">';               
            ChatData += '<span class="massage">' + unescape(msg.pdb_massage) + '</span>';
            ChatData += '<span class="name">' + msg.pdb_name + ' <i class="glyphicon glyphicon-user"></i></span>'; 
            ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';      
            ChatData += '</li>';
        }else{
            if($('#sound_close > i > small').text()==="ON"){
                sound_massage.play();
            }
            ChatData += '<li class="otherUser">';                
            ChatData += '<span class="name"><i class="glyphicon glyphicon-user"></i> ' + msg.pdb_name + '</span>';
            ChatData += '<span class="massage">' + unescape(msg.pdb_massage) + '</span>';
            ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';
            ChatData += '</li>';
            msgIn++;
            $('title').text('มีข้อความใหม่('+msgIn+')');
            $('#count_message').text('['+msgIn+']');
        }
        $('#show-msgData ul.chatList').append(ChatData);
        $('#showHistory-msgData ul.chatList').append(ChatData);
        scroll_BT();
        if(msg.pdb_upload){
            setTimeout(scroll_BT_animate,200);
        }
    });
    socket.on('out user', function (outUser) {
        if(!outUser){
            return false;
        }else{
            var ChatData = '<li class="otherUser"><span class="name">แจ้งเตือน</span><span class="offline"><i>' + outUser + '</i> ออฟไลน์</span></li>';
            $('#show-msgData ul.chatList').append(ChatData);
            scroll_BT();
        }
    });
    socket.on('user chenge',function(user){
        // เมื่อมีการเข้าสู่ระบบ User เดียวกัน
        //console.log(user);
    });
}
function scroll_BT(){
    var elem = document.getElementById('show-msgData');
    $(window).scrollTop(elem.scrollHeight);
}
function Add_massageData(form) {
    var nameUser = form.nameUser.value;
    var msgData = form.msgData.value;
    var dataChat = {
        nameUser: nameUser,
        msgData: msgData
    };
    if($.trim(nameUser) === ""){
        alert('ไม่มีชื่อผู้ส่ง !');
        return false;
    }
    var socket = io.connect();
    socket.emit('msg chat', dataChat);
    $(form).find('input[type=text]').val('');
}

function checkLogin() {
    //Check Cookie
    var user1=getCookie("user");
    var pass1=getCookie("pass");
    if (user1==="" && pass1==="") {
        var user_user = $.md5($('#user_user').val());
        var user_pass = $.md5($('#user_pass').val());
    }else{
        var user_user=user1;
        var user_pass=pass1;
    };
    var setCookie = ($('#remember:checked').val() === undefined)?false:true;
    /*-------------------------------------------------------------------------*/
    var DataUser = {
        user_user:user_user,
        user_pass:user_pass
    };
    $.ajax({
        url:"check-login",
        data:DataUser,
        type:"POST",
        success:function(status){
            if(status){
                var socket = io.connect();
                if(status.repeatedly){
                    socket.emit('delete user',status.pdb_user[0]);
                    socket.emit('repeat user');
                }else{
                    var nameUser = status[0].user_name;
                    var user_id = status[0].user_id;
                    var userOnline = {
                        user_id:user_id,
                        user_name:nameUser,
                        online:1
                    };

                    sessionStorage.setItem('pdbUser',nameUser);
                    sessionStorage.setItem('user_id',user_id);
                    $('#login').modal('hide');
                    $('#user_id').val(user_id);
                    $('#nameUser').val(nameUser);
                    $('#show-user').html('<i class="glyphicon glyphicon-user"></i> '+nameUser);
                    socket.emit('new user',userOnline);
                    socket.emit('story chat');            
                    $('#login .form-control').val('');
                    history();
                    showLastChat();
                    if(setCookie){
                        addCookie(user_user,user_pass);
                    }
                }
                socket.on('user disconnected',function(user){
                    if(user.user_id == sessionStorage.user_id){
                        sessionStorage.clear();
                        socket.emit('user disconnected',user.user_id);
                        if(confirm('ขณะนี้มีการล็อกอินจากเครื่องอื่น คุณต้องการล็อกอินใช่หรือไม่.....')){
                            location.reload();
                        }else{
                            location = "http://pdb.co.th/";
                        }
                    }else{
                        socket.on('repeat user',function(){
                            setTimeout(function(){
                                checkLogin();
                            },500);
                        });
                    }
                });
            }else{
                alert('Username หรือ Password ไม่ถูกต้อง !');
            }
        }
    });
}
function scroll_BT_animate(){
    var elem = document.getElementById('show-msgData');
    $('html, body').animate({ 
        scrollTop: elem.scrollHeight
    }, 1500);
}

function user_register(){
    if($.trim($('#confirm_pass').val()) !== $('#regis_pass').val()){
        alert('กรุณากรอก Password ให้ตรงกัน !');
        return false;
    }
    var user_user = $.md5($('#regis_user').val());
    var user_name = $('#regis_name').val();
    var user_pass = $.md5($('#regis_pass').val());

    /*------------------ Check On Client */
    var userIden=false,nameUser='No Data';
    $('#userChat > ul > li').each(function(){
        var username = $.trim($(this).text());
        if(user_user === username){
            userIden=true;
            return false;
        }
    });
    if(userIden){
        alert('มีผู้ใช้งาน Username นี้แล้ว !');
    }else{
        var user_register = {
            user_user:user_user,
            user_pass:user_pass,
            user_name:user_name   
        };
        var socket = io.connect();
        socket.emit('user register', user_register);
        alert('เพิ่มผู้ใช้งานสำเร็จ...');
        $('#showLogin').show();
        $('#showRegister').hide();
        /*------------------------------------------*/
        $('#user_user').val($('#regis_user').val());
        $('#user_pass').val($('#regis_pass').val());
        checkLogin();
    }
}
function showLastChat(){
    var socket = io.connect();
    socket.on('last chat',function(db_data){
        var count = (db_data.length-1);
        for(var i=count;i>=0;i--){
            var ChatData = "";
            var datetime_split = db_data[i].pdb_date.split(' ');
            var date_split = datetime_split[0].split('-');
            var time_split = datetime_split[1].split(':');
            var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var DateCovert = date_split[2]+' '+m[parseInt(date_split[1])-1]+' '+(date_split[0]);
            var pdbUser = sessionStorage.pdbUser;
            var massage = db_data[i].pdb_massage.toString();
            var nameUser = db_data[i].pdb_name;
            if(pdbUser === nameUser){
                ChatData += '<li class="MyUser">';
                ChatData += '<span class="massage">' + unescape(massage) + '</span>';
                ChatData += '<span class="name">' + nameUser + ' <i class="glyphicon glyphicon-user"></i></span>';
                ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';
                ChatData += '</li>';
            }else{
                ChatData += '<li class="otherUser">';                    
                ChatData += '<span class="name"><i class="glyphicon glyphicon-user"></i> ' + nameUser + '</span>';
                ChatData += '<span class="massage">' + unescape(massage) + '</span>';
                ChatData += '<span class="datetime">'+DateCovert+' ,'+ time_split[0]+':'+time_split[1] + ' น.</span>';
                ChatData += '</li>';
            }
            $('#show-msgData ul.chatStory').append(ChatData);
        }
    });
    chat();
    setTimeout(scroll_BT_animate,900);
}
function userChat(){
    var socket = io.connect();
    socket.emit('check username');
    socket.on('user chat',function(db_data){
        var userCate='<ul>';
        $.each(db_data,function(key,value){
            userCate += '<li>'+value+'</li>';
        });
        userCate += '</ul>';
        $('#userChat').html(userCate);
    }); 
}
function showRegister(){
    userChat();
    $('#showLogin').hide();
    $('#showRegister').fadeToggle(function(){
        if($(this).css('display') == 'none'){
            $('#showLogin').show();
            $('#Register').text('Register');
            $('#userChat').empty();
        }else{
            $('#showLogin').hide();
            $('#Register').text('Login');
        }
    });
}

function uploadfile(form){
    var fileUpload = document.getElementById('fileUpload');
    var file = fileUpload.files[0];
    var fileSize = file.size/1024;
    if(fileSize > 2048){
        alert('กรุณาอัพโหลดไฟล์ที่มีขนาดต่ำกว่า 2 MB !');
        return false;
    }else{
        var socket = io.connect();
        $(form).ajaxSubmit({
            url:'upload-file',
            beforeSend: function () {
                $('#upload').show();
                $('#upload span#percen').text(0+'%');
                $('.sendData').each(function(){
                    $(this).attr('disabled','');
                });
            }, 
            uploadProgress: function (event, position, total, percen) {
                $('#upload span#percen').text(percen+'%');
            },
            timeout: 20000,
            success:function(file){
                if(!file){
                    $('#upload span#percen').text('upload warning');
                    $('#upload').fadeOut();
                }else{
                    $('#upload').hide();
                    var file = {
                        upload:true,
                        nameUser:sessionStorage.pdbUser,
                        file_name:file.originalname,
                        file_path:file.path,
                        file_type:file.mimetype,
                        file_size:fileSize
                    };
                    socket.emit('msg chat',file);
                }
                $('#fileUpload').val('');
                $('.sendData').each(function(){
                    $(this).removeAttr('disabled');
                });
            },
            error: function(x, t, m) {
                if(t==="timeout") {
                    alert("got timeout");
                } else {
                    alert(t);
                }
                $('#fileUpload').val('');
                $('.sendData').each(function(){
                    $(this).removeAttr('disabled');
                });
                $('#upload').hide();
            }
        });
    }
}
function setting_sound(){
    var status = ($('#sound_close > i > small').text()==="ON")?true:false;
    if(status){
        $('#sound_close').empty().append('<i class="fa fa-volume-off"> <small>OFF</small></i>');
    }else{
        $('#sound_close').empty().append('<i class="fa fa-volume-up"> <small>ON</small></i>');
    }
}

function img_resize(image)
{
    $(image).hide();
    var imgSrc = $(image).attr('src');
    var canvarId = imgSrc.split('.')[0];
    var imageSize = ($(image).attr('data-imagesize') !== undefined)?$(image).attr('data-imagesize'):100;
    var imageLink = '<canvas id="'+canvarId+'" class="image-chat"></canvas>';
    $(image).after(imageLink);
    var myImage = new Image();
    var thecanvas = document.getElementById(canvarId);
    var ctx = thecanvas.getContext("2d");
    myImage.src = imgSrc;
    myImage.onload = function() {
        var orl_width = myImage.width;
        var orl_height = myImage.height;
        var new_width = 0;
        var new_height = 0;
        if(orl_width > orl_height){
            new_width = imageSize;
            new_height = parseInt((new_width/orl_width)*orl_height);
        }else{
            new_height = imageSize;
            new_width = parseInt((new_height/orl_height)*orl_width);
        }
        thecanvas.width=new_width;
        thecanvas.height=new_height;
        ctx.drawImage(myImage, 0, 0, new_width, new_height);
    } 
    $(image).remove();
}