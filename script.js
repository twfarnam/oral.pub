
$(function() {

  var moveCount = 0;
  var maxMoves = 40;
  var wordMoving;
  var startX;
  var startY;
  var currentScroll;
 
  $('p').blast({ delimiter: 'word' });

  $(document).on('mousedown', start);
  $(document).on('mousemove', move);
  $(document).on('mouseup', end);

  $(document).on('touchstart', function touchBootstrap() {
    maxMoves = 30;
    $(document).off('touchstart', touchBootstrap);
    $(document).off('mousedown', start);
    $(document).off('mousemove', move);
    $(document).off('mouseup', end);
    document.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    $(document).on('touchend', end);
    $(document).on('touchcancel', end);
  });

  function start(e) {
    if (e.target.tagName !== 'SPAN')
      return;
    if (e.type == 'mousedown' && e.which != 1)
      return;
    e.preventDefault();

    wordMoving = e.target;
    currentScroll = document.body.scrollTop

    $(e.target).addClass('moved');

    var pct = Math.min(100, 100 * (1 - ((moveCount++ + 5) / (maxMoves + 5))));
    $(document.body).css({ background: 'hsl(234, 5%, ' + pct + '%)' });

    startX = 'clientX' in e ? e.clientX : e.touches[0].clientX
    var currentX = $(e.target).css('left');
    startX -= currentX === 'auto' ? 0 : (currentX.slice(0,-2) * 1)

    startY = 'clientY' in e ? e.clientY : e.touches[0].clientY
    var currentY = $(e.target).css('top');
    startY -= currentY === 'auto' ? 0 : (currentY.slice(0,-2) * 1)

    ga('send', 'event', 'interaction', 'drag', 'Dragged a word', moveCount)
  }

  var lastY;
  var scrollTimeout;

  function move(e) {
    if (wordMoving) {
      e.preventDefault();
      var x = 'clientX' in e ? e.clientX : e.touches[0].clientX
      var y = 'clientY' in e ? e.clientY : e.touches[0].clientY

      $(wordMoving).css({ left: x - startX, top: y - startY });

      lastY = y;
      if (!scrollTimeout)
        checkScroll();
    }
  }

  function checkScroll() {
    if (!wordMoving)
      return scrollTimeout = null;
    var scrollMax = document.body.scrollHeight - window.innerHeight;
    if (lastY < 30 && document.body.scrollTop > 20) {
      scrollBy(-10);
      scrollTimeout = requestAnimationFrame(checkScroll);
    }
    else if (lastY > window.innerHeight - 30 && 
             document.body.scrollTop < scrollMax) {
      scrollBy(10);
      scrollTimeout = requestAnimationFrame(checkScroll);
    }
    else {
      scrollTimeout = null;
    }
  }


  function scrollBy(value) {
    let y = $(wordMoving).css('top').slice(0,-2) * 1
    y += value
    startY -= value
    $(wordMoving).css('top', y)
    currentScroll += value;
    document.body.scrollTop = currentScroll
  }

  function end(e) {
    wordMoving = null;
  }

});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-103295188-1', 'auto');
ga('send', 'pageview');

