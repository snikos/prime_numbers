;( function ($) {
  var Dom = {
	  sito: $(document).find('#table'),
	  loclog: function(a){
		  return console.log('Log: ', [a]);
	  },
	  actions: {
			superPrimes: function(n){
			  function primeSieve(g,o,r){
					var t = (Math.sqrt(4+8*(g+o))-2)/4,
						e = 0,
						s = 0;
					//Dom.loclog(ar);
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
			  result[0] *= 2;
			  return result;
			},
			getPrimes: function(max) {
				var sieve = [], i, j, primes = [];
				for (i = 2; i <= max; ++i) { //i=[prime]
					if (!sieve[i]) {
						// i has not been marked -- it is prime
						primes.push(i);
						for (j = i << 1; j <= max; j += i) { //j=[not prime]
							sieve[j] = true;// if not prime, then add true [true,true,..]
						}
					}
				}
				return primes;//[2,3,5,7,..]
			},
			createBottles: function(total){
				var tpl = '';
				var l = 0;
				var arr0 = [];			
				var unlimited = Dom.actions.getPrimes( total );
				$.each($.merge([], new Array(total)), function (itr,e){
						var cr='iron';
						l++;
						for( var p=0; p<unlimited.length; p++ ){
							( l%unlimited[p] === 0 && l !== unlimited[p] ) ? (arr0.push(l), cr='app') : '';
						}
						tpl += '<li class="'+(cr)+'" data-idx="'+((l===1)?'':l)+'"></li>';
						( l > (total) ) ? l=0 : l;
				});
			  Dom.sito.html( tpl );
			  var $lastkid = Dom.sito.find('.iron').last().attr('data-idx');
			  $('#total-nums').text($lastkid);
			}
	  },
	  events: {
			getSuperPrimes: function(t){
			  var primes = [];
			  console.time("primes");
			  primes = Dom.actions.superPrimes(t);//(1000000000);
			  console.timeEnd("primes");
			  Dom.loclog(primes.length, primes);
			  //console.log(primes.length, primes);
			},
			showNumbers: function(target){
				$(target).on('click', function(){
					var $table = $('#table');
					var cls = ($(this).attr('id'))['split']('-')[1];
							$table.removeClass('show_app');
							$table.removeClass('show_iron');
							$table.addClass(cls);
					return false;
				});
			},
		  setWidth: function(target, parent){
		  	$(target).on('change', function(){//input
		  		var tar = $(this).attr('id');
		  		var val = $(this).val();
		  		var sel = tar['split']('-');
		  		var key = sel[0];
		  		var prop = (sel[1])['split']('_')[1];
		  		$(key, parent)[prop](val);
		  		if(tar === 'li-size_width'){
		  			Dom.events.checkStepForUl(val);
		  		}
		  		return false;
		  	});
		  },
		  checkStepForUl: function(val){
		  	$('#ul-size_width').attr('step', val);
		  },
		  showCurrentPrime(){
		  	$('#table').on('mouseover', '.iron', function(){
		  		$('#current-num').text($(this).attr('data-idx'))
		  		return false;
		  	})
		  }
	  },
	  init: function(a){
	  	Dom.actions.createBottles(a);

	  	var wml = $('#table li').first().width();
	  	//console.log(wml);
			Dom.events.showNumbers('#add-show_iron');
			Dom.events.showNumbers('#add-show_app');
			Dom.events.setWidth('#ul-size_width', '#sito');
			Dom.events.setWidth('#li-size_width', '#table');
			Dom.events.setWidth('#li-size_height', '#table');
			Dom.events.showCurrentPrime();
			Dom.events.checkStepForUl(wml);
			Dom.events.getSuperPrimes(a);
	  }
  };
  Dom.init(30000);// max limite = 1e+9
})(jQuery);