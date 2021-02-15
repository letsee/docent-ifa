// Set review screen
const reviewIntro   = $("#reviewIntro"),
  reviewButtonWrap  = $("#reviewButtonWrap"),
  reviewTopGuide    = $("#reviewTopGuide"),
  reviewControl     = $("#reviewControl"),
  reviewSideNav     = $("#reviewSideNav"),
  reviewSideNavLink = $("#reviewSideNav a"),
  textReviewInput   = $("#textReviewInput"),
  emojiInput        = $("#emojiList"),
  emojiList         = $("#emojiList .inner"),
  startReview       = $("#startReview"),
  cancelReview      = $("#cancelReview"),
  cancelPost        = $("#cancelPost"),
  postReview        = $("#postReview"),
  backdrop          = $("#backdrop");

// Set main nav
const menuSection   = $("#menu"),
  overviewSection   = $("#overview"),
  watchpointSection = $("#watchPoint"),
  reviewSection     = $("#reviewScreen");
let currentSection  = menuSection;

// Set watchpoint nav
const noteImage     = $("#noteImage"),
  prevNav           = $("#prev"),
  nextNav           = $("#next"),
  watchPointTitle   = $("#titleWrap h3"),
  watchPointSubtext = $("#navSubtext");

// Comparison
const divider        = $("#divider"),
    slider           = $("#slider"),
    comparisonHandle = $("#comparisonHandle");

let currentWatchpoint = 0;

// Init tabs
$("#overviewTabs").tabs({ active: 0 });

// Init scrollbar
$(".scrollbar-inner").scrollbar();

function toggleBackdrop(status) {
  status ? backdrop.show() : backdrop.hide();
}

function moveDivider() {
  divider.css("width", `${slider.val()}%`);
  comparisonHandle.css("left", `${slider.val()}%`);
}

moveDivider();
slider.on("change input mousemove", () => {
  moveDivider();
});

const dissolve = (prev, next, speed = 200) => {
  prev.fadeOut(speed);
  next.fadeIn(speed);
};

$("#overviewBtn").click((e) => {
  dissolve(menuSection, overviewSection);
  // setMainSideNav();
  currentSection = overviewSection;
});
$("#watchPointBtn").click((e) => {
  dissolve(menuSection, watchpointSection);
  $("#chapter1tab ul").addClass("on");
  currentSection = watchpointSection;
});
$("#reviewBtn").click((e) => {
  dissolve(menuSection, reviewSection);
  resetReviewSection();
  // $('#sideNav').removeClass('on');
  currentSection = reviewSection;
});

$("#openNav").click(function () {
  $("#sideNav").toggleClass("on");
});

/*function setMainSideNav() {
    $('#sideNav').addClass('on');
    reviewSideNav.removeClass('on');
    reviewButtonWrap.hide();
}*/

/*function setReviewSideNav() {
    $('#sideNav').removeClass('on');
    reviewSideNav.addClass('on');
}*/

function resetReviewSection() {
  reviewIntro.show();
  textReviewInput.hide();
}

$("#sideNav a").click(function (e) {
  e.preventDefault();
  const target = $(this).attr("href");
  // $('#sideNav').removeClass('on');
  if (target !== "#close") {
    reviewButtonWrap.hide();
    hideCommentRenderable();
    textReviewInput.hide();
    emojiInput.hide();
  } else {
    $("#sideNav").removeClass("on");
    return true;
  }
  // $('#sideNav a').removeClass('active');
  // $(this).addClass('active');
  const newChapter = $(`${target}`);
  dissolve(currentSection, newChapter);
  if (target === "#reviewScreen") $("#reviewBtn").trigger("click");
  if (target === "#watchPoint") $("#chapter1tab ul").addClass("on");
  if (target === "#menu") {
    $(".topMenuBlock").removeClass("on");
  }
  currentSection = newChapter;
});

/**
 * Show text form when user clicks to textReview button.
 */
function setTextReview() {
  toggleBackdrop(true);
  resetComment();
  textReviewInput.show();
  emojiInput.hide();
  reviewButtonWrap.hide();
  // reviewTopGuide.removeClass('on');
  // reviewSideNav.removeClass('on');

  $(".topMenuBlock").removeClass("on");
  $("#sideNav").addClass("hide");
}

/**
 * Show emoji review.
 */
function setEmojiReview() {
  textReviewInput.hide();
  emojiInput.show();
  reviewButtonWrap.hide();
  $("#sideNav").addClass("hide");

  // reviewTopGuide.removeClass('on');
  // reviewSideNav.removeClass('on');
}

function resetTextReview() {
  toggleBackdrop(false);
  resetComment();
  textReviewInput.hide();
  emojiInput.hide();
  reviewTopGuide.addClass("on");
}

function hideTextReviewModal() {
  toggleBackdrop(false);
  // resetComment();
  textReviewInput.hide();
  reviewControl.addClass("on");
}

reviewSideNavLink.click(function (e) {
  e.preventDefault();
  reviewSideNavLink.removeClass("active");
  $(this).addClass("active");
  switch ($(this).attr("href")) {
    case "#menu":
      dissolve(currentSection, menuSection);
      // reviewSideNav.removeClass('on');
      $(".topMenuBlock").removeClass("on");
      reviewButtonWrap.hide();
      hideCommentRenderable();
      textReviewInput.hide();
      emojiInput.hide();
      break;
    case "#textReview":
      setTextReview();
      break;
    case "#emojiReview":
      setEmojiReview();
      break;
  }
});

$("#textReview").click(function () {
  setTextReview();
});

$("#emojiReview").click(function () {
  setEmojiReview();
});

cancelReview.click(() => {
  resetTextReview();
  reviewButtonWrap.show();
  $("#sideNav").removeClass("hide");
});

$(function () {
  const parent = $("#textReviewInput");
  $("input[type=text]").each(function () {
    $(this).bind("focus", function () {
      const prefix = navigator.userAgent.toLowerCase().match("iphone") ? 1 : -1;
      parent.css({
        top: `${prefix * $(this).position().top}px`,
        transform: "translate(-50%, 0)",
      });
    });
    $(this).bind("blur", function (e) {
      parent.css({ top: "50%", transform: "translate(-50%, -50%)" });
    });
  });
});

textReviewInput.children("form").submit((e) => {
  e.preventDefault();
  const validationFlag = validation(reviewText, reviewName);
  if (validationFlag[0] && validationFlag[1]) {
    // reviewSideNav.removeClass('on');
    reviewButtonWrap.hide();
    $("#sideNav").addClass("hide");
    addComment("text", reviewText.val(), reviewName.val());
    hideTextReviewModal();
  }
});
cancelPost.click(() => {
  $(".topMenuBlock").removeClass("on");
  // reviewSideNav.addClass('on');
  reviewButtonWrap.show();

  // Remove xrelement our of Entity
  letsee.getEntityByUri("ultima-cena.json").children.pop();

  // Remove xrelement our of DOM
  let elem = document.querySelector(".helper");
  elem.parentNode.removeChild(elem);

  $("#sideNav").removeClass("hide");
  resetTextReview();
});
postReview.click(() => {
  saveComment().then(() => {
    // alert('Save review success');
    $(".topMenuBlock").removeClass("on");
    emojiInput.hide();
    $("#sideNav").removeClass("hide");
    // reviewTopGuide.addClass('on');
    reviewButtonWrap.show();
    // reviewSideNav.addClass('on');
  });
});

// Set watch point nav

// Init tab
$("#chapter1tab").tabs({
  collapsible: true,
  active: false,
});

const chapterObj = [
  {
    title: "The 12 Disciples of Jesus Christ",
    body:
      "<p>Touch the name for detail information</p>" +
      '<a href="#" class="btnRound btnGoback" id="chapter1goback" onclick="chapter1tabBtn();" style="display: none;">Back</a>',
  },
  {
    title: "Why did it take two years and<br> nine months to complete?",
    body: "",
  },
  {
    title: "Perfect ratio",
    body:
      '<p style="display: none;"><a href="#" class="btnRound btnGoback" onclick="chapter3return();">Back</a></p>' +
      '<a href="#" class="btnRound btnDetail" id="chapter3detail" onclick="chapter3detail();">Detail</a>',
  },
  {
    title: "Discovery of hidden music",
    body:
      '<a style="display: none;" href="#" class="btnRound btnGoback" id="chapter4return" onclick="chapter4return();">Back</a>' +
      '<a href="#" class="btnRound btnPlay" id="chapter4play" onclick="chapter4play();">Play</a>',
  },
];

const startNoteAnimation = () => {
  const duration = 1000;
  const delay = 1000;
  const c4NotePrev = $("#c4NotePrev");
  const c4NoteNext = $("#c4NoteNext");
  c4NotePrev.css({ opacity: 0 });
  c4NoteNext.css({ opacity: 0 });

  function loop() {
    c4NotePrev
      .animate({ opacity: 1 }, { duration: duration, easing: "linear" })
      .delay(delay)
      .animate(
        { opacity: 0 },
        {
          duration: duration,
          easing: "linear",
          complete: () => {
            c4NoteNext
              .animate({ opacity: 1 }, { duration: duration, easing: "linear" })
              .delay(delay)
              .animate(
                { opacity: 0 },
                {
                  duration: duration,
                  easing: "linear",
                  complete: loop,
                }
              );
          },
        }
      );
  }

  loop();
};

const initChapter = (num) => {
  switch (num) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      // noteImage.attr('src','./asset/music-notes.gif');
      startNoteAnimation();
      break;
    default:
      break;
  }
};
const resetChapter = () => {
  // Chapter 1
  $("#chapter1tab").tabs({ active: false });

  // Chapter 4
  noteImage.attr("src", "");
  chapter3return();
  chapter4return();
};

const controlWatchpoint = (curNum, nextNum) => {
  dissolve($(`#chapter-${curNum + 1}`), $(`#chapter-${nextNum + 1}`));
  resetChapter();
  initChapter(nextNum);
  watchPointTitle.html(chapterObj[nextNum].title);
  // watchPointSubtext.html(chapterObj[nextNum].body);
  $("#watchNav a").removeClass("disable");
  $("#watchNav").removeClass();
  $("#watchNav").addClass(`c${nextNum + 1}`);
  $("#watchPoint .sectionTitle h2").removeClass();
  $("#watchPoint .sectionTitle h2").addClass(`c${nextNum + 1}`);

  nextNum === 3 ? nextNav.addClass("disable") : nextNav.removeClass("disable");
  nextNum === 0 ? prevNav.addClass("disable") : prevNav.removeClass("disable");
};

const chapter1tabBtn = () => {
  $("#chapter1goback").hide();
  $("#chapter1goback").siblings("p").show();
  $("#chapter1tab").tabs({ active: false });
};
$("#chapter1tab li").click(() => {
  $("#chapter1goback").siblings("p").hide();
  $("#chapter1goback").show();
});

const chapter3detail = () => {
  $("#chapter3detail").hide();
  $("#chapter3detail").siblings("p").show();
  dissolve($("#comparison"), $("#nailDetail"));
};
const chapter3return = () => {
  $("#chapter3detail").show();
  $("#chapter3detail").siblings("p").hide();
  dissolve($("#nailDetail"), $("#comparison"));
};

const chapter4play = () => {
  $("#chapter4play").hide();
  $("#chapter4return").show();
  dissolve($("#chapter4Note"), $("#chapter4Video"));
};
const chapter4return = () => {
  $("#chapter4play").show();
  $("#chapter4return").hide();
  dissolve($("#chapter4Video"), $("#chapter4Note"));
};

const resetAllChapter = () => {};

nextNav.click((e) => {
  e.preventDefault();
  if (currentWatchpoint < 3) currentWatchpoint++;
  else return false;
  controlWatchpoint(currentWatchpoint - 1, currentWatchpoint);
});

prevNav.click((e) => {
  e.preventDefault();
  if (currentWatchpoint > 0) currentWatchpoint--;
  else return false;
  controlWatchpoint(currentWatchpoint + 1, currentWatchpoint);
});

startReview.click(function () {
  $("#reviewIntro").hide();
  reviewButtonWrap.show();
  showCommentRenderable();
});

/**
 * Validate the text messages.
 * @param _reviewText
 * @param _reviewName
 * @returns {boolean[]}
 */
function validation(_reviewText, _reviewName) {
  let flag = [false, false];
  const textLength = _reviewText.val().length;
  const nameLength = _reviewName.val().length;
  const textError = $("#contentVal");
  const authorError = $("#authorVal");

  if (!textLength) {
    // no text
    console.log("no text");
    checkValidation(
      _reviewText,
      textError,
      false,
      "Review is mandotory field."
    );
    flag[0] = false;
  } else if (textLength > 15) {
    // too long
    console.log("too long text");
    checkValidation(
      _reviewText,
      textError,
      false,
      "Too long review. Need lees than 15 character."
    );
    flag[0] = false;
  } else {
    checkValidation(_reviewText, textError, true);
    flag[0] = true;
  }

  if (!nameLength) {
    checkValidation(
      _reviewName,
      authorError,
      false,
      "Name is mandotory field."
    );
    flag[1] = false;
  } else if (nameLength > 5) {
    checkValidation(
      _reviewName,
      authorError,
      false,
      "Too long name. Need lees than 5 character."
    );
    flag[1] = false;
  } else {
    checkValidation(_reviewName, authorError, true);
    flag[1] = true;
  }

  return flag;
}

/**
 * Validate the input fields.
 * @param ele
 * @param valText
 * @param status
 * @param text
 */
function checkValidation(ele, valText, status, text = null) {
  if (status) {
    ele.removeClass("validationFailed");
    valText.html("");
    valText.hide();
  } else {
    ele.addClass("validationFailed");
    valText.html(text);
    valText.show();
  }
}