(function($) {
	$.fn.gridtube = function(options) {

		
		var defaults = {
			multiselect: false,
			col : 4,
			url : 'https://gdata.youtube.com/feeds/api/videos?q=',
			params : '&alt=json&category=Music',
			element : "",
		    destination: "",
		    preview :  function(obj){},
			selected : function(obj){}
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
			var obj = $(this);
			obj.keydown(function(l) {
				if (l.keyCode == 13) {
				$.get(options.url + obj.val() + options.params, function(
							data) {
						createWall(data, options);
					});
				}
			});
		});
		
		
		function createWall(data,options) {
			var feed = eval('(' + data + ')');
			var entry = feed['feed']['entry'];
			var j = 0;
			
			var ul = document.createElement("ul");
			ul.setAttribute("class","video-container");
			ul.setAttribute("style", "width:"+125*options.col+"px");
			for ( var i in entry) {
				var li = document.createElement("li");
				li.setAttribute("class","video-element");
				var a = document.createElement('a');
				a.setAttribute("title",entry[i].title.$t);
				a.setAttribute("href",entry[i].link[0].href + "&fs=1&amp;autoplay=1");
				a.setAttribute("data-position",i);				
				var img = document.createElement('img');
				img.setAttribute("src",entry[i].media$group.media$thumbnail[1].url);
				img.setAttribute("alt",entry[i].title.$t);
				a.appendChild(img);
				li.appendChild(a);			
				j++;
				if (j % options.col == 0) {
					j = 0;
				}
				ul.appendChild(li);
				// obj.duration = entry[i].media$group.yt$duration.seconds;
				// obj.provider = "youtube";
				// obj.link = entry[i].id.$t;
				// obj.image = entry[i].media$group.media$thumbnail[0].url;
			}
			var elem = document.getElementById(options.element);
 			elem.innerHTML = "";			
			elem.appendChild(ul);
			$(".video-element a").click(function(e) {
				if(!e.ctrlKey) {	
					options.preview(this);					
				}else {
					if(options.multiselect){
						var child = $(this).children(":first");
						var opacity = child.css("opacity");
						child.css("opacity",opacity != 0.55 ? 1 : 0.55);
					}else {
						var idx =$(this).data('position');
						options.selected(entry[idx]);
						var dest = document.getElementById(options.destination);
						$(dest).val(entry[idx].title.$t);
					}
				}
				return false;
			});
		}

	};
})(jQuery);
