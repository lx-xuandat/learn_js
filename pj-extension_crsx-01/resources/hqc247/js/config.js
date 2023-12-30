var service_host,
    service_api = 'https://clapi.hqc247.vn/client/api',
    add_to_cart_url,
    cart_url,
    catalog_scalar_url,
    isTranslate,
    link_detail_cart,
    add_to_favorite_url,
    button_add_to_cart_url;

chrome.storage.sync.get({
	domain: 'https://khachhang.hqc247.vn/',	
    is_translate: false
}, function(items) {
    var value = items.domain;
    chrome.storage.sync.set({
        domain: value
    }, function() {});

    service_host = value;
    //============================================================

    isTranslate = items.is_translate;
	add_to_cart_url = `${service_api}/cart/`;
    cart_url = service_host + 'gio-hang.html';
    link_detail_cart = service_host + "gio-hang.html";
    add_to_favorite_url = service_host + "i/favoriteLink/saveLink";
    button_add_to_cart_url = service_host + "assets/images/add_on/icon-bkv1-small.png";

    var css_url = '';
    switch (items.domain){       
        default :
            css_url = 'css/main.css';
            catalog_scalar_url = 'https://hqc247.vn/api/catalog/scalar';
            break;
    }

    if(css_url){
        var NewStyles = document.createElement("link");
        NewStyles.rel = "stylesheet";
        NewStyles.type = "text/css";
        NewStyles.href = chrome.runtime.getURL(css_url);
        document.head.appendChild(NewStyles);
    }
});

var translate_url = 'https://hqc247.vn/i/goodies_util/translate';
var isUsingSetting = false;
var translate_keyword_url = "";
var version_tool = "1.0.0.1";
var exchange_rate;
var nhst_exchange_rate = "0";
var link_store_review_guidelines = "https://hqc247.vn/chuyen-muc/chinh-sach/quyen-loi-khach-hang";
var web_service_url = "https://hqc247.vn/i/";
var exchange_rate_url = `${service_api}/exchange_rate`;