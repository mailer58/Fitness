let internetExplorer = false;
var userAgent = navigator.userAgent.toLowerCase();
	if((/mozilla/.test(userAgent) && !/firefox/.test(userAgent) && !/chrome/.test(userAgent) && !/safari/.test(userAgent) && !/opera/.test(userAgent)) || /msie/.test(userAgent))
        internetExplorer = true;

    if (internetExplorer) {
        console.log(internetExplorer);
    }
        
