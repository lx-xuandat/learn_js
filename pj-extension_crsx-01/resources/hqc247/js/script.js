if(window.location.href.match(/khachhang.hqc247.vn/)) {
    chrome.storage.local.remove('client-api-token');
    if(localStorage['token']){
        chrome.storage.local.set({'client-api-token': localStorage['token'].replace(/['"]+/g, '')});
    }
}
if(window.location.href.match(/detail.tmall.com\/item.htm/)) {
    let new_url = window.location.href.replace('item.htm', 'item_o.htm');
    window.location.replace(new_url);
}
function appendToExistTagByClass(content_change) {
    let element = document.getElementsByClassName('obj-price');
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('offerdetail_ditto_price');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('offerdetail_zeroConsign_price');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('price-discount-sku');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('add-daixiao-container');
    }
    if(!element || element.length == 0) {
        element = document.getElementById('J_StrPriceModBox');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('offerdetail_version2018_price');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('od-pc-offer-price-contain');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('od-pc-offer-discount-contain');
    }
    if(!element || element.length == 0) {
        element = document.getElementsByClassName('od-pc-division-line');
    }
    if(element && element.length > 0) {
        element[0].innerHTML = element[0].innerHTML + content_change;
    }
    else if(element){
        element.innerHTML = element.innerHTML + content_change;
    }

    // show image search taobao
    let imgsearch_element = document.getElementsByClassName('search-imgsearch-panel');
    if(imgsearch_element && imgsearch_element.length > 0) {
        imgsearch_element[0].setAttribute('style', 'display: block !important;');
    }
}
function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript( chrome.runtime.getURL('/js/inject_script.js'), 'body');

this.priceshowout = 0;
this.pricecynout = 0;
var imgLogoURL = chrome.runtime.getURL("images/logo.png");
var content_change = `<input type='hidden' id='hpo-content'/>
<div id="content_addon" style="display: table; text-align: left; min-width: 460px; padding: 10px; background: #ffffff; z-index: 200; position: relative; margin-top: 10px;">
    <div style="font-size: 130%; font-weight: bold; margin-bottom: 10px;" id="addon-hangnhap-price">
        <div class="logo">
            <a href="https://hqc247.vn/" data-spm-anchor-id="a312a.7728556.2015080704.1" style="font-size:150%;color: #000000; text-decoration: initial;"><img style="width: 100px;" src="${imgLogoURL}" alt=""/></a>
        </div>
        <div class="price-block">
            <div><span style="font-weight: initial; color:#000000">Giá tạm tính: <span class="giavnd_show"></span> VNĐ (¥<span class="giacyn_show"></span>)</span></div>
            <div><span style="font-weight: initial; color:#000000">Tỉ giá: <span class="tigia_show"></span> VNĐ</span></div>
            <div style="margin-top:10px">
                <p style="line-height:20px; font-size: 10px; color:#000000">Vui lòng tắt Google dịch, chọn đầy đủ thuộc tính của sản phẩm (màu sắc, kích thước, số lượng...)</p>
                <p class="_addon-message box-warning-ao alert-after">
                    <span></span>
                    <span></span>
                    <span class="close-warning-ao _close-warning-ao alert-after></span>
                </p>
            </div>
    </div>
    <div class="alert-infor" style="clear:both">
    </div>
</div>
<div id="block_button_cnporder">
    <div style="padding-top: 2px; font-size: 10px; float: right;">
    <a href="javascript:void(0)" class="btn btn-danger _addToCart">
        <i class="pull-left"></i> Thêm vào giỏ hàng
    </a>                    
    <a href="https://khachhang.hqc247.vn/gio-hang.html" target="_blank" class="btn btn-success _link-detail-cart">
        <i class="pull-left"></i> Xem giỏ hàng
    </a>
    </div>
</div>
<hr style="margin-top: 10px; display: none">`;

window.setTimeout(() => appendToExistTagByClass(content_change), 1000);

function stripHtmlToText(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    var res = tmp.textContent || tmp.innerText || '';
    res.replace('\u200B', ''); // zero width space
    res = res.trim();
    return res;
}
//region -- LocalStorage --
var LocalStorage = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var saved = localStorage.getItem(key);
        saved = JSON.parse(saved);
        return saved;
    },
    remove: function (key) {
        if (key) {
            localStorage.removeItem(key);
        }
    }
};
//endregion

var translate_value_bg;

/* START xử lý template */

//console.info("START");

var elem = document.createElement("div");
elem.className = '_addon-template';
document.body.insertBefore(elem, document.body.childNodes[0]);

document.querySelectorAll("._addon-template")[0].style.display = 'none';
function hide_messageorder () {
    $("#myModal").dialog("close");
    $("#myModal").modal("hide");
    document.getElementById("myModal").remove();
    $(".indicator-hpo").addClass("hidden");
    $(".indicator-hpo").removeClass("shown");
}
$(document).on('click', '.hpo-close-popup', function () {
    hide_messageorder();
});
function show_messageorder(content, title = 'Thông báo', type = 0) {
    var obj = $('body');
    var action_href = "";
    var action_text = "OK";
    if (type == 1) {
        action_href = 'https://khachhang.hqc247.vn/tai-khoan/dang-nhap';
        action_text = 'Đăng nhập';
    }
    setTimeout(function () {       
        new $.Zebra_Dialog(
            content,
            {
                'type': false,
                'title': title,
                'buttons': [
                    {'caption': action_text, callback: function() {
                        if(action_href != "") {
                            Object.assign(document.createElement('a'), {
                                target: '_blank',
                                href: action_href,
                                }).click();
                        }
                        $(".indicator-hpo").addClass("hidden");
                        $(".indicator-hpo").removeClass("shown");
                    }},
                ],
                'width': 480,
                'height': 220,
                'center_buttons': true
            }
        );
    }, 100);
}
function load_template() {
    if (window.navigator.languages) {
        language = window.navigator.languages[0];
    } else {
        language = window.navigator.userLanguage || window.navigator.language;
    }
    //alert(language);
    var con = document.querySelectorAll("._addon-template")[0];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {

        if (xhr.readyState == 4 && xhr.status == 200) {
            con.innerHTML = xhr.responseText;

            var icon = document.querySelectorAll("._icon-button-add-to-cart-custom");
            if (icon.length && button_add_to_cart_url) {
                icon[0].style.backgroundImage = "url('" + button_add_to_cart_url + "')";
            }

            setTimeout(function () {
                var er = SessionStorage.get("exchange_rate");
                if (er == null) {
                    //Luôn lấy qua background
                    chrome.runtime.sendMessage({
                        action: "getExchangeRate",
                        method: 'GET',
                        url: exchange_rate_url,
                        callback: 'afterGetExchangeRate'
                    });
                } else {
                    exchange_rate = parseFloat(er).toFixed(0);
                    start();
                }
            }, 2000);
        }
    };

    xhr.open("GET", chrome.runtime.getURL("../template/index.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
}

chrome.runtime.sendMessage({
    action: "getTranslateValue",
    callback: 'afterGetTranslateValue'
});

chrome.runtime.sendMessage({
    action: "test",
    callback: function (response) {
        console.log(response);
    }
});
/* END xử lý template */

var site_images_url = 'https://hqc247.vn/';

var CommonTool = function () {   
    this.reRenderPricePreview = function () {

        var self = this;
        var homeLand = this.getHomeLand();
        if (homeLand == 'TAOBAO' || homeLand == 'TMALL') {
            var object = new factory(cart_url, add_to_cart_url);

            setInterval(function () {
                try {
                    var priceOrigin = object.getOriginPrice();
                    var pricePromotion = object.getPromotionPrice();

                    if ($.isArray(priceOrigin)) {
                        priceOrigin = priceOrigin[0];
                    }

                    if ($.isArray(pricePromotion)) {
                        pricePromotion = pricePromotion[0];
                    }

                    if (isNaN(priceOrigin)) {
                        priceOrigin = 0;
                    }

                    if (isNaN(pricePromotion)) {
                        pricePromotion = 0;
                    }

                    var price = [priceOrigin, pricePromotion].min();
                    self.processPrice(price, homeLand);

                } catch (e) {

                }

            }, 1000);
        }
    };

    /**
     * add disabled to button add cart AddToCart
     */
    this.addDisabledButtonCart = function () {
        $('._addToCart').attr("disabled", "disabled");
    };

    /**
     * remove disabled to button add cart AddToCart
     */
    this.removeDisabledButtonCart = function () {
        $('._addToCart').removeAttr("disabled");
    };

    this.loadOptionCategory = function () {
        if (catalog_scalar_url) {
            //Link lấy danh mục mặc định là lấy qua background
            chrome.runtime.sendMessage({ action: "getCategory", url: catalog_scalar_url, callback: 'afterGetCategory' });
        }
    };

    /**
     * get origin site
     * @returns {*}
     */
    this.getOriginSite = function () {
        return window.location.hostname;
    };

    this.getHomeLand = function () {

        var url = window.location.href;
        if (url.match(/taobao.com/)) {
            return "TAOBAO";
        }
        if (url.match(/tmall.com|tmall.hk|yao.95095.com/)) {
            return "TMALL";
        }
        if (url.match(/1688.com|alibaba/)) {
            return "1688";
        }
        if (url.match(/hqc247.vn/)) {
            return "hqc247.vn";
        }
        return null;
    };

    this.currency_format = function (num, rounding) {
        if (!$.isNumeric(num)) {
            return num;
        }
        if (rounding === null || typeof rounding === 'undefined' || rounding == false) {
            var roundingConfig = 10;
            num = Math.ceil(num / roundingConfig) * roundingConfig;
        }
        num = num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

        return (num);
    };

    this.getExchangeRate = function () {
        return exchange_rate;
    };

    this.trackError = function (link, error, TrackUrl) {
        var param = "link=" + link + "&error=" + error + "&tool=bookmarklet";

        $.ajax({
            url: TrackUrl,
            type: "POST",
            data: param,
            success: function (data) {

            }
        });
    };

    this.hasClass = function (element, $class) {
        return (element.className).indexOf($class) > -1;
    };

    this.resizeImage = function (image) {
        return image.replace(/[0-9]{2,3}[x][0-9]{2,3}/g, '150x150');
    };

    this.getParamsUrl = function (name, link) {
        var l = '';
        if (link) {
            l = link;
        } else {
            l = window.location.href;
        }
        if (l == '') return null;

        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(l);
        if (results === null) return null;

        return results[1] || 0;
    };

    this.processPrice = function (price, site) {

        if (document.getElementsByClassName('previewPrice').length) {
            for (var k = 0; k < document.getElementsByClassName('previewPrice').length; k++) {
                document.getElementsByClassName('previewPrice')[k].remove();
            }
        }

        if (price == null || parseFloat(price) == 0)
            return 0;
        var p = 0;
        if (price.constructor === Array) {
            p = String(price[0]).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
        } else {
            var range_prices = price.split('-');
            price = range_prices.length == 2 ? range_prices[1] : price;
            p = String(price).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
        }

        if (isNaN(p) || parseFloat(price) == 0) {
            return 0;
        }

        var price_show = "";
        var pri = 0;
        if (price.constructor === Array && price.length > 1) {
            var pri_start = this.currency_format(parseFloat(price[0]) * this.getExchangeRate());
            var key_end = price.length - 1;
            var pri_end = this.currency_format(parseFloat(price[key_end]) * this.getExchangeRate());
            if (parseFloat(price[key_end]) > 0) {
                price_show = pri_start + " ~ " + pri_end;
            } else {
                price_show = pri_start;
            }

        } else {
            pri = price.constructor === String ? parseFloat(price.replace('￥','')) : parseFloat(price);
            price_show = this.currency_format(pri * this.getExchangeRate());
        }
        var li = document.createElement('li');
        var J_PromoPrice = null;
        priceshowout = price_show;
        pricecynout = pri;
        $(".giavnd_show").html(priceshowout);
        $(".giacyn_show").html(pri);
        var tigia = this.currency_format(this.getExchangeRate(), 'nochange');
        $(".tigia_show").html(tigia);

        if (site == 'TMALL' || site == 'TAOBAO') {
            J_PromoPrice = document.getElementById('J_StrPrice');

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_priceStd');
            }

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_StrPriceModBox');
            }

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_PromoPrice');
            }

            if (J_PromoPrice != null || J_PromoPrice.length != 0) {
                J_PromoPrice.parentNode.insertBefore(li, J_PromoPrice.nextSibling);
            }

        }
        return parseFloat(p);
    };
    this.sendAjaxToCartNHSG = function (add_cart_url, data) {
        setTimeout(function () {
            //Luon gui qua background
            chrome.runtime.sendMessage({ action: "addToCartNHSG", url: add_cart_url, data: data, method: 'PUT', callback: 'afteraddToCartNHSG' });
        }, 100);
    };
    this.compareStringF = function (str1, sp1, str2, sp2) {
        let array1 = str1.split(sp1).slice().sort();;
        let array2 = str2.split(sp2).slice().sort();;
        return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
    }
    this.loadJsFile = function (jsUrl) {
        var file_ali = document.createElement('script');
        file_ali.setAttribute('src', jsUrl + '?t=' + Math.random());
        document.body.appendChild(file_ali);
        return true;
    };
    this.key_translate_lib = function (key) {
        var translate = [];
        translate['颜色'] = 'Màu';
        translate['尺码'] = 'Kích cỡ';
        translate['尺寸'] = 'Kích cỡ';

        translate['价格'] = 'Giá';
        translate['促销'] = 'Khuyến mại';
        translate['数量'] = 'Số Lượng';
        translate['销量'] = 'Chính sách';
        translate['评价'] = 'Đánh Giá';
        translate['颜色分类'] = 'Màu sắc';
        translate['促销价'] = 'Giá';

        translate['套餐类型'] = 'Loại';
        translate['单价（元）'] = 'Giá (NDT)';
        translate['库存量'] = 'Tồn kho';
        translate['采购量'] = 'SL mua';

        translate['材质保障'] = "Chất lượng";
        translate['15天包换'] = "15 đổi trả";
        translate['48小时发货'] = "48 giờ giao hàng";

        var detect = key;
        if (translate[key]) {
            detect = translate[key];
        }
        return detect;
    };
    this.stripTags = function (object) {
        if (typeof object == 'object') {
            return object.replaceWith(object.html().replace(/<\/?[^>]+>/gi, ''));
        }
        return false;
    };

    this.setCategorySelected = function (category_id) {
        this.setCookie("category_selected", category_id, 100);
        return true;
    };

    this.getCategorySelected = function () {
        return this.getCookie("category_selected");
    };

    this.translate_guarantee_type = function () {
        var process = false;

        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate) {
                process = true;
            }

        } else {//Nếu ko sử dụng setting thì lấy giá trị ở cookie

            if (translate_value_bg == 1) {
                process = true;
            }

        }

        try {
            if (process) {
                var list = document.querySelectorAll("ul.guarantee-type > li");
                for (var i = 0; i < list.length; i++) {
                    if (i < 3) {
                        var text = list[i].getElementsByTagName("div")[0].getElementsByTagName("a")[0].textContent.trim();
                        if (text) {
                            var text_translate = this.key_translate_lib(text);
                            if (text_translate) {
                                list[i].getElementsByTagName("div")[0].getElementsByTagName("a")[0].textContent = text_translate;
                            }
                        }

                    }
                }
            }
        } catch (e) {
        }

    };

    this.translate_title = function (title, type, object) {
        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate) {
                //Luôn gửi qua background
                chrome.runtime.sendMessage({
                    action: "translate", url: translate_url, method: 'POST', data: { text: title, type: type }, callback: 'afterTranslate'

                });

                return true;
            }

        } else {
            if (translate_value_bg == 1) {
                //Luôn gửi qua background
                chrome.runtime.sendMessage({
                    action: "translate", url: translate_url, method: 'POST', data: { text: title, type: type }, callback: 'afterTranslate'

                });

                return true;
            }

        }

        return false;
    };

    this.translate = function (dom, type) {
        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate && type == "properties") {
                this.translateStorage(dom);
            }

        } else {//Nếu ko sử dụng setting thì lấy giá trị ở cookie

            if (translate_value_bg == 1) {
                if (type == "properties") {
                    this.translateStorage(dom);
                }
            }

        }

    };

    this.translateStorage = function (dom) {
        //write by vanhs | edit_time: 13/06/2015
        try {
            var content;
            try {//for jquery
                content = dom.text();
            } catch (m) {//for javascript
                content = dom.textContent;
            }

            var content_origin = content;
            var resource = keyword;
            if (resource != null) {
                var data = resource.resource;

                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    try {
                        if (content.match(obj.k_c, 'g')) {
                            content = content.replace(obj.k_c, obj.k_v + ' ');
                        }
                    } catch (ex) {
                        try {
                            if (content.match(obj.keyword_china, 'g')) {
                                content = content.replace(obj.keyword_china, obj.keyword_vi + ' ');
                            }
                        } catch (ex) {

                        }

                    }
                }
                try {//for jquery
                    dom.text(content);
                    dom.attr('data-text', content_origin);
                } catch (k) {
                    dom.innerHTML = content;
                    dom.setAttribute("data-text", content_origin);
                }

            }
        } catch (e) {
            console.log("error: " + e.message);
        }
    };

    this.ajaxTranslate = function (dom, type) {
        var context = dom.text();

        $.ajax({
            url: translate_url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            data: {
                text: context,
                type: type
            },
            success: function (data) {
                var result = $.parseJSON(data);
                if (result['data_translate'] && result['data_translate'] != null) {
                    dom.attr("data-text", dom.text());
                    dom.text(result['data_translate']);
                }
            }
        });
    };

    this.getKeywordSearch = function () {
        $.ajax({
            url: translate_keyword_url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            data: {
                text: "text",
                type: "type"
            },

            success: function (data) {
                var resource = JSON.stringify(data);
                localStorage.setItem("keyword_search", resource);
            }
        });
        return true;
    };

    /* Hien thi input khi xảy ra lỗi lấy dữ liệu*/
    this.showInputEx = function (site) {
        $('.frm-tool').hide();
        $('li#li_sd_price').fadeIn();
        var box_input_exception = $('#_box_input_exception');
        box_input_exception.show();
        box_input_exception.attr("data-is-show", 1);

        var price_dom = $('#_price');

        var object = new factory(cart_url, add_to_cart_url);
        var price_origin = object.getPriceInput();
        var properties_origin = object.getPropertiesInput();
        var quantity = object.getQuantityInput();
        if (quantity == "" && properties_origin == "" && price_origin == "") {
            price_dom.focus();
            $("._close_tool").click();
        }
        return false;
    };

    this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
        return true;
    };

    this.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
};

var factory = function (cart_url, add_cart_url) {
    var _class;

    var url = window.location.href;
    if (url.match(/taobao.com/)) {
        _class = new taobao(cart_url);
    }
    if (url.match(/tmall.com|tmall.hk|yao.95095.com/)) {
        _class = new tmall(cart_url);
    }
    if (url.match(/1688.com|alibaba/)) {
        _class = new alibaba(cart_url, add_cart_url);
    }
    return _class;
};

/**
 * Created by Admin on 9/19/14.
 */
var AddonTool = function () {
    /**
     * item_data: Array
     * keys: amount, color, size
     */
    this.common_tool = new CommonTool();

    /* Cho vao gio hang doi voi Tmall va taobao */
    this.AddToCart = function () {
        $('.indicator-hpo').removeClass('hidden');
        $('.indicator-hpo').addClass('shown');
        var error = 0;
        var object = new factory(cart_url, add_to_cart_url);
        var is_show = $('#_box_input_exception').attr("data-is-show");
        var price_origin = '',
            price_promotion = '',
            properties_translated = '',
            properties_origin = '',
            quantity = '',
            shop_id = '',
            seller_id = '',
            shop_name = '',
            shop_wangwang = '',
            title_origin = '',
            title_translate = '',
            comment = '',
            link_origin = '',
            item_id = '',
            image_origin = '';
        var select_category = $('._select_category');
        var loaded_category = select_category.attr('data-loaded');
        var category_id = select_category.val();
        //Nếu lấy category name thì lấy dòng này
        var category_name = $(".savedb [value='" + category_id + "']").text();
        var brand = $('._brand_item').val();
        while (category_name.match(/-/i)) {
            category_name = category_name.replace(/-/i, "");
        }
        if (category_id === "-1") {
            category_name = $('._input_category').val();
        }
        var check_select = object.checkSelectFull();
        if (!check_select) {
            show_messageorder("Yêu cầu chọn đầy đủ thuộc tính của SP");
            this.common_tool.removeDisabledButtonCart();
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }
        image_origin = object.getImgLink();
        shop_id = object.getShopId();
        shop_name = object.getShopName();
        seller_id = object.getSellerId();
        shop_wangwang = object.getWangwang();
        if (shop_wangwang == '') {
            shop_wangwang = shop_name;
        }
        if(!shop_id && shop_name) {
            shop_id = shop_name.hashCode();
        }
        title_origin = object.getTitleOrigin();
        title_translate = object.getTitleTranslate();

        comment = object.getCommentInput();

        link_origin = window.location.href;
        item_id = object.getItemID();

        var data_value = object.getDataValue();
        var outer_id = object.getOuterId(data_value);

        if ($.isArray(outer_id)) {
            outer_id = outer_id[0];
        }

        var site = this.common_tool.getHomeLand();

        var stock = object.getStock();

        if (!$.isNumeric(stock) || parseInt(stock) <= 0) {
            stock = 99;
        }

        try {
            price_origin = object.getOriginPrice();
            price_promotion = object.getPromotionPrice();

            if ($.isArray(price_origin)) {
                price_origin = price_origin[0];
            }

            if ($.isArray(price_promotion)) {
                price_promotion = price_promotion[0];
            }
            properties_translated = object.getProperties();
            properties_origin = object.getPropertiesOrigin();
            quantity = object.getQuantity();
        } catch (ex) {
            error = 1;
            price_origin = price_promotion = object.getPriceInput();
            properties_origin = properties_translated = object.getPropertiesInput();
            quantity = object.getQuantityInput();
        }

        if (!((parseFloat(price_origin) > 0 || parseFloat(price_promotion) > 0) && parseFloat(quantity) > 0)) {
            error = 1;
            price_origin = price_promotion = object.getPriceInput();
            properties_origin = properties_translated = object.getPropertiesInput();
            quantity = object.getQuantityInput();
        }

        /**
         * Trong trường hợp xảy ra lỗi đối với Gia, So luong,properties sẽ show form để khách hàng tự động nhập
         */
        if ((error && parseFloat(is_show) != 1) || !(parseFloat(is_show) == 1
            || parseFloat(price_promotion) > 0 || parseFloat(price_origin) > 0)) {
            this.common_tool.showInputEx();
            this.common_tool.removeDisabledButtonCart();
            return false;
        }

        if (!((parseFloat(price_origin) > 0 || parseFloat(price_promotion) > 0) && parseFloat(quantity) > 0) && parseFloat(is_show) == 1) {
            show_messageorder("Yêu cầu bổ sung thông tin.");
            $('#_price').focus();
            this.common_tool.removeDisabledButtonCart();
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }

        if (!$.isNumeric(price_promotion) && parseFloat(is_show) == 1) {
            show_messageorder("Yêu cầu nhập giá của sản phẩm");
            $('#_price').focus();
            this.common_tool.removeDisabledButtonCart();
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }

        var location_sale = object.getLocationSale();
        const note = $('._comment_item').val();
        var data_nhsg = {
            ShopID: shop_id,
            ShopName: shop_name,
            Site: site,
            Note: "",
            Products: [
                {
                    title_origin: $.trim(stripHtmlToText(title_origin)),
                    title_translated: $.trim(stripHtmlToText(title_translate)),
                    price_origin: price_origin,
                    price_promotion: price_promotion,
                    property_translated: properties_translated,
                    property: properties_origin,
                    data_value: data_value,
                    image_model: image_origin,
                    image_origin: image_origin,
                    shop_id: shop_id,
                    shop_name: shop_name,
                    seller_id: seller_id,
                    wangwang: shop_wangwang,
                    quantity: quantity,
                    stock: stock,
                    location_sale: location_sale,
                    site: site,
                    item_id: item_id,
                    link_origin: link_origin,
                    outer_id: outer_id,
                    error: error,
                    weight: 0,
                    step: 1,
                    brand: brand,
                    category_name: category_name,
                    category_id: category_id,
                    tool: "Addon",
                    version: version_tool,
                    is_translate: object.isTranslatePage(),
                    comment: note
                }
            ]            
        };

        this.common_tool.sendAjaxToCartNHSG(add_to_cart_url, data_nhsg);
    };
};

var buttonAddCartQuickText = '';

var taobao = function (cart_url) {

    this.source = 'taobao';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        var detail = $('#detail');
        detail.css('border', '1px solid red');
        detail.css('font-size', '11px');
        detail.css('min-width', '1240px');
        $('.tb-rmb').remove();
        // this.alert();
        this.parse();
    };

    //TAOBAO | Hàm hiển thị cảnh báo trên addon
    this.alert = function () {
        //console.info("alert");
        //Cảnh báo về độ tin cậy của shop
        var text = "";

        try {

            var creditLevel = -1;
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent.replace(/\s/g, '');
                var res = html.search("KISSY.merge");
                if (res != -1) {
                    var n = html.match(/creditLevel:"([\s\S]*?)"/i);
                    creditLevel = n[1].trim();
                    break;
                }
            }

            //Nếu ng bán có 2 kim cương trở xuống thì hiển thị cảnh báo uy tín thấp
            if (creditLevel >= 1 && creditLevel <= 7) {
                // text += 'Người bán này có uy tín thấp. Quý khách cân nhắc trước khi đặt hàng. Vui lòng tham khảo <a href="' + link_store_review_guidelines + '" target="_blank">đánh giá điểm uy tín tại đây.</a>';
                text += 'Người bán này có uy tín thấp. Quý khách cân nhắc trước khi đặt hàng.';
            }

        } catch (e) {
            //console.warn(e.message);
        }

        if (text) {
            $("._addon-message").removeClass("hidden").find("span:eq(0)").html(text);
        }

    };

    /**
     * site: taobao
     * @returns {boolean}
     */
    this.parse = function () {

        var common = this.common_tool;
        $('.tb-property-type').each(function (index, value) {
            var text = $(this).text();
            $(this).text(common_tool.key_translate_lib(text));
        });
        // this.common_tool.loadOptionCategory();

        var price = this.getPromotionPrice("TAOBAO");
        var price_html = '<p style="font-size: 16px;margin-top: 15px;">' +
            'Tỉ giá: ' + common.currency_format(common.getExchangeRate(), true) + ' VNĐ / 1 CNY</p>';
        var j_str_price = $('#J_StrPriceModBox');
        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('.tm-promo-price');
        }

        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('.tb-detail-hd');
        }
        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('#J_PromoPrice');
        }
        if (j_str_price != null && j_str_price != "") {
            //j_str_price.append(price_html);// hiển thị tỉ giá phần bên dưới trang (k muốn hiển thị nữa)
        }

        var title_content = this.getTitleOrigin();

        //common.setIsTranslateToCookie();

        common.translate_title(title_content, 'title', this);

        this.translateProperties();

        this.common_tool.reRenderPricePreview();

        return false;
    };

    this.translateProperties = function () {
        var common = this.common_tool;
        var span_pro = $('.J_TSaleProp li span');
        if (span_pro == null || span_pro.length == 0) {
            span_pro = $('.J_SKU a span');
        }
        span_pro.each(function () {
            common.translate($(this), "properties");
        });
    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll("#J-From")[0].textContent;
        } catch (e) {
            //console.info("TAOBAO | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    this.set_translate = function (data) {
        var _title = this.getDomTitle();

        if (_title != null && data.title != "") {
            _title.setAttribute("data-text", _title.textContent);
            _title.textContent = data.title;
        }
    };

    this.getPromotionPrice = function (site) {
        try {
            var span_price = null;
            var normal_price = document.getElementById('J_StrPrice');
            if (normal_price == null) {
                normal_price = document.getElementById("J_priceStd");
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_StrPriceModBox');
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_PromoPrice');
            }

            var promotion_price = document.getElementById('J_PromoPrice');

            var price = 0;
            if (promotion_price == null) {
                promotion_price = normal_price;
            }

            if (promotion_price != null) {
                try {

                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    }

                    /*
                     * fix công cụ: Link sản phẩm không hiện giá VND
                     * http://world.taobao.com/item/523372039199.htm?spm=a312a.7700714.0.0.IJ566v#detail
                     *
                     * */
                    if (!price) {
                        promotion_price = normal_price;
                    }
                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    }

                } catch (e) {
                    price = 0;
                }
            }

            return this.common_tool.processPrice(price, site);
        } catch (ex) {
            throw Error(ex.message + " Line:" + ex.lineNumber + " function getPromotionPrice");
        }
    };

    this.getStock = function () {
        try {
            var stock_id = document.getElementById('J_EmStock');
            var stock = 99;
            if (stock_id == null || stock_id == 'undefined') {
                stock_id = document.getElementById("J_SpanStock");
            }

            if (stock_id != null && stock_id != 'undefined') {
                stock = stock_id.textContent;
                stock = parseInt(stock.replace(/[^\d.]/g, ''));
            }
        } catch (ex) {
            stock = 99;
        }


        return stock;
    };

    this.getOriginPrice = function () {
        try {
            var str_price = $('#J_StrPrice');
            var origin_price = str_price.find('.tm-price');

            if (origin_price == null || origin_price.length == 0) {
                origin_price = str_price.find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tb-rmb-num');
            }

            var price = origin_price.text();
            price = price.match(/[0-9]*[\.,]?[0-9]+/g);

            return this.common_tool.processPrice(price);
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getOriginPrice");
        }
    };

    this.getOuterId = function (data_value) {
        try {
            var scripts = document.getElementsByTagName('script');
            var skuId = "";
            var skuMap = null;
            if (scripts.length > 0) {
                for (var script = 0; script < scripts.length; script++) {
                    if (scripts[script].innerHTML.match(/Hub\.config\.set/)) {
                        try {
                            detailJsStart();
                            skuId = Hub.config.get('sku').valItemInfo.skuMap[";" + data_value + ";"].skuId;
                        } catch (e) {
                            skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                            skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                        }
                    } else if (scripts[script].innerHTML.match(/TShop\.Setup/)) {
                        skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                        skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                    }
                }
            }

            return skuId;
        } catch (ex) {
            return "";
        }
    };

    this.getTitleTranslate = function () {
        try {
            var _title = this.getDomTitle();
            var title_translate = _title.textContent;
            if (title_translate == "") {
                title_translate = _title.getAttribute("data-text");
            }
            return title_translate;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleOrigin = function () {

        try {
            var _title = this.getDomTitle();
            var title_origin = _title.getAttribute("data-text");
            if (title_origin == "" || typeof title_origin == "undefined" || title_origin == null) {
                title_origin = _title.textContent;
            }
            return title_origin;
        } catch (ex) {
            return "";
        }

    };

    this.getDomTitle = function () {
        try {
            var _title = null;
            if (document.getElementsByClassName("tb-main-title").length > 0) {
                _title = document.getElementsByClassName("tb-main-title")[0];
            }

            if (_title == null && document.getElementsByClassName("tb-detail-hd").length > 0) {
                var h = document.getElementsByClassName("tb-detail-hd")[0];
                if (h.getElementsByTagName('h3').length > 0 && h != null) {
                    _title = h.getElementsByTagName('h3')[0];
                } else {
                    _title = h.getElementsByTagName("h1")[0];
                }
            }

            if (_title.textContent == "" && document.getElementsByClassName("tb-tit").length > 0) {
                _title = document.getElementsByClassName("tb-tit")[0];
            }
            if (_title.textContent == "") {
                _title = document.querySelectorAll('h3.tb-item-title');
                if (_title != null) {
                    _title = _title[0];
                } else {
                    _title = document.getElementsByClassName('tb-item-title');
                    if (_title.length > 0) {
                        _title = _title[0];
                    }
                }
            }
            return _title;
        } catch (ex) {
            return null;
        }
    };

    this.getShopName = function () {
        try {
            var shop_name = '';
            if (document.getElementsByClassName('tb-seller-name').length > 0) {
                shop_name = document.getElementsByClassName('tb-seller-name')[0].textContent;

                if (shop_name == '' || shop_name == null) {

                    var shop_card = document.getElementsByClassName('shop-card');
                    var data_nick = shop_card.length > 0 ? shop_card[0].getElementsByClassName('ww-light') : '';
                    shop_name = (data_nick.length > 0 ? data_nick[0].getAttribute('data-nick') : '');
                    if (shop_name == '') {
                        /* Find base info*/
                        if (document.getElementsByClassName('base-info').length > 0) {
                            for (var i = 0; i < document.getElementsByClassName('base-info').length; i++) {
                                if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller').length > 0) {
                                    if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang').length > 0) {
                                        shop_name = document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang')[0].getAttribute('data-nick');
                                        break;
                                    }
                                    if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('ww-light').length > 0) {
                                        shop_name = document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('ww-light')[0].getAttribute('data-nick');
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else if ($('#J_tab_shopDetail').length > 0) {
                shop_name = $('#J_tab_shopDetail').find('span').first().data('nick');
            }
            shop_name = shop_name.trim();

            if (!shop_name && document.querySelectorAll(".tb-shop-name").length > 0) {
                shop_name = document.querySelectorAll(".tb-shop-name")[0].getElementsByTagName("a")[0].getAttribute("title");
            }

            if (!shop_name && document.querySelectorAll(".shop-name").length > 0) {
                shop_name = document.querySelectorAll(".shop-name")[0].getElementsByTagName("a")[0].outerText;
            }

            return shop_name;
        } catch (ex) {
            return "";
        }

    };

    /**
     * taobao
     * @returns {string}
     */
    this.getShopId = function () {
        var shop_id = '';
        var flag = document.querySelector('meta[name="microscope-data"]');
        if (flag) {
            try {
                var string = document.querySelector('meta[name="microscope-data"]').getAttribute("content");
                if (string) {
                    var array = string.split(';');
                    if (array.length > 0) {
                        for (var i = 0; i < array.length; i++) {
                            var str = array[i];
                            str = str.trim();
                            var params = str.split('=');
                            var key = params[0];
                            var value = params[1];
                            if (key == 'shopId') {
                                shop_id = value;
                                break;
                            }
                        }
                    }
                }
            } catch (ex) {
                //console.info("Không lấy được shop_id." + ex.message);
            }
        } else {
            try {
                var shop_tilte_text;
                if (document.querySelector('.shop-title-text')) {
                    shop_tilte_text = document.querySelector('.shop-title-text').getAttribute("href");
                } else {
                    shop_tilte_text = document.querySelectorAll(".tb-shop-name")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].getAttribute("href")
                }
                shop_tilte_text = shop_tilte_text.replace("//shop", "");
                var tmp = shop_tilte_text.split('.');
                shop_id = tmp[0];
            } catch (ex) {
                //console.info("Không lấy được shop_id." + ex.message);
            }
        }

        shop_id = 'taobao_' + shop_id;

        return shop_id;
    };

    this.getSellerId = function () {
        var sellerId = "";
        try {
            var dataApi = document.querySelectorAll("#J_listBuyerOnView")[0].getAttribute("data-api");
            var a = dataApi.split("?");
            var b = a[1];
            var c = b.split("&");
            if (c.length) {
                for (var i = 0; i < c.length; i++) {
                    if (c[i]) {
                        var tmp = c[i].split("=");
                        if (tmp[0].trim() == "seller_num_id") {
                            sellerId = tmp[1];
                            break;
                        }
                    }
                }
            }

        } catch (e) {
            //console.info("TAOBAO | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }

        if (!sellerId) {
            try {
                sellerId = document.querySelectorAll("#J_Pine")[0].getAttribute("data-sellerid");
            } catch (e) {

            }
        }

        if (!sellerId) {
            try {
                var content = document.querySelectorAll("[name='microscope-data']")[0].getAttribute("content");
                var arr = content.split(";");
                for (var k = 0; k < arr.length; k++) {
                    if (arr[k]) {
                        var temp = arr[k].split("=");
                        if (temp[0].trim() == "userid") {
                            sellerId = temp[1].trim();
                            break;
                        }
                    }
                }
            } catch (e) {

            }
        }

        //console.info("sellerId: " + sellerId);

        return sellerId;
    };

    this.getProperties = function () {
        //console.log("TAOBAO | getProperties");
        //write by vanhs | edit_time: 13/06/2015
        var color_size = '';
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            if (!selected_props.length) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin) {
                        var c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        if (c_s) { color_size += c_s.trim() + ';'; }
                    }
                }
            }
        } catch (e) {
            console.warn("TAOBAO | getProperties: " + e.message);
        }
        return color_size;
    };

    this.getPropertiesOrigin = function () {
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            var color_size = '';

            if (!((typeof selected_props !== 'object' && selected_props != "" && selected_props != null)
                || (typeof selected_props === 'object' && selected_props.length > 0))) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin != null) {
                        var c_s = li_origin.getElementsByTagName('span')[0].getAttribute("data-text");
                        if (c_s == "" || c_s == null || typeof c_s == "undefined") {
                            c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        }
                        color_size += c_s + ';';
                    }
                }
            }
            return color_size;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getPropertiesOrigin");
        }

    };

    this.getDataValue = function () {
        try {

            var data_value = '';
            var tb_selected = document.getElementsByClassName('tb-selected');
            for (var i = 0; i < tb_selected.length; i++) {
                var v = '';
                if (tb_selected[i].className.indexOf('J_SKU') > -1) {
                    v = tb_selected[i].getAttribute('data-pv');
                } else {
                    v = tb_selected[i].getAttribute('data-value');
                }
                if (v) {
                    data_value += v + ';';
                }
            }

            return data_value;

        } catch (ex) {
            return "";
        }

    };

    this.getWangwang = function () {
        try {
            var wangwang = "";

            var span_wangwang = $('.tb-shop-ww .ww-light');

            if (span_wangwang != null && span_wangwang != '' && span_wangwang.length > 0) {
                wangwang = span_wangwang.attr('data-nick');
            }

            if (wangwang == '') {
                span_wangwang = document.querySelectorAll("span.seller");

                if (span_wangwang == null || span_wangwang == "" || span_wangwang == "undefined" || span_wangwang.length == 0) {
                    var div_wangwang = document.getElementsByClassName('slogo-extraicon');
                    if (div_wangwang != null && div_wangwang != "" && div_wangwang != "undefined" && div_wangwang.length > 0) {
                        span_wangwang = div_wangwang[0].getElementsByClassName("ww-light");
                    }
                }

                if (span_wangwang == null || span_wangwang == '' || span_wangwang.length == 0) {
                    span_wangwang = document.querySelectorAll("div.hd-shop-desc span.ww-light");
                }


                if (span_wangwang.length > 0) {
                    var sp_wangwang = span_wangwang[0].getElementsByTagName("span");
                    if (sp_wangwang != null && sp_wangwang != '' && sp_wangwang.length == 0) {
                        wangwang = decodeURIComponent(sp_wangwang[0].getAttribute('data-nick'));
                    } else {
                        wangwang = decodeURIComponent(span_wangwang[0].getAttribute('data-nick'));
                    }
                }
            }
        } catch (ex) {
            wangwang = "";
        }
        return wangwang;
    };

    this.checkSelectFull = function () {
        var props = document.getElementsByClassName('J_TSaleProp');
        if (!((typeof props != 'object' && props != "" && props != null)
            || (typeof props === 'object' && props.length > 0))) {

            props = document.querySelectorAll("ul.tb-cleafix");
        }
        var full = true;
        if (props.length > 0) {
            /*            kiem tra so Thuộc tính da chon cua sp*/
            var count_selected = 0;
            for (var i = 0; i < props.length; i++) {
                var selected_props = props[i].getElementsByClassName('tb-selected');
                if (selected_props != null && selected_props != 'undefined')
                    count_selected += selected_props.length;
            }
            if (count_selected < props.length) {
                full = false;
            }

        }
        return full;
    };

    this.getQuantity = function () {
        try {
            var quantity = '';
            var element = document.getElementById("J_IptAmount");
            if (element) {
                quantity = element.value;
            } else quantity = '';

            if (quantity == '') {
                try {
                    quantity = document.getElementsByClassName('mui-amount-input')[0].value;
                } catch (e) {
                    console.log(e);
                }
            }

            return quantity;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getQuantity");
        }

    };

    /**
     * SITE: TAOBAO
     * @returns {*}
     */
    this.getImgLink = function () {
        try {
            var img_src = "";
            try {
                var img_obj = document.getElementById('J_ImgBooth');
                if (img_obj != null) {
                    img_src = img_obj.getAttribute("src");
                    img_src = this.common_tool.resizeImage(img_src);
                    return encodeURIComponent(img_src);
                }

                img_obj = document.getElementById('J_ThumbView');

                if (img_obj != null && img_obj != "") {
                    img_src = img_obj.getAttribute("src");
                    img_src = this.common_tool.resizeImage(img_src);
                    return encodeURIComponent(img_src);
                }

                if (document.getElementById('J_ImgBooth').tagName == "IMG") {

                    var thumbs_img_tag = document.getElementById('J_UlThumb');
                    try {
                        if (thumbs_img_tag != null) {
                            img_src = thumbs_img_tag.getElementsByTagName("img")[0].src;
                        } else {
                            img_src = document.getElementById('J_ImgBooth').src;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    /*                   Find thumb image*/
                    var thumbs_a_tag = document.getElementById('J_UlThumb');
                    if (thumbs_a_tag != null) {
                        img_src = thumbs_a_tag.getElementsByTagName("li")[0].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    } else {
                        img_src = document.getElementById('J_ImgBooth').style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    }
                }

            } catch (e) {
                console.log("Image not found!" + e);
            }

            img_src = this.common_tool.resizeImage(img_src);
            return encodeURIComponent(img_src);
        } catch (ex) {
            return "";
        }

    };

    this.getItemID = function () {

        var item_id = 0;
        var home = window.location.href;
        var dom;
        //1. Lấy trên dom
        if (!item_id) {
            try {

                dom = document.getElementsByName("item_id");
                if (dom.length) {
                    item_id = dom[0].value;
                } else {
                    item_id = document.getElementsByName("item_id_num")[0].value;
                }

            } catch (e) {

            }
        }
        //2. Lấy trên link dạng http://world.taobao.com/item/521828428176.htm?*
        if (!item_id) {
            try {
                var temp = home.split('.htm')[0];
                item_id = temp.split('item/')[1];
            } catch (e) {

            }
        }

        //3. Lấy params trên url dạng ?spm=a312a.7728556.2015080705.14.fbm100&amp;id=521985720964&amp;scm=1007.12006.12548.i522577577280&amp;pvid=34d586a7-1587-44bb-8b07-1fb66252488c
        if (!item_id) {
            try {
                item_id = this.common_tool.getParamsUrl('id', home);
            } catch (e) {

            }
        }

        //console.info("item_id: " + item_id);
        return item_id;

    };

    /**
     * @desc TAOBAO, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.getElementById('J_btn_submitBuy').innerText;
        } catch (e) {
            // console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc TAOBAO, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };
};

var tmall = function (cart_url) {

    this.source = 'tmall';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        $('#detail').css('border', '2px solid orange');
        $('#detail').css('min-width', '1240px');
        this.parse();
        this.checkShopCredible();
    };

    //TMALL | Hàm kiểm tra độ tin cậy của shop
    this.checkShopCredible = function () {

        try {

            /*
             * Chưa tìm được cách để lấy độ tin cậy của shop
             * */

            //console.info("TMALL | checkShopCredible");
            //$("._alert-shop-credible").removeClass("hidden");
            //var $link = $("._alert-shop-credible").find("._link-detail-credible");
            //$link.attr("href", $link.data('tmall'));

        } catch (e) {

            //console.info("TMALL | Không kiểm tra được độ uy tín của shop");
            //console.warn(e.message);

        }

    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll("#J-From")[0].textContent;
        } catch (e) {
            //console.info("TMALL | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    /**
     * site tmall
     * @returns {boolean}
     */
    this.parse = function () {

        var common = this.common_tool;
        $('.tb-metatit').each(function () {
            var text = $(this).text();
            $(this).text(common.key_translate_lib(text));
            $(this).attr("data-title", text);
        });

        // this.common_tool.loadOptionCategory();

        $('#J_ButtonWaitWrap').hide();

        var price_html = '<p style="font-size: 16px;margin-top: 15px;">Tỉ giá: ' +
            common.currency_format(common.getExchangeRate(), true) + ' VNĐ / 1 CNY</p>';
        this.getPromotionPrice("TMALL");
        var tb_detail_hd = $('.tb-detail-hd');
        if (tb_detail_hd != null && tb_detail_hd != "") {
            //tb_detail_hd.append(price_html); //hiển thị tỉ giá phần bên dưới trang (k muốn hiển thị nữa)
        } else {
            //$('.tb-btn-buy').html(price_html); //hiển thị tỉ giá phần bên dưới trang (k muốn hiển thị nữa)
        }
        var title_content = this.getTitleOrigin();

        //common.setIsTranslateToCookie();

        common.translate_title(title_content, 'title', this);

        this.translateProperties();

        this.common_tool.reRenderPricePreview();

        return false;
    };

    this.set_translate = function (data) {
        var _title = this.getDomTitle();

        if (_title != null && data.title != "") {
            _title.setAttribute("data-text", _title.textContent);
            _title.textContent = data.title;
        }
    };

    this.translateProperties = function () {
        var common = this.common_tool;

        $('.J_TSaleProp li span').each(function () {
            common.translate($(this), "properties");
        });
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    this.checkSelectFull = function () {
        var props = document.getElementsByClassName('J_TSaleProp');
        if (!((typeof props != 'object' && props != "" && props != null)
            || (typeof props === 'object' && props.length > 0))) {

            props = document.querySelectorAll("ul.tb-cleafix");
        }
        var full = true;
        if (props.length > 0) {
            var count_selected = 0;
            for (var i = 0; i < props.length; i++) {
                var selected_props = props[i].getElementsByClassName('tb-selected');
                if (selected_props != null && selected_props != 'undefined')
                    count_selected += selected_props.length;
            }
            if (count_selected < props.length) {
                full = false;
            }
        }
        return full;
    };

    /**
     * SITE TMALL
     * @param site
     */
    this.getPromotionPrice = function (site) {
        try {
            var span_price = null;
            var normal_price = document.getElementById('J_StrPrice');

            if (normal_price == null) {
                normal_price = document.getElementById("J_priceStd");
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_StrPriceModBox');
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_PromoPrice');
            }

            var promotion_price = document.getElementById('J_PromoPrice');

            var price = 0;
            if (promotion_price == null) {
                promotion_price = normal_price;
            }

            if (promotion_price != null) {
                try {
                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-wrTuan-num').length > 0) {
                        price = document.getElementById('J_PromoPrice').getElementsByClassName('tb-wrTuan-num')[0].childNodes[1].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                    }
                } catch (e) {
                    price = 0;
                }

            }

            return this.common_tool.processPrice(price, site);
        } catch (ex) {
            throw Error(ex.message + " Line:" + ex.lineNumber + " function getPromotionPrice");
        }
    };

    /**
     * tmall
     * getOriginPrice
     */
    this.getOriginPrice = function () {
        try {
            var str_price = $('#J_StrPrice');
            var origin_price = str_price.find('.tm-price');

            if (origin_price == null || origin_price.length == 0) {
                origin_price = str_price.find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tb-rmb-num');
            }

            var price = origin_price.text();
            price = price.match(/[0-9]*[\.,]?[0-9]+/g);

            return this.common_tool.processPrice(price);
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getOriginPrice");
        }
    };

    this.getQuantity = function () {
        try {
            var quantity = '';
            var element = document.getElementById("J_IptAmount");
            if (element) {
                quantity = element.value;
            } else quantity = '';
            if (quantity == '') {
                quantity = document.getElementsByClassName('mui-amount-input')[0].value;
            }

            return quantity;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getQuantity");
        }

    };

    this.getOuterId = function (data_value) {
        try {
            var scripts = document.getElementsByTagName('script');
            var skuId = "";
            var skuMap = null;
            if (scripts.length > 0) {
                for (var script = 0; script < scripts.length; script++) {
                    if (scripts[script].innerHTML.match(/Hub\.config\.set/)) {
                        try {
                            detailJsStart();
                            skuId = Hub.config.get('sku').valItemInfo.skuMap[";" + data_value + ";"].skuId;
                        } catch (e) {
                            skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                            skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                        }
                    } else if (scripts[script].innerHTML.match(/TShop\.Setup/)) {
                        skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                        skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                    }
                }
            }

            return skuId;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleTranslate = function () {
        try {
            var _title = this.getDomTitle();
            var title_translate = _title.textContent;
            if (title_translate == "") {
                title_translate = _title.getAttribute("data-text");
            }
            return title_translate;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleOrigin = function () {
        try {
            var _title = this.getDomTitle();
            var title_origin = _title.getAttribute("data-text");
            if (title_origin == "" || typeof title_origin == "undefined" || title_origin == null) {
                title_origin = _title.textContent;
            }
            return title_origin;
        } catch (ex) {
            return "";
        }

    };

    this.getDomTitle = function () {
        var _title = null;
        if (document.getElementsByClassName("tb-main-title").length > 0) {
            _title = document.getElementsByClassName("tb-main-title")[0];
        }

        if (_title == null && document.getElementsByClassName("tb-detail-hd").length > 0) {
            var h = document.getElementsByClassName("tb-detail-hd")[0];
            if (h.getElementsByTagName('h3').length > 0 && h != null) {
                _title = h.getElementsByTagName('h3')[0];
            } else {
                _title = h.getElementsByTagName("h1")[0];
            }
        }

        if (_title.textContent == "" && document.getElementsByClassName("tb-tit").length > 0) {
            _title = document.getElementsByClassName("tb-tit")[0];
        }

        if (_title.textContent == "") {
            _title = document.querySelectorAll('h3.tb-item-title');
            if (_title != null) {
                _title = _title[0];
            } else {
                _title = document.getElementsByClassName('tb-item-title');
                if (_title.length > 0) {
                    _title = _title[0];
                }
            }
        }
        return _title;
    };

    this.getStock = function () {
        try {
            var stock_id = document.getElementById('J_EmStock');
            var stock = 99;
            if (stock_id == null || stock_id == 'undefined') {
                stock_id = document.getElementById("J_SpanStock");
            }

            if (stock_id != null && stock_id != 'undefined') {
                stock = stock_id.textContent;
                stock = parseInt(stock.replace(/[^\d.]/g, ''));
            }
        } catch (ex) {
            stock = 99;
        }

        return stock;
    };

    this.getSellerId = function () {
        var sellerId = "";
        try {
            var content = document.querySelectorAll("meta[name='microscope-data']")[0].getAttribute("content");
            var a = content.split(";");
            for (var i = 0; i < a.length; i++) {
                if (a[i]) {
                    var tmp = a[i].split("=");
                    if (tmp[0].trim() == "userid") {
                        sellerId = tmp[1];
                        break;
                    }
                }
            }
            //console.info("sellerId: " + sellerId);
        } catch (e) {
            //console.info("TMALL | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }
        return sellerId;
    };

    this.getShopName = function () {
        var shop_name = '';
        try {
            shop_name = document.getElementsByClassName('hd-shop-name')[0].getElementsByTagName('a')[0].innerText;
            if (shop_name == '' || shop_name == undefined) {
                shop_name = document.getElementsByClassName('shop-intro')[0].getElementsByTagName('a')[0].innerText;
            }
        } catch (ex) {

        }

        if (!shop_name) {
            try {
                shop_name = document.getElementsByClassName('slogo-shopname')[0].getElementsByTagName('strong')[0].innerText;
            } catch (ex) {

            }
        }

        if (!shop_name) {
            try {
                shop_name = document.querySelectorAll('[type="hidden"][name="seller_nickname"]')[0].value;
            } catch (ex) {

            }
        }

        return shop_name;
    };

    /**
     * tmall
     * @returns {string}
     */
    this.getShopId = function () {
        var shop_id = '';
        try {
            var string = document.querySelector('meta[name="microscope-data"]').getAttribute("content");
            if (string) {
                var array = string.split(';');
                if (array.length > 0) {
                    for (var i = 0; i < array.length; i++) {
                        var str = array[i];
                        str = str.trim();
                        var params = str.split('=');
                        var key = params[0];
                        var value = params[1];
                        if (key == 'shopId') {
                            shop_id = value;
                            break;
                        }
                    }
                }
            }
        } catch (ex) {

        }

        if (!shop_id) {
            try {
                var href = document.querySelectorAll(".tb-booth")[0].getElementsByTagName("a")[0].getAttribute('href');
                var a = href.split('?');
                var b = a[1].split('&');
                for (var j = 0; j < b.length; j++) {
                    var c = b[j].split('=');
                    if (c[0] == 'shopId') {
                        shop_id = c[1];
                        break;
                    }
                }
            } catch (ex) {

            }
        }
        shop_id = 'tmall_' + shop_id;
        return shop_id;
    };

    this.getProperties = function () {
        //write by vanhs | edit_time: 13/06/2015
        var color_size = '';
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            if (!selected_props.length) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin) {
                        var c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        if (c_s) { color_size += c_s.trim() + ';'; }
                    }
                }
            }
        } catch (e) {
            console.warn("TAMLL | getProperties: " + e.message);
        }
        return color_size;
    };

    this.getPropertiesOrigin = function () {
        //màu s?c
        var selected_props = document.getElementsByClassName('J_TSaleProp');
        var color_size = '';

        if (!((typeof selected_props !== 'object' && selected_props != "" && selected_props != null)
            || (typeof selected_props === 'object' && selected_props.length > 0))) {
            selected_props = document.querySelectorAll("ul.tb-cleafix");
        }
        if (selected_props.length > 0) {
            for (var i = 0; i < selected_props.length; i++) {
                var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                if (li_origin != null) {
                    var c_s = li_origin.getElementsByTagName('span')[0].getAttribute("data-text");
                    if (c_s == "" || c_s == null || typeof c_s == "undefined") {
                        c_s = li_origin.getElementsByTagName('span')[0].textContent;
                    }
                    color_size += c_s + ';';
                }
            }
        }
        return color_size;
    };

    this.getDataValue = function () {
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            var data_value = '';
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];

                    data_value += ";" + li_origin.getAttribute('data-value');
                }
            }
            if (data_value.charAt(0) == ';') {
                data_value = data_value.substring(1, data_value.length);
            }
            return data_value;
        } catch (ex) {
            return "";
        }

    };

    this.getWangwang = function () {
        try {

            var wangwang = "";

            var seller_nickname = $('input[name=seller_nickname]');

            if (seller_nickname != null && seller_nickname.length > 0) {
                wangwang = seller_nickname.val();
            }

            if (wangwang == '') {
                var span_wangwang = document.querySelectorAll("span.seller");

                if (span_wangwang != null && span_wangwang != "" && span_wangwang != "undefined" && span_wangwang.length > 0) {
                    var div_wangwang = document.getElementsByClassName('slogo-extraicon');
                    if (div_wangwang != null && div_wangwang != "" && div_wangwang != "undefined" && div_wangwang.length > 0) {
                        span_wangwang = div_wangwang[0].getElementsByClassName("ww-light");
                    }
                }

                if (span_wangwang == null || span_wangwang == '' || span_wangwang.length == 0) {
                    span_wangwang = document.querySelectorAll("div.hd-shop-desc span.ww-light");
                }

                if (span_wangwang.length > 0) {
                    var sp_wangwang = span_wangwang[0].getElementsByTagName("span");
                    if (sp_wangwang != null && sp_wangwang != '' && sp_wangwang.length == 0) {
                        wangwang = decodeURIComponent(sp_wangwang[0].getAttribute('data-nick'));
                    } else {
                        wangwang = decodeURIComponent(span_wangwang[0].getAttribute('data-nick'));
                    }
                }
            }

        } catch (ex) {
            console.log(ex);
            wangwang = "";
        }
        return wangwang;

    };

    /**
     * SITE: TMALL
     * @returns {string}
     */
    this.getImgLink = function () {
        var img_src = "";
        try {
            var img_obj = document.getElementById('J_ImgBooth');
            if (img_obj != null) { // Image taobao and t
                img_src = img_obj.getAttribute("src");
                img_src = this.common_tool.resizeImage(img_src);
                return encodeURIComponent(img_src);
            }

            img_obj = document.getElementById('J_ThumbView');

            if (img_obj != null && img_obj != "") {
                img_src = img_obj.getAttribute("src");
                img_src = this.common_tool.resizeImage(img_src);
                return encodeURIComponent(img_src);
            }

            if (document.getElementById('J_ImgBooth').tagName == "IMG") {
                // Find thumb image
                var thumbs_img_tag = document.getElementById('J_UlThumb');
                try {
                    if (thumbs_img_tag != null) {
                        img_src = thumbs_img_tag.getElementsByTagName("img")[0].src;
                    } else {
                        img_src = document.getElementById('J_ImgBooth').src;
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Find thumb image
                var thumbs_a_tag = document.getElementById('J_UlThumb');
                if (thumbs_a_tag != null) {
                    img_src = thumbs_a_tag.getElementsByTagName("li")[0].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                } else {
                    img_src = document.getElementById('J_ImgBooth').style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }

        } catch (e) {
            img_src = "";
        }

        img_src = this.common_tool.resizeImage(img_src);
        return encodeURIComponent(img_src);
    };

    this.getItemID = function () {
        try {
            var home = window.location.href;
            var item_id = this.common_tool.getParamsUrl('id', home);
            var dom_id = document.getElementsByName("item_id");
            if (item_id <= 0 || !$.isNumeric(item_id)) {
                if (dom_id.length > 0) {
                    dom_id = dom_id[0];
                    item_id = dom_id.value;
                } else item_id = 0;

                if (item_id == 0 || item_id == null || item_id == '') {
                    dom_id = document.getElementsByName("item_id_num");
                    if (dom_id.length > 0) {
                        dom_id = dom_id[0];
                        item_id = dom_id.value;
                    } else item_id = 0;
                }
            }

            if (parseInt(item_id) <= 0 || !$.isNumeric(item_id)) {
                item_id = home.split('.htm')[0];
                item_id = item_id.split('item/')[1];
            }

            return item_id;
        } catch (ex) {
            return "";
        }

    };

    /**
     * @desc TMALL, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.getElementById('J_LinkBuy').innerText;
        } catch (e) {
            // console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc TMALL, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };
};

//kk
var alibaba = function (cart_url, add_cart_url) {
    this.params_on_page = false;
    this.source = 'alibaba';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        $('#J_DetailInside').css('border', 'solid 1px blue;');

        // this.alert();
        this.parse();

        this.getParamsOnPage();
    };

    /**
     * @desc 1688, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.querySelectorAll('[trace="addtoorder1"]')[0].innerText;
        } catch (e) {
            // console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc 1688, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };

    /**
     * @author vanhs
     * @time 10:11 16/03/2016
     * @description Hàm lấy ra dữ liệu trên site gốc khi bắt đầu vào trang
     * @returns {boolean}
     */
    this.getParamsOnPage = function () {
        if (this.params_on_page) {
            return this.params_on_page;
        }
        // console.log('1 getParamsOnPage');
        // console.log(this.params_on_page);
        var self = this;
        try {
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent;
                var res = html.search("iDetailConfig");
                if (res != -1) {
                    eval(html);
                    self.params_on_page = {
                        iDetailConfig: iDetailConfig,
                        iDetailData: iDetailData
                    };

                    break;
                }
            }
        } catch (e) {
            // console.info("Can not get params on page");
            // console.warn(e.message);
        }

        // console.log('2 getParamsOnPage');
        // console.log(this.params_on_page);
        return this.params_on_page;
    };

    //1688 | Hàm hiển thị cảnh báo trên addon
    this.alert = function () {
        var text_info = "";
        /*
         * Cảnh báo về độ tin cậy của shop
         *
         * */

        //Nếu người bán có uy tín dưới 2 kim cương trở xuống thì hiển thị cảnh báo úy tín thấp.
        try {
            var star = true;//mặc định là shop có uy tín cao
            var img1 = "//cbu01.alicdn.com/cms/upload/2015/298/124/2421892_1490276829.png";//huy chương
            var img2 = "//cbu01.alicdn.com/cms/upload/2015/449/224/2422944_1490276829.png";//kim cương
            var img3 = "//cbu01.alicdn.com/cms/upload/2015/778/324/2423877_1490276829.png";//vương miện

            var len = document.querySelectorAll(".item.supply-grade > .disc > a > img[src='" + img1 + "']").length;
            if (len > 0) {
                star = false;
            } else {
                var len1 = document.querySelectorAll(".item.supply-grade > .disc > a > img[src='" + img2 + "']").length;
                if (len1 > 0 && len1 <= 2) {
                    star = false;
                }
            }

            if (!star) {
                // text_info = 'Người bán này có uy tín bán hàng thấp. Quý khách nên cân nhắc trước khi đặt hàng. Vui lòng tham khảo cách <a href="' + link_store_review_guidelines + '" target="_blank">đánh giá điểm uy tín tại đây.</a>';
                text_info = 'Người bán này có uy tín bán hàng thấp. Quý khách nên cân nhắc trước khi đặt hàng.';
            }

        } catch (e) {

        }

        //Chú ý: Người bán có hình con trâu cạnh tên người bán thì đây được hiểu là các shop có uy tín rất tốt trên 1688, ko hiển thị thứ hạng. Với các shop này hiển thị dòng thông báo: "Người bán có uy tín cao, đã được 1688 xác thực."
        try {
            if (document.querySelectorAll(".smt-info").length) {
                text_info = 'Người bán có uy tín cao, đã được 1688 xác thực.';
            }
        } catch (e) {

        }

        if (text_info) {
            $("._addon-message").removeClass("hidden").find("span:eq(0)").html(text_info);
        }

        var text_warn = "";
        /*
         * Cảnh báo về khoảng giá
         *
         * */
        try {

            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent;
                var res = html.search("iDetailConfig");
                if (res != -1) {
                    eval(html);
                    var d = { iDetailConfig: iDetailConfig, iDetailData: iDetailData };

                    //text += "<h4>Khoảng giá: </h4>";

                    var priceRange = iDetailData.sku.priceRange == undefined ? iDetailData.sku.priceRangeOriginal : iDetailData.sku.priceRange;


                    for (var ii = 0; ii < priceRange.length; ii++) {

                        var qRange = priceRange[ii][0];
                        var pRange = priceRange[ii][1];
                        var priceVND = parseFloat(pRange) * parseFloat(exchange_rate);
                        priceVND = this.common_tool.currency_format(priceVND.toFixed(2));

                        var text_first = ii == 0 ? "Mua" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        if (ii < priceRange.length - 1) {
                            text_warn += text_first + " từ <strong>" + qRange + "-" + (priceRange[ii + 1][0] - 1) + "</strong> sản phẩm giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />";
                        } else {
                            text_warn += text_first + " từ <strong>" + qRange + "</strong> sản phẩm trở lên giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />";
                        }

                    }

                    break;
                }
            }

        } catch (e) {
            //console.warn(e.message);
        }


        /*
         * Cảnh báo step
         * */
        var step = this.getStep();
        if (step) {
            var textStep = "";
            var maxStep = 5;
            for (var o = 1; o <= maxStep; o++) {
                if (o == 1) {
                    continue;
                }

                textStep += parseInt(step) * o + ", ";
                if (o == maxStep) {
                    textStep += "...";
                }
            }
            text_warn += "Số lượng mua phải là bội số của <strong>" + step + "( VD: " + textStep + " )</strong>";
        }


        /*
         * Cảnh báo require_min
         * */
        var require_min = this.getRequireMin();
        text_warn += ", mua ít nhất <strong>" + require_min + "</strong> sản phẩm";


        /*
         * Cảnh báo số lượng hàng còn lại
         * */
        var stock = this.getStock();
        text_warn += "<br />Hiện còn <strong>" + stock + "</strong> sản phẩm trong kho</br />";


        if (text_warn) {
            text_warn = "<h5 style='font-size: 18px;border-bottom: 1px solid #ccc;'>Chính sách bán của người bán</h5>" + text_warn;
            var obj_leading = $('.obj-leading');
            if (obj_leading != null && obj_leading.length > 0) {
                //obj_leading.before(text_warn); --chô này hiển thị thông tin số lượng hàng
            } else {
                //$('.obj-sku').before(text_warn);
            }
        }

    };

    this.parse = function () {

        //parse label description
        var common = this.common_tool;
        $('.content-wrapper table thead th').each(function () {
            var text = $.trim($(this).text());
            $(this).text(common.key_translate_lib(text));
        });
        var prop_single = $('.prop-single');
        var text_single = $.trim(prop_single.text());
        prop_single.text(common.key_translate_lib(text_single));

        var content_wrapper = $('div.content-wrapper-spec');

        content_wrapper.css("height", "300px");

        var summary = content_wrapper.find(".summary");
        var content = content_wrapper.find(".content");
        var unit_detail = content_wrapper.find(".unit-detail-order-action");

        summary.css("height", "100% !important");
        content.css("height", "100%");
        unit_detail.css("width", "230px");

        //parse price
        var item_price = this.getPrice(1);
        var table_wrap = $('.table-wrap');

        // this.common_tool.loadOptionCategory();

        var detail_bd = $('#mod-detail-bd');

        if (detail_bd != null) {
            detail_bd.css("border", "2px solid red")
        }

        var price_html = '<div style="font-size: 24px;color: #c00;height: 100px;padding: 20px">' +
            '<p>Tỉ giá : ' + this.common_tool.getExchangeRate() + ' VNĐ / 1 CNY</p>' +
            '<span style="font-weight:normal">Giá tạm tính: ' + common.currency_format(item_price * this.common_tool.getExchangeRate()) + ' VNĐ</span></div>';
        if (table_wrap != null && (typeof table_wrap === 'object' && table_wrap.length > 0)) {
            //table_wrap.append(price_html);
        } else {
            try {
                var obj_leading = $('.obj-leading');
                if (obj_leading != null && obj_leading.length > 0) {
                    //obj_leading.before(price_html); //hiển thị tỉ giá phần bên dưới trang (k muốn hiển thị nữa)
                } else {
                    //$('.obj-sku').before(price_html); //hiển thị tỉ giá phần bên dưới trang (k muốn hiển thị nữa)
                }
            } catch (ex) {

            }
        }

        //translate
        var title_content = $('.mod-detail-hd h1');
        title_content.attr('data-origin-title', title_content.text());

        this.common_tool.translate_title(title_content.text(), 'title', this);

        this.common_tool.translate_guarantee_type();

        //common.setIsTranslateToCookie();

        //this.translateProperties();//write by vanhs | edit_time: 13/06/2015

        return false;

    };

    this.translateProperties = function () {
        //write by vanhs | edit_time: 13/06/2015
        try {
            var common = this.common_tool;
            //Dịch kích thước
            var rows = document.querySelectorAll(".table-sku > tbody > tr");
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    var $this = rows[i];
                    var $dom = $this.getElementsByClassName("name")[0].getElementsByTagName("span");
                    if ($dom.length > 0) {
                        common.translate($dom[0], "properties");
                    }
                }
            }

            //Dịch màu sắc
        } catch (e) {
            //console.warn("1688 | Can not translate properties. " + e.message);
        }
    };

    this.set_translate = function (data) {
        var title_content = $('.mod-detail-hd h1');
        title_content.html(data['title']);
        return true;
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll(".delivery-addr")[0].textContent;
        } catch (e) {
            //console.info("1688 | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    /**
     * SP không có thuộc tính
     */
    this.addToCartCase1 = function () {
        var data_send = this.getDataSend([]);
        if (data_send != null) {
            this.common_tool.sendAjaxToCartNHSG(add_cart_url, data_send);
        }
    };

    /**
     * SP có thuộc tính
     */
    this.addToCartCase2 = function () {
        //waiting
        var data_send = null;
        try {
            //todo:

            var data = [];
            var checkMultiColor = false;
            const _iDetailData = this.getSkuModel();
            $('.obj-list .list-selected .list-info table tr').each(function(index, item) {
                checkMultiColor = true;
			    var priceList = {};
				var subName = $(this).attr('data-name');
                var image = '';
                var price = '';
                var price_ranges = '';
                if($('.obj-content .list-leading').length > 0) {
                    $('.obj-content .list-leading li').each(function() {
                       if($(this).children('div').attr('data-unit-config') && $(this).children('div').attr('data-imgs')) {
                           var dataUnitConfig = JSON.parse($(this).children('div').attr('data-unit-config'));
                           if(dataUnitConfig.name == subName) {
                              var dataImg = JSON.parse($(this).children('div').attr('data-imgs'));
                              if(dataImg.preview) {
                                image = dataImg.preview;
                              }
                           }
                       }
                    });
                }else if($('.obj-content table.table-sku tr').length > 0) {
                    $('.obj-content table.table-sku tr').each(function() {
                        if($(this).attr('data-sku-config') && $(this).children('.name').children('.image').attr('data-imgs')) {
                            var dataUnitConfig = JSON.parse($(this).attr('data-sku-config'));
                            if(dataUnitConfig.skuName == subName) {
                                var dataImg = JSON.parse($(this).children('.name').children('.image').attr('data-imgs'));
                                if(dataImg.preview) {
                                    image = dataImg.preview;
                                } 
                            }
                        }
                    });
                }
                var sukList = {};
                if($(".d-content .obj-sku .obj-content table.table-sku tr").length > 0) {
                    $(".d-content .obj-sku .obj-content table.table-sku tr").each(function(index, value) {
                       if($(this).attr('data-sku-config')) {
                          var dataJsonParser = JSON.parse($(this).attr('data-sku-config'));
                          if(dataJsonParser.skuName == subName) {
                             if($(this).children('.price').find('.value').text().replace('元','')) {
                                price_ranges = $(this).children('.price').find('.value').text().replace('元','');
                             }
                          }
                          price_ranges = $(this).children('.price').find('.value').text().replace('元','');
                          price = $(this).children('.price').find('.value').text().replace('元','');
                          sukList[index] = {price: price,name: dataJsonParser.skuName};
                       } 
                    });
                }
                priceList[index] = {name: subName, sku: sukList};
				$('.desc ul li', this).each(function() {					
					var skuData = $(this).attr('data-sku-config');
					var skuObject = JSON.parse(skuData);
					var skuName = skuObject.skuName;
					var number = skuObject.amount;
					var stock = skuObject.max;
					var name = subName + '&gt;' + skuName;
					var price = '';
					var itemName = '';
                    $.map(priceList, function(item, index) {
                        if(typeof item !== undefined) {
                            if(item.name == subName) {
                                if(typeof item.sku !== undefined) {
                                    $.map(item.sku, function(value, i) {
                                        if(value.name == skuName) {
                                            price = value.price;
                                        }
                                    });
                                }   
                            }    
                        }
                        
                    });
                    price = price ? price : price_ranges;
                    itemName = name;
                    let data_value = _iDetailData ? _iDetailData.sku.skuMap[skuName] : null;
                    if(!data_value) {
                        data_value = _iDetailData ? _iDetailData.sku.skuMap[itemName] : null;
                    }
                    data.push([number, stock, skuName, subName, price, data_value ? data_value.specId : '', image])
				});
			});
            if (!checkMultiColor) {
                data = this.get_item_data();
            }
            if (!data.length) {
                data = this.get_item_data('re-render', null);
            }
            // Find color required and checked
            var tbl_wrap = document.getElementsByClassName('content-wrapper');
            var content = null;
            var color_selected = true;
            if (tbl_wrap.length > 0) {
                content = tbl_wrap[0].getElementsByClassName('content');
                if (content.length > 0) {
                    var color_dom = content[0].getElementsByClassName('leading');
                    if (!(color_dom != null && (typeof color_dom === 'object' && color_dom.length > 0))) {
                        color_selected = false;
                    }
                }
            } else {
                var tag_ul_color = document.getElementsByClassName('list-leading');
                if (tag_ul_color.length > 0) {
                    var tag_a_color = tag_ul_color[0].getElementsByClassName('selected');
                    if (tag_a_color.length > 0) {
                        color_selected = true;
                    }
                }
            }

            //Nếu có màu sắc thì mới kiểm tra xem chọn màu sắc hay chưa
            var hasOptionColor = document.querySelectorAll(".list-leading").length;

            if (hasOptionColor && color_selected == false) {
                show_messageorder("Bạn chưa chọn màu sắc");
                this.common_tool.removeDisabledButtonCart();
                $('.indicator-hpo').addClass('hidden');
                $('.indicator-hpo').removeClass('shown');
                return;
            }

            if (data.length == 0) {
                show_messageorder('Bạn chưa chọn số lượng sản phẩm.');
                this.common_tool.removeDisabledButtonCart();
                $('.indicator-hpo').addClass('hidden');
                $('.indicator-hpo').removeClass('shown');
                return;
            }

            var all_data_send = null;
            for (var o in data) {

                if (!$.isNumeric(o)) {
                    continue;
                }
                if (data[o]['amount'] == 0) {
                    show_messageorder('Bạn chưa chọn số lượng sản phẩm.');
                    this.common_tool.removeDisabledButtonCart();
                    $('.indicator-hpo').addClass('hidden');
                    $('.indicator-hpo').removeClass('shown');
                    return;
                }
                data_send = this.getDataSend(data[o]);
                if (data_send != null && typeof data_send != "undefined" && data_send != "" && data_send.Products && data_send.Products.length > 0) {
                    //tiến hành lấy ảnh thumb cho từng thuộc tính của sản phẩm nếu có
                    //hunglq: 1688 waiting
                    try {
                        var $dom1 = document.querySelectorAll(".table-sku .image[title='" + data[o][3] + "']");
                        var $dom2 = document.querySelectorAll(".table-sku img[alt='" + data[o][3] + "']");
                        if ($dom1.length) {
                            var string = $dom1[0].getAttribute("data-imgs");
                            if (string) {
                                var json = JSON.parse(string);
                                if (json) {
                                    data_send.Products[0].image_model = json.original;
                                }
                            }
                        } else {
                            if ($dom2.length) {
                                var src = $dom2[0].getAttribute("src");
                                if (src) {
                                    data_send.Products[0].image_model = src.replace(".32x32", "");
                                }
                            }
                        }
                    } catch (exGetImageVariant) { }
                    if (all_data_send === null) {
                        all_data_send = data_send;
                    }
                    else {
                        all_data_send.Products = all_data_send.Products.concat(data_send.Products);
                    }
                }
            }

            this.common_tool.sendAjaxToCartNHSG(add_cart_url, all_data_send);
            return true;
        } catch (e) {

            data_send = this.getDataSend([]);
            if (data_send != null) {
                this.common_tool.sendAjaxToCartNHSG(add_cart_url, data_send);
            }
            return false;
        }
    };
    this.addToCartCase3 = function () {
        var data_send = null;
        try {
            let table = document.querySelector(".selector-table-wrapper .next-table-body table");
            let tbl_tr = table.querySelectorAll("tr");
            let images = document.querySelectorAll(".vertical-img .box-img img");
            let image = images && images.length > 0 ? images[0].src : '';
            var data = [];
            const _iDetailData = this.getSkuModel();
            for (let i = 0; i < tbl_tr.length; i++) {
                const tr = tbl_tr[i];
                const cells = tr.cells;
                const qty = Number(cells[cells.length-1].querySelector(".next-input input").value);
                if(qty  > 0) {
                    const stock = Number(cells[cells.length-2].querySelector("div").textContent);
                    const price = Number(cells[cells.length-3].querySelector("div").textContent);
                    const skuName = cells[0].querySelector("div").textContent;
                    let data_value = null;
                    if(_iDetailData) {
                        data_value = _iDetailData.sku.skuMap[skuName];
                    }                    
                    data.push([qty, stock, skuName, '', price, data_value ? data_value.specId : '', image])
                }
            }

            if (data.length == 0) {
                show_messageorder('Bạn chưa chọn số lượng sản phẩm.');
                this.common_tool.removeDisabledButtonCart();
                $('.indicator-hpo').addClass('hidden');
                $('.indicator-hpo').removeClass('shown');
                return;
            }

            var all_data_send = null;
            for (var o in data) {
                if (!$.isNumeric(o)) {
                    continue;
                }
                data_send = this.getDataSend(data[o]);
                if (data_send != null && typeof data_send != "undefined" && data_send != "" && data_send.Products && data_send.Products.length > 0) {
                    if (all_data_send === null) {
                        all_data_send = data_send;
                    }
                    else {
                        all_data_send.Products = all_data_send.Products.concat(data_send.Products);
                    }
                }
            }

            this.common_tool.sendAjaxToCartNHSG(add_cart_url, all_data_send);
            return true;
        } catch (e) {
            data_send = this.getDataSend([]);
            if (data_send != null) {
                this.common_tool.sendAjaxToCartNHSG(add_cart_url, data_send);
            }
            return false;
        }
    }

    this.checkFor1688ComV2 = function() {
        const _iDetailData = this.getSkuModel();
        if (_iDetailData && _iDetailData.skuModel
            && _iDetailData.skuModel.skuMap
            && _iDetailData.skuModel.skuMap.length === 0) {
            show_messageorder('Lỗi không bắt được link sản phẩm.');
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }
    
        if ($(".sku-item-wrapper .next-number-picker .next-input input").length > 0
            && ($(".sku-item-wrapper .next-number-picker .next-input input").length
                === $(".sku-item-wrapper .next-number-picker .next-input input[value=0]").length)) {
            show_messageorder('Lỗi không bắt được link sản phẩm.');
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }
    
        // Không đọc được thuộc tính.
        if ($('.pc-sku-wrapper .sku-module-wrapper').length <= 0) {
            show_messageorder('Lỗi không bắt được link sản phẩm.');
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return false;
        }
    
        return true;
    }

    this.getProduct1688V2 = function() {
        var result = [];
        var price, size, qty;
        var list = [];
    
        var img1688 = $('.detail-gallery-preview img.preview-img').attr('src');
        if(!img1688) {
            div_video = $('.detail-gallery-preview .scaled-img');
            if(div_video && div_video.length > 0) {
                img1688 = div_video[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");;
            }
        }
    
        var color1688 = $('.prop-item-inner-wrapper.active .prop-name').attr('title');
        color1688 = color1688 ? color1688 : '';
    
        var tmp, item;
        var el_data = $('#sku-count-widget-wrapper .sku-item-wrapper');
        let single_item = $('.single-sku-box .single-price-warp');
        if (el_data.length) {
            for (var i = 0; i < el_data.length; i++) {
                item = el_data[i];
    
                tmp = {};
    
                qty = $(item).find('.next-input input').val();

                sku_img = $(item).find('.sku-item-image');
                if(sku_img && sku_img.length > 0) {
                    sku_img = sku_img[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");
                }
                else {
                    sku_img = $('.prop-item-wrapper .prop-item div.prop-item-inner-wrapper.active div.prop-img')
                    if(sku_img && sku_img.length > 0) {
                        sku_img = sku_img[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");
                    }
                }

                if(typeof sku_img === 'object') {
                    sku_img = ''
                }
    
                qty = parseInt(qty);
    
                if (typeof qty !== 'undefined' && qty > 0) {
    
                    price = $(item).find('.discountPrice-price').text();
                    size = $(item).find('.sku-item-name').text();
    
                    tmp.size = size;
                    tmp.image = sku_img ? sku_img : img1688;
                    tmp.qty = qty;
                    tmp.price = parseFloat(price);
                    tmp.color = color1688;
    
                    tmp.max = parseInt($(item).find(".sku-item-sale-num").html());
    
                    list.push(tmp);
                }
            }
        }
        else if(single_item) {
            tmp = {};
            qty = $(single_item).find('.next-input input').val();
            qty = parseInt(qty);
            if (typeof qty !== 'undefined' && qty > 0) {
    
                price = $(single_item).find('.price-num').text();
                size = $(single_item).find('.sku-item-name').text();
                size = size ? size : '';
                sku_img = $(single_item).find('.sku-item-image');
                sku_img = typeof sku_img === 'object' ? '' : sku_img;
                tmp.size = size;
                tmp.image = sku_img ? sku_img : img1688;
                tmp.qty = qty;
                tmp.price = parseFloat(price);
                tmp.color = color1688;

                tmp.max = parseInt($(single_item).find(".sku-item-sale-num").html());

                list.push(tmp);
            }
        }
    
        var structure = {
            color: color1688,
            img: img1688,
            list: list
        };
    
        result.push(structure);
    
        return result;
    }

    this.addToCartCase4 = function() {
        let common_func = this.common_tool;   
        const iniData = this.getSkuModel();
    
        var offerBaseInfo = iniData.offerBaseInfo;
        var tempModel = iniData.tempModel;
        var orderParam = iniData.orderParamModel.orderParam;
        var skuInfoMapOriginal = iniData.sku.skuInfoMapOriginal != undefined ? iniData.sku.skuInfoMapOriginal : [];
        var skuInfoMap = iniData.sku.skuInfoMap != undefined ? iniData.sku.skuInfoMap : [];
        var skuPriceScale = iniData.sku.skuPriceScale;
        var images = iniData.images != undefined ? iniData.images : [];
    
        var productList1688 = [];
        var shopNick = tempModel.companyName ? tempModel.companyName : offerBaseInfo.sellerLoginId;
        var shopID = offerBaseInfo.sellerUserId;
        var shopUrl = offerBaseInfo.sellerWinportUrl;
        var proName = tempModel.offerTitle;
        var beginAmount = orderParam.beginNum;
        var skuRangePrices = orderParam.skuParam ? orderParam.skuParam.skuRangePrices : null;

        let detect_case5 = document.querySelector(".order-price-wrapper");
        let detect_case6 = document.querySelector(".gyp-order-price-wrap");
        let detect_case7 = document.querySelector(".gyp-sku-selection-order-button-wrap");
        if(detect_case5) {
            let total_count = 0;
            
            if(document.getElementsByClassName('total-count').length > 0) {
                let outer_text = document.getElementsByClassName('total-count')[0].outerText;
                total_count = parseInt(outer_text.replace('合计',''))
            }
            $(".order-has-select-button").click();
            const note = $('._comment_item').val();
            $(".selected-list-wrapper .selected-item-wrapper").each(function(index, value) {
                var skuName = $(value).find('.name').text();
                $(".children-item .children-wrapper", value).each(function(index_chil, valueChil) {
                    var subName = $(valueChil).find('.children-wrapper-name').text();
                    
                    var number = $(valueChil).find('.count').attr('title');
                    var data_value = "";
                    var price = '';
                    let temp_subName = subName.substring(0, subName.indexOf('(')).trim();
                    var name = skuName + '&gt;' + temp_subName;
                    if(skuName == '') {
                        name = subName;    
                    } else if (temp_subName == '') {
                        name = skuName;
                    }
                    
                    $.each(iniData.sku.skuMap, function(index, value) {
                        if(value.specAttrs == name) {
                            if(value.discountPrice && value.price) {
                                price = value.discountPrice;
                                data_value = value.specId;
                            }
                            else if(value.price) {
                                price = value.price;
                                data_value = value.specId;
                            }
                        }
                    });
                    
                    if((price == undefined || price == '') && skuRangePrices && total_count) {
                        $.each(skuRangePrices, function(index, value) {
                            if(parseInt(value.beginAmount) <= total_count) {
                                price = value.price;
                            }
                        });
                        if ((price == undefined || price == '') && skuRangePrices.length > 0) {
                            price = skuRangePrices[0].price;
                        }
                    }

                    if((price == undefined || price == '') && skuPriceScale !== '') {
                        var priceParse = skuPriceScale.split('-');
                        price = priceParse.slice(-1)[0];  
                    } 
                    var image = '';
                    $.each(iniData.sku.skuProps, function(noIndex, pItem) {
                        $.each(pItem.value, function(noChilItem, pChiItem) {
                        if(pChiItem.name == skuName) {
                            image = pChiItem.imageUrl;
                        }
                        });
                    });
                    if(number == undefined) {
                        quantityExplose = subName.split('(');
                        if(quantityExplose.length > 0) {
                            number = quantityExplose[quantityExplose.length-1].replace(')','');
                        }
                    }
                    if(image == undefined && images.length > 0) {
                        image = images[0].fullPathImageURI;
                    }
                    productList1688.push({
                        title_origin: proName,
                        title_translated: proName,
                        price_origin: price ? price : 0,
                        price_promotion: price ? price : 0,
    
                        property: name.replace('&gt;', ';'),
                        property_translated: name.replace('&gt;', ';'),
                        data_value: data_value,
                        image_model: image,
                        image_origin: image,
                        seller_id: shopID,
                        shop_id: shopID,
                        shop_name: shopNick,
                        wangwang: shopNick,
                        quantity: number,
    
                        site: "1688",
                        item_id: parseInt(offerBaseInfo.offerId, 10),
                        link_origin: window.location.href,
                        outer_id: '',
                        tool: "Addon",
                        comment: note
                    });
                });
                
            });
            $(".order-has-select-button").click();
        }
        else if(detect_case6) {
            let total_count = 0;
            
            if(document.getElementsByClassName('gyp-order-num-text').length > 0) {
                let r = /\d+/;
                let outer_text = document.getElementsByClassName('gyp-order-num-text')[0].outerText;
                total_count = parseInt(outer_text.match(r))
            }
            $(".gyp-order-active").click();
            const note = $('._comment_item').val();
            $(".gyp-order-list-wrap .next-table-row").each(function(index, value) {
                var collected = [];
                $(value).find('.gyp-order-cell-text').each(function() {
                    collected.push($(this).text());
                });
                var data_value = "";
                var skuName = collected.join(';');
                let price = Number($(value).find('.gyp-order-price-value').text());
                let qty = Number($(value).find('input')[0].value);
                
                $.each(iniData.sku.skuMap, function(index, value) {
                    if(common_func.compareStringF(value.specAttrs, '*', skuName, ';')) {
                        if(value.discountPrice && value.price) {
                            price = value.discountPrice;
                            data_value = value.specId;
                        }
                        else if(value.price) {
                            price = value.price;
                            data_value = value.specId;
                        }
                    }
                });

                if((price == undefined || price == '') && skuRangePrices && total_count) {
                    $.each(skuRangePrices, function(index, value) {
                        if(parseInt(value.beginAmount) <= total_count) {
                            price = value.price;
                        }
                    });
                    if ((price == undefined || price == '') && skuRangePrices.length > 0) {
                        price = skuRangePrices[0].price;
                    }
                }

                if((price == undefined || price == '') && skuPriceScale !== '') {
                    var priceParse = skuPriceScale.split('-');
                    price = priceParse.slice(-1)[0];  
                }
                var image = '';
                $.each(iniData.sku.skuProps, function(noIndex, pItem) {
                    $.each(pItem.value, function(noChilItem, pChiItem) {
                    if(common_func.compareStringF(pChiItem.name, '*', skuName, ';')) {
                        image = pChiItem.imageUrl;
                    }
                    });
                });
                if(image == undefined && images.length > 0) {
                    image = images[0].fullPathImageURI;
                }
                productList1688.push({
                    title_origin: proName,
                    title_translated: proName,
                    price_origin: price ? price : 0,
                    price_promotion: price ? price : 0,

                    property: skuName,
                    property_translated: skuName,
                    data_value: data_value,
                    image_model: image,
                    image_origin: image,
                    seller_id: shopID,
                    shop_id: shopID,
                    shop_name: shopNick,
                    wangwang: shopNick,
                    quantity: qty,

                    site: "1688",
                    item_id: parseInt(offerBaseInfo.offerId, 10),
                    link_origin: window.location.href,
                    outer_id: '',
                    tool: "Addon",
                    comment: note
                });
            });
            $(".gyp-order-active").click();
        }
        else if(detect_case7) {
            let total_count = 0;
            
            if($('.gyp-sku-selection-order-button-wrap span.num').length > 0) {
                let r = /\d+/;
                let outer_text = $('.gyp-sku-selection-order-button-wrap span.num')[0].outerText;
                total_count = parseInt(outer_text.match(r))
            }
            $(".expandedBtn").click();
            const note = $('._comment_item').val();
            let table_items = $(".gyp-sku-selection-order-button-wrap .next-table-lock .next-table-body").not('.next-table-lock-left');
            if(table_items && table_items !== undefined && table_items.length > 0) {
                $(table_items[0]).find(".next-table-row").each(function(index, value) {
                    var collected = [];
                    $(value).find('.next-table-cell-wrapper .specification-cell span.normal-text').each(function() {
                        collected.push($(this).text());
                    });
                    if(collected.length == 0) {
                        $(value).find('.next-table-cell-wrapper span.normal-text').each(function() {
                            collected.push($(this).text());
                        });
                    }
                    var data_value = "";
                    var skuName = collected.join(';');
                    let price = Number($(value).find('.next-table-cell-wrapper .price').text());
                    let qty = Number($(value).find('input')[0].value);
                    
                    $.each(iniData.sku.skuMap, function(index, value) {
                        if(value.specAttrs == skuName || common_func.compareStringF(value.specAttrs, '*', skuName, ';')) {
                            if(value.discountPrice && value.price) {
                                price = value.discountPrice;
                                data_value = value.specId;
                            }
                            else if(value.price) {
                                price = value.price;
                                data_value = value.specId;
                            }
                        }
                    });
    
                    if((price == undefined || price == '') && skuRangePrices && total_count) {
                        $.each(skuRangePrices, function(index, value) {
                            if(parseInt(value.beginAmount) <= total_count) {
                                price = value.price;
                            }
                        });
                        if ((price == undefined || price == '') && skuRangePrices.length > 0) {
                            price = skuRangePrices[0].price;
                        }
                    }
                    
                    if((price == undefined || price == '') && skuPriceScale !== '') {
                        var priceParse = skuPriceScale.split('-');
                        price = priceParse.slice(-1)[0];  
                    }
                    var image = '';
                    $.each(iniData.sku.skuProps, function(noIndex, pItem) {
                        $.each(pItem.value, function(noChilItem, pChiItem) {
                        if(pChiItem.name == skuName || common_func.compareStringF(pChiItem.name, '*', skuName, ';')) {
                            image = pChiItem.imageUrl;
                        }
                        });
                    });
                    if(image == undefined && images.length > 0) {
                        image = images[0].fullPathImageURI;
                    }
                    productList1688.push({
                        title_origin: proName,
                        title_translated: proName,
                        price_origin: price ? price : 0,
                        price_promotion: price ? price : 0,
    
                        property: skuName,
                        property_translated: skuName,
                        data_value: data_value,
                        image_model: image,
                        image_origin: image,
                        seller_id: shopID,
                        shop_id: shopID,
                        shop_name: shopNick,
                        wangwang: shopNick,
                        quantity: qty,
    
                        site: "1688",
                        item_id: parseInt(offerBaseInfo.offerId, 10),
                        link_origin: window.location.href,
                        outer_id: '',
                        tool: "Addon",
                        comment: note
                    });
                });
            }
            $(".expandedBtn").click();
        }
        else {
            product1688 = [];
            product1688 = this.getProduct1688V2();
            var price_table = this.getPriceTable();
            const note = $('._comment_item').val();
            // return false;
            product1688.forEach(function (prd) {
                prd.list.forEach(function (item) {
        
                    var defaultProduct = {
                        'offerId': parseInt(offerBaseInfo.offerId, 10),
                        'name': proName,
                        'price': isNaN(item.price) ? skuPriceScale : item.price,
                        'size': item.size,
                        // Bội số cần mua
                        'wsRuleUnit': item.wsRuleUnit,
                        'wsRuleNum': item.wsRuleNum,
                        'sizetxt': item.size,
                        'color': item.color,
                        'colortxt': item.color,
                        'amount': item.qty,
                        'beginAmount': beginAmount,
                        'isMix': item.isMix,
                        'mixNumber': item.mixNumber,
                        'mixBegin': item.mixBegin,
                        'mixAmount': item.mixAmount,
                        'min': item.min,
                        'max': item.max,
                        'shop_nick': shopNick
                    };
        
                    defaultProduct.underProps = [];
                    defaultProduct.props = [];
                    defaultProduct.propsValue = "";
        
                    var skuMapKey = '';
                    var data_value = "";
                    if ($.trim(defaultProduct.color).length > 0 && $.trim(defaultProduct.size).length === 0) {
                        skuMapKey = defaultProduct.color;
                        defaultProduct.underProps.push(defaultProduct.color);
                    } else if ($.trim(defaultProduct.color).length === 0 && $.trim(defaultProduct.size).length > 0) {
                        skuMapKey = defaultProduct.size;
                        defaultProduct.underProps.push(defaultProduct.size);
                    } else {
                        skuMapKey = defaultProduct.color + "&gt;" + defaultProduct.size;
                        defaultProduct.underProps.push(defaultProduct.color);
                        defaultProduct.underProps.push(defaultProduct.size);
                    }
        
                    if (skuInfoMapOriginal && skuInfoMapOriginal[skuMapKey]) {
                        var skuMap = skuInfoMapOriginal[skuMapKey];
        
                        if (skuMap.skuId) {
                            defaultProduct.skullId = skuMap.skuId;
                        }
                        data_value = skuMap.specId;
                        defaultProduct.props.push(skuMap.specId);
                        defaultProduct.propsValue = ";" + skuMap.specId + ";";
                    }

                    productList1688.push({
                        title_origin: proName,
                        title_translated: proName,
                        price_origin: isNaN(item.price) ? skuPriceScale : item.price,
                        price_promotion: isNaN(item.price) ? skuPriceScale : item.price,
                        price_table: price_table,
                        data_value: data_value,

                        property: skuMapKey.replace('&gt;', ';'),
                        property_translated: skuMapKey.replace('&gt;', ';'),

                        image_model: item.image,
                        image_origin: item.image,
                        seller_id: shopID,
                        shop_id: shopID,
                        shop_name: shopNick,
                        wangwang: shopNick,
                        quantity: item.qty,
                        stock: item.max,

                        site: "1688",
                        item_id: parseInt(offerBaseInfo.offerId, 10),
                        link_origin: window.location.href,
                        outer_id: '',
                        tool: "Addon",
                        comment: note
                    });
                });
            });
        }
        
        if(productList1688.length == 0) {
            show_messageorder('Bạn chưa chọn số lượng sản phẩm.');
            this.common_tool.removeDisabledButtonCart();
            $('.indicator-hpo').addClass('hidden');
            $('.indicator-hpo').removeClass('shown');
            return;
        }
        this.common_tool.sendAjaxToCartNHSG(add_cart_url, {
            ShopID: shopID ? shopID : shopNick,
            ShopName: shopNick,
            Site: "1688",
            Note: "",
            Products: productList1688
        });
    }

    // For 1688.com only
    this.add_to_cart = function () {

        //hunglq: 1688 waiting
        $('.indicator-hpo').removeClass('hidden');
        $('.indicator-hpo').addClass('shown');
        /**
         * Phân chia ra làm 2 trường hợp rõ ràng
         * TH1: Sản phẩm có thuộc tính
         * TH2: Sản phẩm không có thuộc tính
         */
        //SP không có thuộc tính
        let detect_case3 = document.querySelector(".selector-table-wrapper .next-table-body table");
        const iniData = this.getSkuModel();
        
        if(iniData && iniData.sku && iniData.sku.skuProps && iniData.sku.skuProps.length > 0 && iniData.link_type_1688 == 2) {
            this.addToCartCase4();
        }
        else if(detect_case3 && detect_case3.querySelectorAll("tr").length > 0) {
            this.addToCartCase3();
        }
        else if (this.checkHasOneProperty()) {
            this.addToCartCase1();
        } 
        else {//SP có thuộc tính
            this.addToCartCase2();
        }

    };

    this.getDataValue = function (self) {
        //console.info("data value 1688");
        //Lấy data_value
        var iDetailConfigObj = {};
        var iDetailDataObj = {};
        var skuMap = [];

        var params = this.getParamsOnPage();

        if (this.params_on_page) {
            iDetailConfigObj = params.iDetailConfig;
            iDetailDataObj = params.iDetailData;
            skuMap = iDetailDataObj.sku.skuMap;
        }

        var arrayDataValue = [];
        var ssName = '';
        try {
            ssName = JSON.parse(self.getAttribute("data-sku-config")).skuName.trim();
        } catch (ex) {
            console.warn(ex.message);
        }

        //Lấy màu sắc
        var color = '';
        try {
            var images = document.querySelectorAll('.list-leading > li > div > a');
            for (var j = 0; j < images.length; j++) {
                var check = images[j].className.indexOf("selected");
                if (check > -1) {
                    color = images[j].getAttribute("title");
                }
            }
        } catch (ex) {

        }

        //Lấy loại sản phẩm với từng SL khác nhau
        try {
            var amounts = document.querySelectorAll('.table-sku .amount-input');
            for (var m = 0; m < amounts.length; m++) {
                var value = amounts[m].value;
                var parent = amounts[m].parentNode.parentNode.parentNode.parentNode;
                var data_sku_config = JSON.parse(parent.getAttribute("data-sku-config"));
                var skuName = data_sku_config.skuName;

                if (value > 0 && skuName == ssName) {
                    var p = '';
                    try {
                        p = skuMap[skuName].specId;
                    } catch (ex) {
                        p = skuMap[color + '&gt;' + skuName].specId;
                    }
                    if (p) {
                        arrayDataValue.push(p);
                    }
                }
            }
        } catch (ex) {
            console.info(ex.message);
        }

        return arrayDataValue.join(';');
    };

    this.getSkuModel = function () {
        const _iDetailDatas = $('#_iDetailData');
        if(!_iDetailDatas || _iDetailDatas.length == 0) {
            return null;
        }
        let htmlDetail = $('#_iDetailData')[0].innerHTML;
        htmlDetail = htmlDetail.replaceAll('skuModel', 'sku');
        htmlDetail = htmlDetail.replaceAll('skuInfoMap', 'skuMap');
        return JSON.parse(htmlDetail);
    };

    /**
     * site 1688
     * @author vanhs
     * @time 14:49 17/03/2016
     * @description Hàm kiểm tra xem sản phẩm có một thuộc tính duy nhất hay không?
     * @returns {boolean}
     */
    this.checkHasOneProperty = function () {
        const _iDetailData = this.getSkuModel();
        var totalSkuProps = 0;
        try {
            totalSkuProps = _iDetailData.sku.skuProps.length;
        } catch (eSkuProps) {
        }
        if (!totalSkuProps) {
            return true;
        }
        return false;
    };

    /**
     * site 1688
     * @description Lấy dữ liệu trên trang trước khi gửi lên server
     * @param item_data
     * @returns {*}
     */
     this.getDataSend = function (item_data) {
        //waiting 

        try {
            var select_category = $('._select_category');
            var loaded_category = select_category.attr('data-loaded');
            var category_id = 1;
            var category_name = 'Đang cập nhật';

            var brand = $('._brand_item').val();
            var comment = $('._comment_item').val();

            while (category_name.match(/-/i)) {
                category_name = category_name.replace(/-/i, "");
            }

            if (category_id === "-1") {
                category_name = $('._input_category').val();
            }

            var error = 0;
            var item_id = this.getItemId();
            var item_title = this.getItemTitle();
            //var item_image = this.getItemImage(); this get only selected img so can't use in 1688
            var item_image = undefined;
            if(item_data.length > 0 && item_data[item_data.length - 1].indexOf('https://') == 0) {
                item_image = item_data[item_data.length - 1]
            }
            else {
                item_image = $(item_data[item_data.length - 1]).find('.box-img').children('img').attr('src');
                if (item_image == undefined) {
                    item_image = this.getItemImage();
                }
                if (item_image == undefined) {
                    let all_img = document.querySelectorAll('.img-list-wrapper .detail-gallery-turn-wrapper img.detail-gallery-img');
                    if(all_img && all_img.length > 0) {
                        item_image = all_img[all_img.length - 1].src;
                    }   
                }
            }
            
            var item_link = this.getItemLink();
            var shop_id = this.getShopId();
            var shop_name = this.getShopName();
            var seller_id = this.sellerId();
            if(!shop_id && shop_name) {
                shop_id = shop_name.hashCode();
            }
            //lay comment
            var price_table = this.getPriceTable();

            var step = this.getStep();

            var require_min = this.getRequireMin();

            var stock = this.getStock();
            try {
                if (stock <= 0) {
                    stock = item_data[1];
                }
            } catch (ex) {
                stock = 999999;
            }

            var wangwang = this.getWangwang();

            if (wangwang == '') {
                wangwang = shop_name;
            }

            var weight = this.getWeight();

            //GET ITEM_PRICE
            if (!this.checkHasOneProperty()) {
                try {
                    var item_price = item_data[4] ? item_data[4] : this.getPrice(item_data[0]);//edit by vanhs 02/07/2015

                    if (!$.isNumeric(item_price) || parseFloat(item_price) <= 0) {
                        error = 1;
                        item_price = this.getPriceInput();
                    }
                } catch (ex) {
                    console.warn(ex.message);
                    error = 1;
                    item_price = this.getPriceInput();
                }
            }

            var color_size_name = "";
            if (!this.checkHasOneProperty()) {
                try {
                    color_size_name = item_data[3] + (item_data[3] ? ";" : "") + item_data[2];

                    if (color_size_name === 'undefined;undefined' || color_size_name === 'undefined') {
                        error = 1;
                        color_size_name = this.getPropertiesInput();
                    }
                } catch (ex) {
                    error = 1;
                    color_size_name = this.getPropertiesInput();
                }
            }
            try {

                var quantity = 0;
                //logic: Kiểm tra xem sản phẩm này có 1 thuộc tính hay có nhiều thuộc tính, nếu có 1 thuộc tính thì lấy số lượng trong ô input
                if (this.checkHasOneProperty()) {
                    let input_tag = document.querySelectorAll(".amount-input");
                    if(input_tag.length == 0){
                        input_tag = document.querySelectorAll(".next-input-group input")
                    }
                    var value = input_tag[0].value;
                    if (value) {
                        quantity = parseInt(value);
                    }
                } else {
                    quantity = item_data[0];
                }

                if (!$.isNumeric(quantity) || parseInt(quantity) <= 0) {
                    error = 1;
                    quantity = this.getQuantityInput();
                }
            } catch (ex) {
                error = 1;
                quantity = this.getQuantityInput();
            }

            //neu sp chi co 1 thuoc tinh
            if (this.checkHasOneProperty()) {
                item_price = this.getPriceByPriceTable(price_table, quantity);
                if(!$.isNumeric(item_price) || parseFloat(item_price) <= 0) {
                    let price_tag = document.querySelectorAll(".discountPrice-price")
                    if(price_tag && price_tag.length > 0) {
                        item_price = Number(price_tag[0].textContent.replace('元',''))
                    }
                }
            }

            if (!$.isNumeric(quantity) || parseInt(quantity) <= 0 || !$.isNumeric(item_price) || parseFloat(item_price) <= 0) {
                var is_show = $('#_box_input_exception').attr("data-is-show");
                if (parseFloat(is_show) != 1) {
                    show_messageorder('QUÝ KHÁCH VUI LÒNG KHÔNG SỬ DỤNG GOOGLE TRANSLATE ĐỂ ĐẶT HÀNG CHO TRANG NÀY', "Lỗi Translate");
                }
                return null;
            }
            var location_sale = this.getLocationSale();
            var data_value = "";
            if (!this.checkHasOneProperty()) {
                try {
                    data_value = item_data[5];
                } catch (e) { }
            }
            const note = $('._comment_item').val();
            return {
                ShopID: shop_id,
                ShopName: shop_name,
                Site: "1688",
                Note: "",
                Products: [
                    {
                        title_origin: $.trim(stripHtmlToText(item_title)),
                        title_translated: $.trim(stripHtmlToText(item_title)),
                        price_origin: item_price,
                        price_promotion: item_price,
                        price_table: price_table,
                        data_value: data_value,

                        property: color_size_name,
                        property_translated: color_size_name,

                        image_model: item_image,
                        image_origin: item_image,
                        seller_id: seller_id,
                        shop_id: shop_id,
                        shop_name: shop_name,
                        wangwang: wangwang,
                        quantity: error == 1 ? this.getQuantityInput() : quantity,
                        require_min: require_min,
                        stock: stock ? parseInt(stock) : 0,
                        location_sale: location_sale,

                        site: "1688",
                        item_id: item_id,
                        link_origin: item_link,
                        outer_id: '',
                        weight: weight,
                        error: error,
                        step: step,
                        brand: brand,
                        category_name: category_name,
                        category_id: category_id,
                        tool: "Addon",
                        version: version_tool,
                        is_translate: this.isTranslatePage(),
                        comment: note
                    }
                ]
            };
        } catch (e) {
            throw Error(e.message + "Error function getDataSend()");
        }
    };

    /**
     * L?y d? li?u send
     * return Array 2 chi?u
     *  result[i]['amount'] = 0;
     result[i]['min_amount'] = 0;
     result[i]['size'] = 0;
     result[i]['color'] = 0;
     result[i]['price'] = 0;
     * data g?m amount, color, size, min_amount
     **/
    this.get_item_data = function (exception, item) {
        //todo:

        var result = [];
        var input_data = [];
        var i = 0;
        var parent_obj = null;
        try {
            // Multi buy
            var tbl_wrap = document.getElementsByClassName('content-wrapper');
            var content = null;
            var color = null;
            if (tbl_wrap.length > 0) {
                content = tbl_wrap[0].getElementsByClassName('content');
            }
            /**
             * Chú thích m?ng Result:
             * [0] => Quantity
             * [1] => Stock
             * [2] => Site
             * [3] => Màu s?c
             * [4] => price
             * [5] => data_value
             * [last] => item infor
             */
            if (content != null && exception == undefined && content.length > 0) { // New 22/5/2013
                content = content[0];
                input_data = content.getElementsByClassName('amount-input'); // Get Số lượng đ?t
                if (input_data.length > 0) {

                    i = 0;
                    /**
                     * Có class 'leading': màu s?c n?m trong class leading
                     * danh sách phía dư?i là kích thước
                     * N?u không có class 'leading', không có kích thước, ch? có màu s?c
                     */
                    color = tbl_wrap[0].getElementsByClassName('leading');
                    if (color.length > 0) { // Has color, and size
                        color = color[0].getElementsByClassName('selected')[0].getAttribute('title').replace(/\n+/, '').replace(/\s+/, '');
                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }
                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            result[i] = new Array();
                            // Add data to arrayn
                            result[i][0] = input_data[inc].value;
                            result[i][1] = parent_obj.getElementsByClassName('count')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
                            result[i][2] = color == "" ? "" : parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, '').replace(/\n+/, '');
                            result[i][3] = color == "" ? parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, '').replace(/\n+/, '') : color;
                            result[i][4] = parent_obj.getElementsByClassName('price')[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
                            result[i][5] = this.getDataValue(parent_obj);
                            result[i][6] = item;
                            i++;
                        }
                    } else { // Có màu s?c, ko có size

                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }
                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            result[i] = new Array();
                            // Add data to arrayn
                            result[i][0] = input_data[inc].value;
                            result[i][1] = parent_obj.getElementsByClassName('count')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
                            result[i][2] = "";

                            var span_color = parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span');
                            var img_color = parent_obj.getElementsByClassName('name')[0].getElementsByClassName('image');
                            result[i][3] = img_color.length > 0 ?
                                (img_color[0].getAttribute('title'))
                                :
                                span_color[0].textContent.replace(/\s+/, '').replace(/\n+/, '');
                            result[i][4] = parent_obj.getElementsByClassName('price')[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
                            result[i][5] = this.getDataValue(parent_obj);
                            result[i][6] = item;
                            i++;
                        }
                    }
                }
            } else {
                var obj_sku = document.getElementsByClassName('obj-sku');
                var obj_amount = document.getElementsByClassName('obj-amount');
                if (obj_sku != null && (typeof obj_sku === 'object' && obj_sku.length > 0)) {
                    input_data = obj_sku[0].getElementsByClassName("amount-input");
                } else if (obj_amount != null && (typeof obj_amount === 'object' && obj_amount.length > 0)) {
                    input_data = obj_amount[0].getElementsByClassName("amount-input");
                }

                if (input_data.length > 0) {

                    i = 0;
                    /**
                     * Có class 'leading': màu s?c n?m trong class leading
                     * danh sách phía dư?i là kích thước
                     * N?u không có class 'leading', không có kích thước, ch? có màu s?c
                     */
                    //color = document.getElementsByClassName('obj-leading');
                    color = document.getElementsByClassName('obj-leading');
                    if (color.length > 0) { // Has color, and size
                        color = color[0].querySelectorAll('a.selected'); //
                        if (color != null) {
                            let color_title = color[0].getAttribute('title');
                            color_title = color_title ? color_title : color[0].text;
                            color = color_title.replace(/\n+/, '').replace(/\r+/, '').replace(/\s+/, '');
                        }
                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }
                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            result[i] = this.getProperties(parent_obj, input_data[inc], color);
                            result[i].push(item);
                            i++;
                        }

                    } else { // Có màu s?c, ko có sizeCó màu s?c, ko có size
                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }

                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            parent_dom_obj = $(input_data[inc]).parent().parent().parent().parent();
                            result[i] = this.getProperties(parent_obj, input_data[inc], "");
                            result[i].push(parent_dom_obj);
                            i++;
                        }
                    }
                }
                else {
                    var wraper = document.getElementsByClassName('spu-list-content');
                    if (wraper != null) {
                        var obj_sku = document.getElementsByClassName('spu-list');
                        if (obj_sku != null && (typeof obj_sku === 'object' && obj_sku.length > 0)) {
                            input_data = obj_sku[0].getElementsByClassName("amount-input");
                        }

                        if (input_data.length > 0) {
                            i = 0;
                            for (var inc in input_data) {
                                if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                    continue;
                                }

                                parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                                parent_dom_obj = $(input_data[inc]).parent().parent().parent().parent();
                                result[i] = this.getProperties(parent_obj, input_data[inc], "");
                                result[i].push(parent_dom_obj);
                                i++;
                            }
                        }
                    }

                }
            }
            return result;
        } catch (e) {
            throw Error(e + "Error function get_item_data()");
        }
    };

    this.getProperties = function (tr_prop, input_data, color) {
        try {
            var content = null;
            var count_span = null;
            var size_span = null;
            var price_span = null;
            var result = [];
            var span = null;
            result[0] = input_data.value;
            count_span = tr_prop.getElementsByClassName('count');
            if (count_span != null && (typeof count_span === 'object' && count_span.length > 0)) {
                result[1] = count_span[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
            } else {
                result[1] = 999999;//stock
            }
            size_span = tr_prop.getElementsByClassName('name');
            if (size_span != null && (typeof size_span === 'object' && size_span.length > 0 && color != "")) {
                span = size_span[0].getElementsByTagName('span')[0];
                if (this.common_tool.hasClass(span, "image")) {
                    result[2] = span.getAttribute("title").
                        replace(/\s+/, '').replace(/\n+/, '');
                } else {
                    result[2] = span.textContent.replace(/\s+/, '').replace(/\n+/, '');
                }
            } else {
                result[2] = "";
            }

            if (size_span != null && (typeof size_span === 'object' && size_span.length > 0) && color == "") {
                span = size_span[0].getElementsByTagName('span')[0];
                if (this.common_tool.hasClass(span, "image")) {
                    result[3] = span.getAttribute("title").
                        replace(/\s+/, '').replace(/\n+/, '');
                } else {
                    result[3] = span.textContent.replace(/\s+/, '').replace(/\n+/, '');
                }
            } else {
                result[3] = color;
            }

            price_span = tr_prop.getElementsByClassName('price');

            if (price_span != null && (typeof price_span === 'object' && price_span.length > 0)) {
                result[4] = price_span[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
            } else {
                result[4] = 0;
            }

            result[5] = this.getDataValue(tr_prop);

            return result;
        } catch (ex) {
            throw Error(ex + "Error function getProperties()");
        }

    };

    // Hàm l?y b?ng Giá
    this.getPriceTable = function () {
        //-- get price amount
        var price_table = [];
        var price_range = null;
        var pri = [];
        var detail_price = null;
        var tr_price = null;
        var i = 0;
        try {
            detail_price = document.getElementById("mod-detail-price");
            const _iDetailData = this.getSkuModel();
            if(_iDetailData && _iDetailData.sku && (_iDetailData.sku.skuPriceScale || _iDetailData.sku.price)) {
                let skuPrice = _iDetailData.sku.skuPriceScale ? _iDetailData.sku.skuPriceScale : _iDetailData.sku.price;
                price = '{"begin": "1","end": "1","price": "' + skuPrice + '"}';
                price_range = JSON.parse(price);
                let range_quantity = skuPrice.split('-');
                price_range.begin = parseInt(range_quantity[0]);
                price_range.end = parseInt(range_quantity.length == 2 ? range_quantity[1] : 1000000000);
                price_table.push(price_range);
            }
            else if (detail_price != null) { //price by amount

                var price_container = detail_price.getElementsByClassName("unit-detail-price-amount");

                if (price_container != null && price_container.length > 0) {
                    tr_price = price_container[0].getElementsByTagName("tr");

                    if (tr_price.length > 0) {
                        for (i = 0; i < tr_price.length; i++) {
                            pri = tr_price[i];
                            price_range = JSON.parse(pri.getAttribute("data-range"));
                            price_table.push(price_range);
                        }
                    }
                } else {
                    tr_price = detail_price.querySelectorAll("tr.price td");
                    if (tr_price != null && tr_price.length > 0) {
                        for (var j = 0; j < tr_price.length; j++) {
                            try {
                                pri = tr_price[j];
                                var range = pri.getAttribute("data-range");
                                if (range !== "") {
                                    price_range = JSON.parse(range);
                                    price_table.push(price_range);
                                }
                            } catch (e) {

                            }

                        }
                    }
                }
            } else {

                var price_wrap = document.getElementsByClassName("price-data-wrap");
                var price_begin_wrap = document.getElementsByClassName("price-begin-wrap");
                if (price_wrap != null && price_begin_wrap != null && price_wrap.length > 0 && price_begin_wrap.length > 0) {
                    tr_price = price_wrap[0].querySelectorAll(".price-item");
                    if (tr_price != null && tr_price.length > 0) {
                        for (i = 0; i < tr_price.length; i++) {
                            var td_price = tr_price[i].querySelectorAll("span.price-num");
                            if(td_price && td_price.length > 0) {
                                price_table.push({"price": td_price[0].textContent});
                            }
                        }
                    }
                    tr_price = price_begin_wrap[0].querySelectorAll(".price-item");
                    if (tr_price != null && tr_price.length > 0) {
                        for (i = 0; i < tr_price.length; i++) {
                            var td_price = tr_price[i].getElementsByTagName('span');
                            if(td_price && td_price.length > 0) {
                                let range_quantity = td_price[0].textContent.indexOf('≥') >= 0 ? td_price[0].textContent.replace('≥','').split('-') :td_price[0].textContent.split('-');
                                price_table[i].begin = parseInt(range_quantity[0]);
                                price_table[i].end = parseInt(range_quantity.length == 2 ? range_quantity[1] : 1000000000);
                            }
                        }
                    }
                }
                else {
                    var price = {};
                    var price_common = document.getElementsByClassName("offerdetail_common_beginAmount");

                    // One price
                    if (price_common.length > 0) {
                        price.begin = price_common[0].getElementsByTagName('p')[0].textContent;

                        price.begin = price.begin.match(/[0-9]+/)[0];
                        // get prices
                        detail_price = document.getElementsByClassName("unit-detail-price-display")[0].textContent.split('-');
                        var price_display = {};
                        for (i = 0; i < detail_price.length; i++) {
                            price_display[i] = detail_price[i].match(/[0-9]*[\.]?[0-9]+/g).join('');
                        }
                        price.price = price_display;
                        price.end = "";
                    }
                    else {
                        var other_case_price = $(".obj-price");
                        if (other_case_price != null) {
                            price = '{"begin": "1","end": "1","price": "' + other_case_price.find('.price-now').html() + '"}';
                            price_range = JSON.parse(price);
                            price_table.push(price_range);
                        }
                        else {
                            other_case_price = $(".price-discount-sku");
                            if (other_case_price != null) {
                                price = '{"begin": "1","end": "1","price": "' + other_case_price.find('.value').html() + '"}';
                                price_range = JSON.parse(price);
                                price_table.push(price_range);
                            }
                        }
                    }
                    price_table.push(price);
                }                
            }
            var check = true;
            for (var i = 0; i < price_table.length; i++) {
                if (price_table[i] != null) {
                    check = false;
                }
            }
            if(check) {
                other_case_price = $(".price-discount-sku");
                if(!other_case_price != null && other_case_price.length == 0) {
                    other_case_price = $(".price-data-wrap .price-item");
                    price = other_case_price[0].getAttribute('data-range');
                    price_range = JSON.parse(price);
                    price_table.push(price_range);
                }
                else {
                    price = '{"begin": "1","end": "1","price": "' + other_case_price.find('.value').html() + '"}';
                    price_range = JSON.parse(price);
                    price_table.push(price_range);
                }
            }
        } catch (ex) {
            throw Error(e + "Error function getPriceTable()");
        }
        return JSON.stringify(price_table);
    };

    this.getRequireMin = function () {
        var require_min = 1;
        try {
            require_min = iDetailConfig.beginAmount;
        } catch (e) {
            try {
                var div_unit = $('.unit-detail-freight-cost');
                if (div_unit != null) {
                    var data_config = div_unit.attr('data-unit-config');
                    data_config = $.parseJSON(data_config);
                    require_min = data_config.beginAmount;
                }
            } catch (ex) {
                require_min = 1;
            }

        }
        return require_min;
    };

    /**
     * get Step item
     * @returns {number}
     */
    this.getStep = function () {
        try {
            var step = 1;
            var purchasing_multiple = document.getElementsByClassName('mod-detail-purchasing-multiple');
            var purchasing_single = document.getElementsByClassName('mod-detail-purchasing-single');
            var purchasing_quotation = document.getElementsByClassName('mod-detail-purchasing-quotation');

            var purchasing = null;

            if (purchasing_multiple.length > 0 && purchasing_multiple != null) {
                purchasing = JSON.parse(purchasing_multiple[0].getAttribute("data-mod-config"));
                step = purchasing.wsRuleNum;
            } else if (purchasing_single.length > 0 && purchasing_single != null) { //SINGLE MODE
                purchasing = JSON.parse(purchasing_single[0].getAttribute("data-mod-config"));
                step = purchasing.wsRuleNum;
            } else if (purchasing_quotation.length > 0 && purchasing_quotation != null) {
                step = 0;
            } else {
                step = 1;
            }
            if (step == '' || step == null) {
                step = 1;
            }

            return step;
        } catch (ex) {
            throw Error(ex + "Error function getStep()");
        }

    };

    // Get price by item amout
    this.getPrice = function (quantity) {
        try {

            var price = 0;
            quantity = parseInt(quantity);

            var price_table = this.getPriceTable();
            price = this.getPriceByPriceTable(price_table, quantity);
            if (parseFloat(price) > 0) {

                return this.common_tool.processPrice(price);
            }

            /* n?u l?y theo mod-detail-price-sku*/
            var span_price = document.getElementsByClassName('mod-detail-price-sku');
            if (span_price != null && span_price != "" && span_price != "undefined") {
                span_price = span_price[0];
            }

            if (span_price != null && span_price != "" && span_price != "undefined") {
                var e_num = span_price.getElementsByTagName('span')[2].textContent;
                var p_num = span_price.getElementsByTagName('span')[3].textContent;
                price = e_num + p_num;

                return this.common_tool.processPrice(price);
            }

            /* n?u l?y theoprice-text price-num*/
            var span_price = document.getElementsByClassName('price-text price-num');
            if (span_price != null && span_price != "" && span_price != "undefined") {
                span_price = span_price[0];
            }

            if (span_price != null && span_price != "" && span_price != "undefined") {
                price = span_price.textContent;
                return this.common_tool.processPrice(price);
            }

            /* n?u l?y theo mod-detail-price*/
            var div_prices = document.getElementById('mod-detail-price');

            if (div_prices == null) {

                return this.common_tool.processPrice(price);
            }
            // lay theo table, kieu moi
            var price_content = $('#mod-detail-price table');

            if (price_content != null && price_content != "" && price_content != "undefined") {
                var td = price_content.find('tr[class="price"] td');

                /* kieu khoang Giá 2-2000*/
                if (price == 0) {
                    $('.table-sku tr .amount-input').each(function () {
                        var value = $(this).val();
                        if (value > 0) {
                            var doc = $(this).parent().parent().parent().parent();

                            var prop_to_compare = $.trim(doc.find('td.name').text());
                            price = doc.find('td.price .value').text();
                        }
                    });
                }
                /* ket thuc kieu cu chuoi*/

                if (price == 0) {
                    var price_about = $('.price-original-sku').find('span:nth-child(5)');
                    var check = price_about.html();
                    if (check && check != null && check != 'undefined') {
                        price = price_about.text();
                    } else {
                        price = $('.price-original-sku').find('span:nth-child(2)').text();
                    }
                }
                if (price == 0) {
                    var tr = $('.unit-detail-price-amount').find('tr');
                    var d = $('.amount-input').first();
                    var quantity = d.val();

                    for (var j = 0; j < tr.length; j++) {
                        var price_sku = $(tr[j]).attr('data-range');
                        price_sku = $.parseJSON(price_sku);
                        if (quantity < price_sku.begin) {
                            price_sku.begin = 1;
                        }
                        if (price_sku.end == 0 || price_sku.end == '') {
                            price_sku.end = 5000;
                        }
                        if (quantity >= price_sku.begin
                            && quantity <= price_sku.end) {

                            price = price_sku.price;
                            break;
                        }
                    }
                }

                return this.common_tool.processPrice(price);
            }

            var span_prices = div_prices.getElementsByTagName("span");
            if (span_prices == null || span_prices == '') {

                return this.common_tool.processPrice(price);
            } else {


                var quan_compare = '';
                for (var i = 0; i < span_prices.length; i++) {
                    var str = span_prices[i].textContent;
                    if ((str.indexOf('-') != -1) || (str.indexOf('?') != -1)) {
                        if (str.indexOf('-') != -1) {
                            quan_compare = str.split('-');
                            price = span_prices[i + 1].textContent + '' + span_prices[i + 2].textContent;
                            if (quantity >= quan_compare[0] && quantity <= quan_compare[1]) {
                                break;
                            }
                        }
                        if (str.indexOf('?') != -1) {
                            price = span_prices[i + 1].textContent + '' + span_prices[i + 2].textContent;
                        }
                    }
                }
            }

            return this.common_tool.processPrice(price);
        }
        catch (e) {
            throw Error(e + "Error function getPrice()");
        }
    };


    this.getPriceByPriceTable = function (price_table, quantity) {
        var price = 0;
        try {
            price_table = JSON.parse(price_table);
            if (typeof price_table === 'object') {
                for (var o in price_table) {
                    if (price_table[o] != null && price_table[o].price != undefined && price_table[o].price != "undefined") {
                        var begin = price_table[o].begin;
                        var end = price_table[o].end;

                        if ((begin <= quantity && quantity <= end) ||
                            (begin <= quantity && (parseInt(end) == 0 || end == null || end == "")) || quantity <= begin) {
                            price = price_table[o].price;
                            break;
                        } else {
                            price = price_table[o].price;
                        }
                    }
                }
            }
        } catch (e) {
            price = 0;
        }

        return price;
    };

    /**
     * @author vanhs
     * @description 1688 | Lấy thông tin sellerId
     * @time 15:05 07/11/2015
     * @returns {string}
     */
    this.sellerId = function () {
        var sellerId = "";
        try {
            var unitConfig = document.querySelectorAll(".apply-account")[0].getElementsByTagName("a")[0].getAttribute("data-unit-config");
            unitConfig = JSON.parse(unitConfig);
            sellerId = unitConfig.sellerId;
            //console.info("sellerId: " + sellerId);
        } catch (e) {
            //console.info("1688 | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }
        return sellerId;
    };

    /**
     * SITE 1688
     * Lấy thông tin shop_name
     * @returns {string}
     */
    this.getShopName = function () {
        var shop_name = '';
        try {
            var dom = document.getElementsByName("sellerId");
            if (dom.length) {
                shop_name = dom[0].value;
            }

            if (!shop_name) {
                dom = document.getElementsByClassName('contact-div');
                if (dom.length) {
                    shop_name = dom[0].getElementsByTagName('a')[0].innerHTML;
                }
            }

            if (!shop_name) {
                dom = document.querySelectorAll("meta[property='og:product:nick']")[0].getAttribute("content");
                dom = dom.split(';');
                dom = dom[0];
                dom = dom.split('=');
                shop_name = dom[1];
            }
        } catch (e) {

        }

        try {
            const iniData = this.getSkuModel();
            var offerBaseInfo = iniData.offerBaseInfo;
            var tempModel = iniData.tempModel;
            shop_name = tempModel.companyName ? tempModel.companyName : offerBaseInfo.sellerLoginId;
        } catch (error) {
            
        }
        //console.info('shop_name: ' + shop_name);
        return shop_name;
    };

    /**
     * SITE 1688
     * Lấy thông tin shop_id
     * @returns {string}
     */
    this.getShopId = function () {
        /**
         * Dùng sellerId để làm key
         */
        let shop_id = null;
        //==== step 1: Lấy thông tin trên dom
        try {
            var $dom = document.querySelectorAll('.apply-btn');
            var dataUnitConfigString = $dom[0].getAttribute('data-unit-config');
            var dataUnitConfigJSON = JSON.parse(dataUnitConfigString);
            shop_id = dataUnitConfigJSON.sellerId;
        } catch (e) {

        }
        if(shop_id && shop_id !== undefined) {
            return shop_id;
        }
        //==== step 2: Lấy thông tin dữ liệu trả về trên trang
        try {
            var params = this.getParamsOnPage();
            shop_id = params.iDetailConfig.userId;
        } catch (e) {

        }
        if(shop_id && shop_id !== undefined) {
            return shop_id;
        }

        //==== step 3: Lấy thông tin dữ liệu trả về trên trang
        try {
            var params = this.getParamsOnPage();
            shop_id = params.iDetailConfig.loginId;
        } catch (e) {

        }
        if(shop_id && shop_id !== undefined) {
            return shop_id;
        }

        try {
            const iniData = this.getSkuModel();
            var offerBaseInfo = iniData.offerBaseInfo;
            shop_id = offerBaseInfo.sellerUserId;
        } catch (error) {
            
        }
        if(shop_id && shop_id !== undefined) {
            return shop_id;
        }

        return '';
    };

    /**
     * SITE 1688
     * Lấy biến itemId
     * @returns {number}
     */
    this.getItemId = function () {
        var offerid = 0;
        try {
            try {
                offerid = iDetailConfig.offerid;
            } catch (e) {
                var link = window.location.href;
                var item_id = link.split('.html')[0];
                offerid = item_id.split('offer/')[1];
            }
        } catch (ex) {

        }
        return offerid;
    };

    /**
     * Get stock item
     * @returns {number}
     */
    this.getStock = function () {
        var stock = 0;

        if (this.checkHasOneProperty()) {
            try {
                var json = document.querySelectorAll(".mod-detail-purchasing")[0].getAttribute("data-mod-config");
                stock = JSON.parse(json).max;
            } catch (ex) {

            }
        } else {
            try {
                var params = this.getParamsOnPage;
                stock = params.iDetailData.sku.canBookCount;
            } catch (ex) {

            }
        }

        return stock;
    };

    /**
     * SITE 1688
     * Lấy tiêu đề sản phẩm
     * @returns {string}
     */
     this.getItemTitle = function () {
        var item_title = '';
        try {
            var dom = document.getElementsByName("offerTitle");
            if (dom.length) {
                item_title = dom[0].value;
            }

            if (!item_title) {
                dom = document.getElementById('mod-detail-hd');
                var h1 = dom ? dom.getElementsByTagName('h1') : [];
                if (dom && h1.length > 0) {
                    item_title = h1[0].innerHTML;
                }
            }
            
            if (!item_title) {
                dom = document.getElementById('mod-detail-title');
                var h1 = dom ? dom.getElementsByTagName('h1') : [];
                if (dom && h1.length > 0) {
                    item_title = h1[0].innerHTML;
                }
            }
            
            if (!item_title) {
                dom = document.querySelectorAll('.od-pc-offer-title-contain .title-text');
                if (dom && dom.length > 0) {
                    item_title = dom[0].innerText;
                }
            }
        } catch (ex) {

        }
        //console.info('item_title: ' + item_title);
        return item_title;
    };

    /**
     * SITE 1688
     * Lấy hình ảnh
     * @returns {string}
     */
    this.getItemImage = function () {
        var item_image = "";
        //Lấy ảnh thuộc tính khi người dùng tiến hành chọn ảnh
        try {
            var $dom = document.querySelectorAll(".list-leading a.image.selected img");
            var $dom2 = document.querySelectorAll("li.tab-trigger.active img");
            if ($dom.length) {
                item_image = $dom[0].getAttribute("src");
            } else if ($dom2.length) {
                item_image = $dom2[0].getAttribute("src");
            }
        } catch (exGetImageChoose) { }
        //Lấy ảnh mặc định khi người dùng không chọn gì cả
        try {
            if (!item_image) {
                var $dom3 = document.querySelectorAll(".list-leading a.image img");
                var $dom4 = document.querySelectorAll("li.tab-trigger img");
                if ($dom3.length) {
                    item_image = $dom3[0].getAttribute("src");
                } else if ($dom4.length) {
                    item_image = $dom4[0].getAttribute("src");
                }
            }
        } catch (exGetImageDefault) { }
        
        try {
            if (!item_image) {
                item_image = $('.detail-gallery-preview img.preview-img').attr('src');
            }
        } catch (exGetImageDefault) { }

        if (item_image) {
            item_image = this.common_tool.resizeImage(item_image);
        }
        return item_image;
    };

    this.getItemLink = function () {
        return window.location.href;
    };

    this.getWangwang = function () {
        try {

            var wangwang = "";

            try {
                var a_contact = $('.contact-div .alitalk');

                if (a_contact != null && a_contact.length > 0) {
                    var data_alitalk = a_contact.attr('data-alitalk');

                    if (typeof data_alitalk != 'object') {
                        data_alitalk = $.parseJSON(data_alitalk);
                    }

                    wangwang = data_alitalk.id;
                } else {
                    wangwang = eService.contactList[0].name;
                }

            } catch (e) {
                wangwang = "";
            }

            return wangwang;
        } catch (e) {
            return "";
        }
    };

    this.getWeight = function () {
        var weight = 0;
        try {
            var unit_detail = document.getElementsByClassName("unit-detail-freight-cost");
            if (unit_detail.length > 0) {
                var carriage = JSON.parse(unit_detail[0].getAttribute("data-unit-config"));
                weight = !isNaN(carriage.unitWeight) ? carriage.unitWeight : 0;
            }
        } catch (e) {
            weight = 0;
        }
        return parseFloat(weight);
    };
    return true;
};

var common_tool = new CommonTool();

var origin_site = common_tool.getOriginSite();
var addon_tool = new AddonTool();

var SessionStorage = {
    set: function (key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var saved = window.sessionStorage.getItem(key);
        saved = JSON.parse(saved);
        return saved;
    },
    destroy: function (key) {
        window.sessionStorage.removeItem(key);
    }
};

var Action = {
    afterGetExchangeRate: function (request) {
        if (request.response && request.response.data) {
            exchange_rate = parseFloat(request.response.data.exchange_rate).toFixed(0);
            SessionStorage.set("exchange_rate", exchange_rate);
        } else {
            exchange_rate = "3560";
        }
        if (exchange_rate) {
            $("._addon-exchange-text").text(exchange_rate + "đ");
        }
        start();        
    },

    afterAddToFavorite: function (request) {
        console.info("afterAddToFavorite");
        show_messageorder("Lưu sản phẩm thành công!");
        $('.indicator-hpo').addClass('hidden');
        $('.indicator-hpo').removeClass('shown');
    },

    afterTranslate: function (request) {
        console.info("afterTranslate");
        try {
            var object = new factory(cart_url, add_to_cart_url);
            var result = $.parseJSON(request.response);
            object.set_translate({ title: result['data_translate'] });
        } catch (ex) {
            console.warn(ex.message);
        }
    },

    afterGetCategory: function (request) {
        var data = [{ "id": 2, "name": "Áo nữ", "description": "Áo nữ", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 3, "name": "Áo nam", "description": "Áo nam", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 4, "name": "Quần nữ", "description": "Quần nữ", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 5, "name": "Quần nam", "description": "Quần nam", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 6, "name": "Quần áo trẻ em", "description": "Quần áo trẻ em", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 7, "name": "Váy", "description": "Váy", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 8, "name": "Giày nam", "description": "Giày nam", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 9, "name": "Giày nữ", "description": "Giày nữ", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 10, "name": "Giày trẻ em", "description": "Giày trẻ em", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 11, "name": "Phụ kiện thời trang", "description": "Phụ kiện thời trang", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 12, "name": "Túi xách", "description": "Túi xách", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 13, "name": "Ví", "description": "Ví", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 14, "name": "Mỹ phẩm", "description": "Mỹ phẩm", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 15, "name": "Vải vóc", "description": "Vải vóc", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 16, "name": "Tóc giả", "description": "Tóc giả", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 17, "name": "Đồ chơi", "description": "Đồ chơi", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 18, "name": "Trang sức", "description": "Trang sức", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 19, "name": "Phụ tùng ô tô, xe máy", "description": "Phụ tùng ô tô, xe máy", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 20, "name": "Thiết bị điện tử", "description": "Thiết bị điện tử", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 21, "name": "Linh kiện điện tử", "description": "Linh kiện điện tử", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 22, "name": "Phụ kiện điện tử", "description": "Phụ kiện điện tử", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 23, "name": "Sách báo, tranh ảnh, đồ sưu tập", "description": "Sách báo, tranh ảnh, đồ sưu tập", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 24, "name": "Quà tặng", "description": "Quà tặng", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true },
        { "id": 25, "name": "Đồ gia dụng", "description": "Đồ gia dụng", "level": 1, "parent_id": 1, "status": "ACTIVE", "is_leaf": true }]
        var option = '<option value="0">Chọn danh mục</option>';

        var ct = new CommonTool();
        var category_id = ct.getCategorySelected();

        for (var i = 0; i < data.length; i++) {
            var catalog = data[i];
            option += '<option value="' + catalog.id + '"';
            if (parseInt(category_id) === parseInt(catalog.id)) {
                option += ' selected="selected"';
            }
            option += '>';
            for (var j = 0; j < catalog.level; j++) {
                if (parseInt(catalog.level) > 1) {
                    option += "&#8212;";
                }
            }
            option += catalog.name + "</option>";
        }
        option += '<option value="-1">Khác</option>';

        $('._select_category').html(option);
        $('._select_category').attr('data-loaded', 1);//loaded
    },
    afteraddToCartNHSG: function (request) {
        $('.indicator-hpo').removeClass('shown');
        $('.indicator-hpo').addClass('hidden');
        //hunglq: 1688 waiting
        var repall = request.response;
        if (repall.code == 401 || repall.status == 401) {
            show_messageorder('Qúy khách lòng đăng nhập tài khoản tại website hqc247.vn trước khi đặt hàng.', "Lỗi đăng nhập", 1);
        }        
        else if (repall.status == 200 && repall.message == "Success"){
            show_messageorder('Đã thêm sản phẩm vào giỏ', "Thành công", 2);
        }
        else if (repall.message) {
            show_messageorder(repall.message);
        }
        else if (repall.detail) {
            show_messageorder(repall.detail);
        }
        else{
            show_messageorder('Không bắt được link sản phẩm.', "Lỗi", 0);
            console.log(repall);
        }

        if (request.response) {
            var common_tool = new CommonTool();
            common_tool.removeDisabledButtonCart();
        } else {
            show_messageorder("Không kết nối được tới máy chủ, xin quý khách thử lại sau");
            return;
        }
    },
    request: function (params) {
        return $.ajax({

            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            url: params.url,
            type: params.type == undefined ? 'GET' : params.type,
            data: params.data == undefined ? {} : params.data
        });
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "afterGetExchangeRate":
                Action.afterGetExchangeRate(request);
                break;
            case "afterAddToCart":
                Action.afterAddToCart(request);
                break;
            case "afteraddToCartNHSG":
                Action.afteraddToCartNHSG(request);
                break;
            case "afterGetCategory":
                Action.afterGetCategory(request);
                break;
            case "afterTranslate":
                Action.afterTranslate(request);
                break;
            case "afterAddToFavorite":
                Action.afterAddToFavorite(request);
                break;
            case "afterSetTranslateValue":
                window.location.reload();
                break;
            case "afterGetTranslateValue":
                translate_value_bg = request.value;
                load_template();
                break;
            default:
                break;
        }
        return true;
    }
);


function start() {
    var str = window.location.href;
    if (!(str.match(/item.taobao/) || str.match(/detail.ju.taobao.com/) || str.match(/detail.tmall/) || str.match(/detail.1688/)
        || str.match(/.1688.com\/offer/)
        || str.match(/.tmall.hk/)
        || str.match(/.yao.95095.com/)
        || str.match(/tmall.com\/item\//) || str.match(/taobao.com\/item\//))) {
        return false;
    }

    document.querySelectorAll("._addon-template")[0].style.display = 'block';

    var object = new factory(cart_url, add_to_cart_url);
    object.init();

    var common = new CommonTool();

    $(document).on('change', '._select_category', function () {
        var catalog_id = $(this).val();
        $('._select_category').val(catalog_id);
        common_tool.setCategorySelected(catalog_id);
        var input_cate = $('._input_category');
        var $panel_category_other = $("._category-other");
        if (catalog_id === "-1") {
            $panel_category_other.removeClass("hidden");
            input_cate.show();
            input_cate.focus();
        } else {
            $panel_category_other.addClass("hidden");
            input_cate.hide();
        }
    });

    $(document).on('keyup', '._brand_item', function () {
        var brand = $(this).val();
        $('._brand_item').val(brand);
    });

    $(document).on('keyup', '._comment_item', function () {
        var comment = $(this).val();
        $('._comment_item').val(comment);
    });

    $(document).on('keyup', '._input_category', function () {
        var category = $(this).val();
        $('._input_category').val(category);
    });

    $(document).on('click', '._addToCart', function () {
        var object = new factory(cart_url, add_to_cart_url);
        common_tool.addDisabledButtonCart();
        if (origin_site.match(/1688.com/)) {
            object.add_to_cart();
        } else {
            addon_tool.AddToCart();
        }
    });

    $(document).on('click', '._close-warning-ao', function () {
        $("._alert-shop-credible").remove();
    });

    $('._close_tool').click(function () {
        $('._addon-wrapper').hide();
        $("._div-block-price-book").fadeIn();
    });

    $('._minimize_tool').click(function () {
        $('._addon-wrapper').fadeIn();
        $("._div-block-price-book").hide();
    });

    $('#txt-category').change(function () {
        var value = $(this).val();
        if (parseInt(value) == -1) {
            $('.category-other').show();
            $('.category-other input').focus();
        } else {
            $('.category-other').hide();
        }
    });

    $(document).on("click", "#_add-to-favorite", function () {
        var site = common.getHomeLand();
        var title = site == "1688" ? object.getItemTitle() : object.getTitleOrigin();
        var avatar = site == "1688" ? object.getItemImage() : object.getImgLink();
        var item_id = site == "1688" ? object.getItemId() : object.getItemID();
        var price_promotion = 0;
        var price_origin = 0;

        if (site == "1688") {
            try {
                var scripts = document.querySelectorAll("script");
                for (var i = 0; i < scripts.length; i++) {
                    var html = scripts[i].textContent;
                    var res = html.search("iDetailConfig");
                    if (res != -1) {
                        eval(html);
                        price_promotion = iDetailConfig.refPrice;
                        price_origin = iDetailConfig.refPrice;
                        break;
                    }
                }
            } catch (e) {
                // console.warn(e.message);
            }

        } else {
            price_origin = object.getOriginPrice();
            price_promotion = object.getPromotionPrice();
        }

        var data = {
            avatar: avatar ? decodeURIComponent(avatar) : "",
            item_id: item_id,
            link: window.location.href,
            site: site,
            title: title,
            price: price_promotion > 0 ? price_promotion : price_origin
        };

        if (site_using_https) {
            Action.request({
                url: add_to_favorite_url,
                type: "POST",
                data: { send_data: data }
            }).done(function (response) {
                Action.afterAddToFavorite({ response: response });
            });
        } else {
            chrome.runtime.sendMessage({
                action: "addToFavorite",
                url: add_to_favorite_url,
                data: { send_data: data },
                method: 'POST',
                callback: 'afterAddToFavorite'
            });
        }

    });

    return true;
}

function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

String.prototype.hashCode = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


