chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			_BT_pluginClick: 1
		});
	});
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	console.log(request);
	if (request.cmd == "injectHTML") {
		$.ajax({
			url: chrome.extension.getURL("/src/html/injected.html"),
			dataType: "html",
			success: sendResponse
		});
	} else if (request.cmd == "_BT_screenshot") {
		chrome.tabs.captureVisibleTab({
			quality: 100
		},
		function (data) {
			var content = document.createElement("canvas");
			var image = new Image();
			var url = request.specs.url.split('/').slice(-2)[0];

			// This was to remove backslashes
			// .replace(/\//g, '')

			image.onload = function () {
				var canvas = content;
				canvas.width = request.specs.width;
				canvas.height = request.specs.height;

				var context = canvas.getContext("2d");
				context.scale(1/window.devicePixelRatio, 1/window.devicePixelRatio);
				context.drawImage(image, 0, 0);

				var link = document.createElement('a');
				link.download = url + '.jpg';
				link.href = content.toDataURL("image/jpeg");
				link.click();
			};
			image.src = data;
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.storage.sync.set({
					'uniqueID_disable': 0
				});
				chrome.tabs.sendMessage(tabs[0].id, {
					_BT_screenshot: 0
				});
			});
		});
	} else if (request.cmd == "_BT_resetZoom") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.setZoom(tabs[0].id, 1);
			console.log('setting zoom')
		});
	}
})