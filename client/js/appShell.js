loadPage = function loadPage() {
    var currentPath = location.pathname,
        currentSearch = location.search;

    fetch(location.pathname + location.search + (currentSearch ? "&" : "?") + "fragment=true").then(function fetchRespose(response) {
        response.text().then(function(text) {
            document.querySelectorAll(".pageContent")[0].innerHTML = text;

            document.querySelectorAll(".scriptString:not(.processed)").forEach(function(e, i) {
                evaluateScript(e);
            });
            Promise.all(document.querySelectorAll(".scriptElement").map(e => {
                return loadScript(e.src);
            })).then( () => {
            	alert("loaded");
            })
        });
    });
}

loadPage();


/////////////////

evaluateScript = function evaluateScript(ele) {
    var script = ele.innerHTML;
    eval(script);
};

loadScript = function loadScript(url) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.async = true;
        script.src = url;

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
};