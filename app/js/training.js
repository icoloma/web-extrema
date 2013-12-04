$(function() {
	// Adjuntar el hash correcto al clicar un pill 
	$('.courses-pills li').on('click', function () {
	  window.location.hash = $($(this).html()).attr('href');
	});

	// Activar el pill correcto
	var pill = location.hash && location.hash.match(/-training/) ? location.hash : '#html5-training';
	$('[href=' + pill + ']').parent().addClass('active');
	$(pill).addClass('active');
});