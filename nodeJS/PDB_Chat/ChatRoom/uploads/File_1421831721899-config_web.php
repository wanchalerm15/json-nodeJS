<div id="artical" class="main_aftershop top_main bottom_main">
    <?php include './web_server_script/edit_website.php'; ?>
    <h3 class="topic">
        <img class="add">
        แก้ไขร้านค้า <?= $WEB_THAI_NAME ?>
    </h3>
    <div class="in_main">
        <div class="warning">
            คุณสามารถแก้ไขเว็บไซด์ เพจ วิธีการสั่งซื้อ 
            เกี่ยวกับเรา ติดต่อเรา และรายละเอียดอื่นๆ ได้ที่หน้านี้
        </div>
        <div>
            <p class="title">
                <img class="add">
                เลือกเมนูที่จะแก้ไข
            </p>
            <ul class="config_web_menu">
                <li><a href="?manage=config_web&set=web_name">ชื่อร้านค้า</a></li>
                <span>|</span>
                <li><a href="?manage=config_web&set=logo_web">โลโก้,บัญชีธนาคาร</a></li>
                <span>|</span>
                <li><a href="?manage=config_web&set=row_tax">จำนวนแถว,ภาษี</a></li>
                <span>|</span>
                <li><a href="?manage=config_web&set=how_to_pays">เพจ วิธีการสั่งซื้อ</a></li>
                <span>|</span>
                <li><a href="?manage=config_web&set=about_me">เพจ เกี่ยวกับเรา</a></li>
                <span>|</span>
                <li><a href="?manage=config_web&set=contact_us">เพจ ติดต่อเรา</a></li>
            </ul>
        </div>
        <!---------------------------------------WEB NAME--------------------------------------->
        <?php if ($_GET['set'] == 'web_name') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข ชื่อร้านค้า</u></b>
                </p>
                <br />
                <form class="edit_web_name" onsubmit="update_web_name(this);
                            return false;" id="web_name">
                    <div class="warning-inline" id="web_name_error"></div>
                    <p><b>ชื่อเว็บไซด์ ภาษาไทย</b></p>
                    <input type="text" value="<?= $WEB_THAI_NAME ?>" name="web_thai_name" class="text" data-web_name="ชื่อเว็บไซด์ ภาษาไทย"/>
                    <p><b>ชื่อเว็บไซด์ อังกฤษ</b></p>
                    <input type="text" value="<?= $WEB_ENG_NAME ?>" name="web_eng_name" class="text" data-web_name="ชื่อเว็บไซด์ อังกฤษ"/>
                    <p class="btn">
                        <input type="submit" value="แก้ไข" class="bt_black"/>
                        <input type="reset" value="คืนค่าข้อความ" class="bt_black"/>
                    </p>
                </form>
                <br />
            </div>
            <!---------------------------------------LOGO WEB--------------------------------------->
        <?php } elseif ($_GET['set'] == 'logo_web') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข โลโก้ร้านค้า</u></b>
                </p>
                <br />
                <form class="edit_web_name" style="text-align: center;" id="logo_web" target="how_to_pays_ifm"
                      method="POST" enctype="multipart/form-data" action="web_server_script/website.php?logo_web=1">
                    <img src="<?= $WEB_LOGO ?>" class="logo_img_config_web"/>
                    <br /><br />
                    <p><u>เปลี่ยนภาพโลโก้ใหม่</u></p>
                    <br />
                    <button type="button" class="bt_black" onclick="$('#file_logo').click()">
                        <img src="images/upload.png" height="14px"/> อัพโหลดใหม่
                    </button>
                    <input type="file" style="display: none;" id="file_logo" name="file_logo" onchange="$('#logo_web').submit()"/>
                </form>
                <br />
            </div>
            <!---------------------------------------img_bank_pays--------------------------------------->
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข ภาพบัญชีธนาคาร</u></b>
                </p>
                <br />
                <form class="edit_web_name" style="text-align: center;" id="img_bank_pays" target="how_to_pays_ifm"
                      method="POST" enctype="multipart/form-data" action="web_server_script/website.php?img_bank_pays=1">
                    <img src="images/bank_pays.jpg" class="logo_img_config_web"/>
                    <br /><br />
                    <p><u>เปลี่ยนภาพแสดงบัญชีธนาคารในการชำระเงิน</u></p>
                    <br />
                    <button type="button" class="bt_black" onclick="$('#file_img_bank_pays').click()">
                        <img src="images/upload.png" height="14px"/> อัพโหลดใหม่
                    </button>
                    <input type="file" style="display: none;" id="file_img_bank_pays" name="file_img_bank_pays" onchange="$('#img_bank_pays').submit()"/>
                </form>
                <br />
            </div>
            <!---------------------------------------ROW TAX--------------------------------------->
        <?php } elseif ($_GET['set'] == 'row_tax') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข จำนวนแถวและภาษี</u></b>
                </p>
                <br />
                <form class="edit_web_name" id="numrow_tax" onsubmit="update_numrow_tax(this);
                            return false;">
                    <div class="warning-inline" id="numrow_tax_error"></div>
                    <p><b>จำนวนแถวข้อมูลที่แสดง (แถว)</b></p>
                    <input type="text" value="<?= $WEB_AFTERSHOP_NUMROW ?>" name="aftershop_numrow" class="text" data-numrow_tax="จำนวนแถวข้อมูลที่แสดง (แถว)"/>
                    <p><b>ภาษีของร้านค้า (%)</b></p>
                    <input type="text" value="<?= $WEB_TAX ?>" class="text" name="tax" data-numrow_tax="ภาษีของร้านค้า (%)"/>
                    <p class="btn">
                        <input type="submit" value="แก้ไข" class="bt_black"/>
                        <input type="reset" value="คืนค่าข้อความ" class="bt_black"/>
                    </p>
                </form>
                <br />
            </div>
            <!---------------------------------------how_to_pays--------------------------------------->
        <?php } elseif ($_GET['set'] == 'how_to_pays') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข หน้าเพจวิธีการสั่งซื้อ</u></b>
                </p>
                <br />
                <form class="edit_web_name" style="width: 100%;" 
                      method="POST" action="web_server_script/website.php?how_to_pays=1" target="how_to_pays_ifm">
                    <div class="warning-inline" id="how_to_pays_error"></div>
                    <textarea id="how_to_pays" name="how_to_pays" style="height: 432px;"><?= $WEB_HOW_TO_PAYS ?></textarea>
                    <p class="btn">
                        <input type="submit" value="แก้ไขหน้าเพจวิธีการสั่งซื้อ" class="bt_black"/>
                    </p>
                </form>
                <script>
                    $(document).ready(function () {
                        CKEDITOR.replace('how_to_pays', {uiColor: '#aaccff', height: "300"});
                    });
                </script>
                <br />
            </div>
            <!---------------------------------------about_me--------------------------------------->
        <?php } elseif ($_GET['set'] == 'about_me') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข หน้าเพจเกี่ยวกับเรา</u></b>
                </p>
                <br />
                <form class="edit_web_name" style="width: 100%;" 
                      method="POST" action="web_server_script/website.php?about_me=1" target="how_to_pays_ifm">
                    <div class="warning-inline" id="about_me_error"></div>
                    <textarea id="about_me" name="about_me" style="height: 432px;"><?= $WEB_ABOUT_ME ?></textarea>
                    <p class="btn">
                        <input type="submit" value="แก้ไขหน้าเพจเกี่ยวกับเรา" class="bt_black"/>
                    </p>
                </form>
                <script>
                    $(document).ready(function () {
                        CKEDITOR.replace('about_me', {uiColor: '#ffccaa', height: "300"});
                    });
                </script>
                <br />
            </div>
            <!---------------------------------------contact_us--------------------------------------->
        <?php } elseif ($_GET['set'] == 'contact_us') { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>แก้ไข หน้าเพจติดต่อเรา</u></b>
                </p>
                <br />
                <form class="edit_web_name" style="width: 100%;" 
                      method="POST" action="web_server_script/website.php?contact_us=1" target="how_to_pays_ifm">
                    <div class="warning-inline" id="contact_us_error"></div>
                    <textarea id="contact_us" name="contact_us" style="height: 432px;"><?= $WEB_CONTACT_US ?></textarea>
                    <p class="btn">
                        <input type="submit" value="แก้ไขหน้าเพจติดต่อเรา" class="bt_black"/>
                    </p>
                </form>
                <script>
                    $(document).ready(function () {
                        CKEDITOR.replace('contact_us', {uiColor: '#ccffaa', height: "300"});
                    });
                </script>
                <br />
            </div>
        <?php } else { ?>
            <div class="inner-w border-inner" style="margin-top: 15px;">
                <p class="title">
                    <img class="add">
                    <b><u>เปิด-เปิดระบบขายสินค้า</u></b>
                </p>
                <br />
                <form class="edit_web_name" onsubmit="return false;">
                    <div class="warning">
                        คุณสามารถ <span style='color:#00CC00;'>เปิดระบบขาย</span> เพื่อขายสินค้าเครื่องดนตรีได้ 
                        หรือ <span style='color:#CC0000;'>ปิดระบบขาย</span> เพื่อแสดงสินค้าเท่านั้น ได้
                    </div>
                    <p>
                        <?php
                        if ($WEB_CLOSE_SELL) {
                            $color = "#00CC00";
                            echo "<b>สภานะตอนนี้คือ <u style='color:#00CC00;'>เปิดการขาย</u> ตามปกติ</b>";
                        } else {
                            $color = "#CC0000";
                            echo "<b>สภานะตอนนี้คือ <u style='color:#CC0000;'>ปิดการขาย</u> แสดงสินค้าเท่านั้น</b>";
                        }
                        ?>
                    </p>
                    <select class="text" style="width:100%;margin-top:25px;color:<?= $color ?>;" 
                            name='web_close_selling' onchange="update_web_close_selling(this)">
                                <?php
                                if ($WEB_CLOSE_SELL) {
                                    echo "<option style='color:#00CC00;' selected='' value='1'>เปิดระบบขาย</option>";
                                    echo "<option style='color:#CC0000;' value='0'>ปิดระบบขาย</option>";
                                } else {
                                    echo "<option style='color:#00CC00;' value='1'>เปิดระบบขาย</option>";
                                    echo "<option style='color:#CC0000;' selected='' value='0'>ปิดระบบขาย</option>";
                                }
                                ?>                       
                    </select>
                </form>
                <br />
            </div>
        <?php } ?>
        <p class="title"></p>
        <p class="disable" style="text-align: right;font-size: 14px;padding: 5px;">
            วันที่แก้ไขล่าสุด : <?= $WEB_DATE ?>
        </p>
        <iframe id="how_to_pays_ifm" name="how_to_pays_ifm" class="iframe_ajax"></iframe>
    </div>
</div>

