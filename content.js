var yourVisitPushClass = 'your-visits-push';

var tourVisitsWrap = document.createElement('div');
tourVisitsWrap.id = 'your-visits';

var toolBarMsg = 'Loading ...';
var yourVisitsEle = document.createElement('div');

var closeYourVisitBar = document.createElement('div');
closeYourVisitBar.className = 'close';
closeYourVisitBar.innerHTML = 'X';

closeYourVisitBar.onclick = function(){
    document.body.classList.remove(yourVisitPushClass);
};

var host = document.location.host;
var enHost = encodeURIComponent(host);

var pathName = document.location.pathname;
var enPath = encodeURIComponent(pathName);

tourVisitsWrap.appendChild(yourVisitsEle);
tourVisitsWrap.appendChild(closeYourVisitBar);
document.body.appendChild(tourVisitsWrap);

document.body.classList.add(yourVisitPushClass);

chrome.storage.local.get(null, function(data){

    var yourVisitData = data['your-visit-data'] || {};
    if(yourVisitData[enHost]){
        if(yourVisitData[enHost]['paths'][enPath]){
            yourVisitData[enHost]['paths'][enPath].visitcounts ++;
        }else{
            yourVisitData[enHost]['paths'][enPath] = {
                pathname: pathName,
                visitcounts: 1
            }
        }
    }else{
        yourVisitData[enHost] = {
            'domain': {'host': host},
            'paths': {}
        };
        yourVisitData[enHost]['paths'][enPath] = {
            pathname: pathName,
            visitcounts: 1
        };
    }
    chrome.storage.local.clear(function(){
        chrome.storage.local.set({'your-visit-data': yourVisitData}, function(){
            chrome.storage.local.get(null, function(getData){

                //console.log(getData);

                var paths = getData['your-visit-data'][enHost]['paths'];
                var totalVisitsOnThisDomain = 0;

                Object.keys(paths).forEach(function(key) {
                    totalVisitsOnThisDomain += parseInt(paths[key].visitcounts);
                });
                toolBarMsg = 'Total visits in this Domain - '+totalVisitsOnThisDomain+', and total visits in this page - '+paths[enPath].visitcounts;
                yourVisitsEle.innerHTML = toolBarMsg;

            });
        });
    });
});

/*chrome.storage.local.clear(function(){
    console.log('storage cleared');
})*/

