;( function ($) {
  var Dom = {
	  sito: $(document).find('#sito > table'),
	  loclog: function(a){
		  return console.log('Log: ', [a]);
	  },
	  actions: {
			superPrimes: function(n){
			  function primeSieve(g,o,r){
				var t = (Math.sqrt(4+8*(g+o))-2)/4,
					e = 0,
					s = 0;
				
				ar.fill(true);
				if (o) {
				  for(var i = Math.ceil((o-1)/3); i < (g+o-1)/3; i++) ar[1+3*i-o] = false;
				  for(var i = 2; i < t; i++){
					s = Math.ceil((o-i)/(1+2*i));
					e = (g+o-i)/(1+2*i);
					if (i%3-1) for(var j = s; j < e; j++) ar[i + j + 2*i*j-o] = false;
				  }
				} else {
					for(var i = 1; i < (g-1)/3; i++) ar[1+3*i] = false;
					for(var i = 2; i < t; i++){
					  e = (g-i)/(1+2*i);
					  if (i%3-1) for(var j = i; j < e; j++) ar[i + j + 2*i*j] = false;
					}
				  }
				for(var i = 0; i < g; i++) ar[i] && r.push((i+o)*2+1);
				return r;
			  }
			  
			  var cs = n <= 1e6 ? 7500 : n <= 1e7 ? 60000 : 100000, // chunk size
				  cc = ~~(n/cs),                     // chunk count
				  xs = n % cs,                       // excess after last chunk
				  ar = Array(cs/2),                  // array used as map
				  result = [];
			  
			  for(var i = 0; i < cc; i++) result = primeSieve(cs/2,i*cs/2,result);
			  result = xs ? primeSieve(xs/2,cc*cs/2,result) : result;
			  result[0] *=2;
			  return result;
			},
			getPrimes: function(max) {
				var sieve = [], i, j, primes = [];
				for (i = 2; i <= max; ++i) {
					if (!sieve[i]) {
						// i has not been marked -- it is prime
						primes.push(i);
						for (j = i << 1; j <= max; j += i) {
							sieve[j] = true;
						}
					}
				}
				return primes;
			},
			createBottles: function(tr, td){
				var tpl = '';
				var l = 0;
				var arr0 = [];			
				var unlimited = Dom.actions.getPrimes( tr*td );
				
				$.each($.merge([], new Array(tr)), function (itr,e){
					tpl += '<tr>';
					$.each($.merge([], new Array(td)), function (itd,e){
						var cr='iron';
						l++;
						for( var p=0; p<unlimited.length; p++ ){
							( l%unlimited[p] === 0 && l !== unlimited[p] ) ? (arr0.push(l), cr='app') : '';
						}
						tpl += '<td class="'+(cr)+'" data-idx="'+((l===1)?'':l)+'">'+((l===1)?'':l)+'</td>';
						( l > (tr*td) ) ? l=0 : l;
					});
				});
			  Dom.sito.html( tpl );
			},
			createHideLayer: function(limit){
				$.each(new Array(limit), function(idx, el){
					var tpl = $('<li>', {
						'class': 'classic_'+idx,
					}).css({
						'width': 20+'px',
					});
					$('#hide-lay').append(tpl);
				});
			}
	  },
	  events: {
			getSuperPrimes: function(t){
			  var primes = [];
			  console.time("primes");
			  primes = Dom.actions.superPrimes(t);//(1000000000);
			  console.timeEnd("primes");
			  Dom.loclog(primes.length, primes);//console.log(primes.length, primes);
			},
			showNumbers: function(target){
				$(target).on('click', function(){
					var $table = $('#sito table');
					var cls = ($(this).attr('id'))['split']('-')[1];
							$table.removeClass('show_app');
							$table.removeClass('show_iron');
							$table.addClass(cls);
					return false;
				});
			},
			toggleNumbers: function(target){
				$(target).on('click', function(){
					var $table = $('#sito table');
					var cls = ($(this).attr('id'))['split']('-')[1];
							$table.toggleClass(cls);
					return false;
				});
		  },
		  showCurrentNum: function(box){
		  	$(document).on('click', 'td', function(){
		  		$(box).text($(this).text());
		  		Dom.events.setLineVisa($(this))
		  		return false;
		  	});
		  },
		  setLineVisa: function($that){
		  	/* remove all .hor_line */
		  	$('li', document).removeClass('hor_line');
		  	var indexTd = $($that, 'tr').index() + 1;
		  	$('#hide-lay li:nth-of-type('+indexTd+')').addClass('hor_line');

		  	$('tr', document).removeClass('hor_line');
		  	$that.closest('tr').addClass('hor_line');
		  	return false;
		  }
	  },
	  init: function(){
	  	var _act = this.actions;
	  	var _event = this.events;
			_act.createBottles(100,40);//100,100
			_act.createHideLayer(40);
			_event.showNumbers('#add-show_iron');
			_event.showNumbers('#add-show_app');
			_event.toggleNumbers('#add-hide_num');
			_event.showCurrentNum('#show-curnum');
			//Dom.events.getSuperPrimes(1000);
	  }
  };
  Dom.init();
})(jQuery);