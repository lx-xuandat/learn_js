//region -- LocalStorage --
var LocalStorage = {
    set: function (key, value) {
        chrome.storage.local.set({key: JSON.stringify(value)});
    },
    get: function(key) {
        let saved = null;
        chrome.storage.local.get([key], function(result) {
            saved = result.key ? JSON.parse(result.key) : null;
        });
        return saved;
    },
    remove: function(key){
        if(key){
            chrome.storage.local.remove([key]);
        }
    }
};
//endregion

var notify_read = [];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.action)
        {
            case "getExchangeRate":
            case "addToCart":
            case "addToFavorite":
            case "getCategory":
            case "translate":
                getUrls(request, sender, sendResponse);
                break;			
			case "addToCartNHSG":
                getUrlsNHSG(request, sender, sendResponse);
                break;
            case "setTranslateValue":
                setTranslateValue(request, sender, sendResponse);
                break;
            case "getTranslateValue":
                getTranslateValue(request, sender, sendResponse);
                break;
            default :
                break;

        }
        return true;
    }
);

function setTranslateValue(request, sender, sendResponse){
    var value = request.value;
    LocalStorage.set("translate", value);

    chrome.tabs.sendMessage(sender.tab.id, { action: request.callback }, function(response) {

    });
}

function getTranslateValue(request, sender, sendResponse){
    var value = LocalStorage.get("translate") == undefined ? 0 : LocalStorage.get("translate");

    chrome.tabs.sendMessage(sender.tab.id, { action: request.callback, value: value }, function(response) {

    });
}

function getUrls(request, sender, sendResponse){
    let fetchData = {
        method: request.method == undefined ? 'GET' : request.method
    }
    if(request.method == 'POST' || request.method == 'PUT') {
        fetchData.body = request.data == undefined ? {} : request.data
    }
    fetch(request.url, fetchData)
    .then(response => response.json())
    .then(data => {
        chrome.tabs.sendMessage(sender.tab.id, { action: request.callback, response: data });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getUrlsNHSG(request, sender, sendResponse){   
    chrome.storage.local.get('client-api-token', function (clientToken) {
        var hpo_token =  clientToken['client-api-token'] ?  "Bearer " + clientToken['client-api-token'] : '';
        if(request.data && request.data.Products) {
            for (let i = 0; i < request.data.Products.length; i++) {
                const product = request.data.Products[i];
                delete product.price_table;
                delete product.require_min;
                if(product.price_promotion === 0){
                    delete product.price_promotion;
                }
                if(product.weight === 0){
                    delete product.weight;
                }
                product.is_translate = Number(product.is_translate);
                product.quantity = Number(product.quantity);   
            }
        }
        let fetchData = {
            method: request.method == undefined ? 'GET' : request.method,
            credentials: 'include',
            headers: {'Authorization': hpo_token, 'Content-Type': 'application/json'}
        }
        if(request.method == 'POST' || request.method == 'PUT') {
            fetchData.body = JSON.stringify(request.data == undefined ? {} : request.data)
        }
        fetch(request.url, fetchData)
        .then(response => response.json())
        .then(data => {
            chrome.tabs.sendMessage(sender.tab.id, { action: request.callback, response: data });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    })
}
function jsonCallback(json) {
	//alert('hehe');
	$(".test").html(json.volumeInfo.title);
}
function strip_tag(str)
{
	var regex = /(&nbsp;|<([^>]+)>)/ig
      ,   body = str
     ,   result = body.replace(regex, "");
       return result;
}
/******** XỬ LÝ NOTIFY TRÊN ADDON *********/
var service, last_sync_time, user_id;
var time_sync = 1000 * 60 * 5;//5 phut
var id_group_unread_notify = 0;
var number_group_notify = 2;
var prefix = "addon_notify_";

LocalStorage.set(prefix + "is_login", false);

var Notify = {
    /**
     * @description Hàm tạo notify chrome desktop theo tổng số thông báo chưa đọc
     * @author vanhs
     * @time 08:53 21/12/2015
     * @param totalUnreadNotify
     */
    createNotifyGroup: function(totalUnreadNotify){

        if(totalUnreadNotify > number_group_notify){
            id_group_unread_notify++;
            var id = prefix + user_id + "_group_" + id_group_unread_notify;

            var option = {
                type: 'basic',
                iconUrl: Common.getIconWebservice(service),
                title: "",
                message: "Bạn có " + totalUnreadNotify + " thông báo mới",
                priority: 0
            };

            chrome.notifications.create('notify' + id, option, function(id) {
                //console.log("Last error:", chrome.runtime.lastError);
            });
        }

    },

    /**
     * @description Hàm tạo notify chrome desktop theo từng thông báo chưa đọc
     * @author vanhs
     * @time 08:53 21/12/2015
     * @param item
     */
    createNotifyItem: function(item){

        var id = prefix + user_id + "_" + item.id;
        if(notify_read[ id ] == undefined){
            notify_read[ id ] = 1;
            var option = {
                type: 'basic',
                iconUrl: Common.getIconWebservice(service),
                title: item.isBefore12Hours ? $.timeago(item.time) : item.time,
                message: Common.convertingHTMLToPlainText(item.message),
                priority: 0
            };
            chrome.notifications.create('notify' + id, option, function(id) {
                //console.log("Last error:", chrome.runtime.lastError);
            });
        }
    },

    /**
     * @description Hàm render icon theo từng loại thông báo riêng biệt
     * @author vanhs
     * @time 08:53 21/12/2015
     * @param businessType
     * @returns {string}
     */
    renderIcon: function(businessType){
        var icon = "";
        switch (businessType){
            case "COMPLAINT":
                icon = "fa fa-frown-o";
                break;
            case "CHAT":
                icon = "fa fa-comments-o";
                break;
            case "ORDER":
                icon = "fa fa-inbox";
                break;
            case "FINANCE":
                icon = "fa fa-money";
                break;
            default :
                icon = "fa fa-inbox";
                break;
        }
        return icon;
    },

    /**
     * @description Khi thay đổi user login thì xóa toàn bộ dữ liệu của user trước đó đi
     * @author vanhs
     * @returns {boolean}
     */
    clearDataWhenChangeUser: function(){
        try{
            var localCurrentUserId = LocalStorage.get(prefix + "current_user_id") == null ? 0
                : parseInt(LocalStorage.get(prefix + "current_user_id"));

            if(user_id != localCurrentUserId){

                var ids = LocalStorage.get(prefix + "ids");
                if(ids){
                    $.each(ids.split(","), function(idx, id){
                        if(id){
                            LocalStorage.remove(prefix + "item_" + id);
                        }
                    });
                }
                LocalStorage.remove(prefix + "current_user_id");
                LocalStorage.remove(prefix + "is_login");
                LocalStorage.remove(prefix + "ids");
                LocalStorage.remove(prefix + "last_sync_time");

                chrome.browserAction.setBadgeText({
                    text: ''
                });
            }

        }catch (e){

        }

        return true;
    }

};

var Common = {
    getIconWebservice: function(service){
        var iconUrl = 'images/add_on/addon-icon-nhst.png';
        return iconUrl;
    },

    getCurrentDateTime: function() {
        var now     = new Date();
        var year    = now.getFullYear();
        var month   = now.getMonth()+1;
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds();
        if(month.toString().length == 1) {
            month = '0'+month;
        }
        if(day.toString().length == 1) {
            day = '0'+day;
        }
        if(hour.toString().length == 1) {
            hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            second = '0'+second;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    },

    convertingHTMLToPlainText: function(string){
        var s = '';
        if(string){
            string = string.replace(/<br>/gi, "\n");
            string = string.replace(/<p.*>/gi, "\n");
            string = string.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
            string = string.replace(/<(?:.|\s)*?>/g, "");
            s = string;
        }
        return s;
    }
};

// setInterval(function(){
//     if(LocalStorage.get(prefix + "is_login")){
//         Notify.getListNotify();
//     }
// }, time_sync);

Notify.clearDataWhenChangeUser();
//Notify.getListNotify();//Chỉ chạy lần đầu tiên




