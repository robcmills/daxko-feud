
var isGameFinished = false,
isQuestionShown = false,
hasBuzzerPlayed = false,
qNum = 0;

setQuestion = function(num) {
  if(num >= data.length) {
    // end game
    $('#question p').text('Finished!');
    isGameFinished = true;
    return;
  }
  var question = data[qNum][0];
  $('#question p').text(question);
};

showNextQuestion = function() {
  setQuestion(qNum);
  qNum++;
  rotateHide($('#question img'));
  rotateShow($('#question p'));
  isQuestionShown = true;
};

rotateHide = function(el) {
  if($(el).attr('data-isShown') === 'false') {return;}
  $(el).attr('data-isShown', 'false');
  $(el)
  .css({'rotateX': '0deg'})
  .transition({
    rotateX: '90deg'
  });
};

rotateShow = function(el) {
  if($(el).attr('data-isShown') === 'true') {return;}
  $(el).attr('data-isShown', 'true');
  $(el)
  .css({'rotateX': '90deg'})
  .transition({
    rotateX: '0deg'
  });
};

resetBoard = function() {
  rotateShow($('#question img'));
  rotateHide($('#question p'));
  resetAnswers();
  isQuestionShown = false;
};

resetAnswers = function() {
  $('.answer-text').each(function(idx, el) {
    rotateHide(el);
  });
  $('.ans-value').each(function(idx, el) {
    rotateHide(el);
  });
};

keyDownHandler = function(evt) {
  if(evt.keyCode === 39) { // right
    $('#question').click();
  }
  else if(evt.keyCode >= 49 && evt.keyCode <= 54) { // 1 - 6
    $('#answer' + (evt.keyCode - 48)).click();
  }
  else if(evt.keyCode === 37) { // left (back)
    if(isQuestionShown) {
      qNum -= 2; if(qNum < 0) {qNum = 0;}
      resetAnswers();
      setQuestion(qNum);
      qNum++;
    }
    else {
      qNum -= 1; if(qNum < 0) {qNum = 0; return;}
      showNextQuestion();
    }
    isGameFinished = false;
  }
  else if(evt.keyCode === 88) { // X 
    if(hasBuzzerPlayed) {return;}
    $('#x img').show();
    $('#x-buzzer')[0].play();
    hasBuzzerPlayed = true;
    setTimeout(function() {
      $('#x img').hide();
    }, 2000); 
  }
};

keyUpHandler = function(evt) {
  if(evt.keyCode === 88) { // X 
    hasBuzzerPlayed = false;
  }
};


$(document).ready(function(){

  $(document).on('keydown', keyDownHandler);
  $(document).on('keyup', keyUpHandler);

  $('#question').click(function(){
    if(isGameFinished) {return;}
    if(isQuestionShown) { 
      resetBoard();
    } else {
      $('#blip')[0].play();
      showNextQuestion();
    }
  });

  $('.answer').click(function(){
    if(!isQuestionShown || isGameFinished) {return;}
    var answerTxt = $(this).find('.answer-text')[0];
    if($(answerTxt).attr('data-isShown') === 'true') {return;}
    var answerVal = $(this).find('.ans-value')[0];
    var id = $(this).attr('id');
    var num = parseInt(id.charAt(id.length-1));

    var bell = $('#bell-ding')[0];
    bell.currentTime = 0;
    bell.play();
    
    $(answerTxt).text(data[qNum-1][1][(num-1)*2]);
    var valString = '' + data[qNum-1][1][(num-1)*2+1];
    $(answerVal).text(valString);

    rotateShow(answerTxt);
    rotateShow(answerVal);
  });
});