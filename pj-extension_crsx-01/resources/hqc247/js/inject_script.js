const _iDetailData_tag = document.getElementById('_iDetailData');
if(!_iDetailData_tag || _iDetailData_tag.length == 0) {
    var elem = document.createElement("div");
    elem.id = '_iDetailData';
    elem.setAttribute("style", "display: none;");
    let iDetailData = window.iDetailData ? window.iDetailData : window.__INIT_DATA ? window.__INIT_DATA.globalData : null;
    if(iDetailData) {
        iDetailData.link_type_1688 = window.iDetailData ? 1 : 2;
    }
    elem.innerHTML = JSON.stringify(iDetailData);
    document.body.insertBefore(elem,document.body.childNodes[0]);
}
