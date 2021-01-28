// Set review screen
const reviewIntro = $('#reviewIntro');
const reviewButtonWrap = $('#reviewButtonWrap');
const reviewTopGuide = $('#reviewTopGuide');
const reviewControl = $('#reviewControl');
const reviewSideNav = $('#reviewSideNav');
const reviewSideNavLink = $('#reviewSideNav a');
const textReviewInput = $('#textReviewInput');
const emojiInput = $('#emojiList');
const emojiList = $('#emojiList .inner');
const startReview = $('#startReview');
const cancelReview = $('#cancelReview');
const cancelPost = $('#cancelPost');
const postReview = $('#postReview');
const backdrop = $('#backdrop');

// Init tabs
$('#overviewTabs').tabs({active: 0});

// Init scrollbar
$('.scrollbar-inner').scrollbar();

function toggleBackdrop(status) {
    status ? backdrop.show() : backdrop.hide();
}

// Comparison
const divider = $("#divider"),
    slider = $("#slider"),
    comparisonHandle = $('#comparisonHandle');

function moveDivider() {
    divider.css('width', `${slider.val()}%`);
    comparisonHandle.css('left', `${slider.val()}%`);
};
moveDivider();
slider.on('change input mousemove', () => {
    moveDivider();
});


// Set main nav

const menuSection = $('#menu'),
    overviewSection = $('#overview'),
    watchpointSection = $('#watchPoint'),
    reviewSection = $('#reviewScreen');
let currentSection = menuSection;

const dissolve = (prev, next, speed = 200) => {
    prev.fadeOut(speed);
    next.fadeIn(speed);
}

$('#overviewBtn').click((e) => {
    dissolve(menuSection, overviewSection);
    // setMainSideNav();
    currentSection = overviewSection;
});
$('#watchPointBtn').click((e) => {
    dissolve(menuSection, watchpointSection);
    $('#chapter1tab ul').addClass('on');
    currentSection = watchpointSection;
});
$('#reviewBtn').click((e) => {
    dissolve(menuSection, reviewSection);
    resetReviewSection();
    // $('#sideNav').removeClass('on');
    currentSection = reviewSection;
});

$('#openNav').click(function () {
    $('#sideNav').toggleClass('on');
});

// function setMainSideNav() {
//     $('#sideNav').addClass('on');
//     // reviewSideNav.removeClass('on');
//     reviewButtonWrap.hide();
// }

// function setReviewSideNav() {
//     $('#sideNav').removeClass('on');
//     reviewSideNav.addClass('on');
// }

function resetReviewSection() {
    reviewIntro.show();
    textReviewInput.hide();
}

$('#sideNav a').click(function(e){
    e.preventDefault();
    const target = $(this).attr('href');
    // $('#sideNav').removeClass('on');
    if (target !== '#close') {
        reviewButtonWrap.hide();
        hideCommentRenderable();
        textReviewInput.hide();
        emojiInput.hide();
    } else {
        $('#sideNav').removeClass('on');
        return true;
    }
    // $('#sideNav a').removeClass('active');
    // $(this).addClass('active');
    const newChapter = $(`${target}`);
    dissolve(currentSection, newChapter);
    if (target === '#reviewScreen') $('#reviewBtn').trigger('click');
    if (target === '#watchPoint') $('#chapter1tab ul').addClass('on');
    if (target === '#menu') {
        $('.topMenuBlock').removeClass('on');
    }
    currentSection = newChapter;
});


function setTextReview() {
    toggleBackdrop(true);
    resetComment();
    textReviewInput.show();
    emojiInput.hide();
    reviewTopGuide.removeClass('on');
}

function setEmojiReview() {
    textReviewInput.hide();
    emojiInput.show();
    reviewButtonWrap.hide();
    // reviewTopGuide.removeClass('on');
    // reviewSideNav.removeClass('on');
}

function resetTextReview() {
    toggleBackdrop(false);
    resetComment();
    textReviewInput.hide();
    emojiInput.hide();
    reviewTopGuide.addClass('on');
}

function hideTextReviewModal() {
    toggleBackdrop(false);
    // resetComment();
    textReviewInput.hide();
    reviewControl.addClass('on');
}

reviewSideNavLink.click(function(e){
    e.preventDefault();
    reviewSideNavLink.removeClass('active');
    $(this).addClass('active');
    switch($(this).attr('href')) {
        case '#menu':
            dissolve(currentSection, menuSection);
            // reviewSideNav.removeClass('on');
            $('.topMenuBlock').removeClass('on');
            reviewButtonWrap.hide();
            hideCommentRenderable();
            textReviewInput.hide();
            emojiInput.hide();
            break;
        case '#textReview':
            setTextReview();
            break;
        case '#emojiReview':
            setEmojiReview();
            break;
    }
});

$('#textReview').click(function() {
    setTextReview();
})


$('#emojiReview').click(function() {
    setEmojiReview();
})

cancelReview.click(() => {
    resetTextReview();
    $('#sideNav').removeClass('hide');
});

$(function(){
    const parent = $('#textReviewInput');
    $("input[type=text]").each(function(){
        $(this).bind('focus', function () {
            const prefix = (navigator.userAgent.toLowerCase().match('iphone')) ? 1 : -1;
            parent.css({'top': `${prefix * $(this).position().top}px`,transform: 'translate(-50%, 0)'})
        });
        $(this).bind("blur",function(e){
            parent.css({'top': '50%', transform: 'translate(-50%, -50%)'})
        });
    });
});


textReviewInput.children('form').submit((e) => {
    e.preventDefault();
    const validationFlag = validation(reviewText, reviewName);
    if (validationFlag[0] && validationFlag[1]) {
        // reviewSideNav.removeClass('on');
        reviewButtonWrap.hide();
        $('#sideNav').addClass('hide');
        addComment('text', reviewText.val(), reviewName.val());
        hideTextReviewModal();
    }
});
cancelPost.click(() => {
    $('.topMenuBlock').removeClass('on');
    // reviewSideNav.addClass('on');
    reviewButtonWrap.show();
    world.remove(editObject);
    $('#sideNav').removeClass('hide');
    resetTextReview();
});
postReview.click(() => {
    saveComment()
        .then(() => {
            // alert('Save review success');
            $('.topMenuBlock').removeClass('on');
            emojiInput.hide();
            $('#sideNav').removeClass('hide');
            // reviewTopGuide.addClass('on');
            reviewButtonWrap.show();
            // reviewSideNav.addClass('on');
        });
})


// Set watch point nav

// Init tab
$('#chapter1tab').tabs({
    collapsible: true,
    active: false
});



const noteImage = $('#noteImage');
const prevNav = $('#prev'),
    nextNav = $('#next'),
    watchPointTitle = $('#titleWrap h3'),
    watchPointSubtext = $('#navSubtext');
let currentWatchpoint = 0;
const chapterObj = [
    {
        title: 'The 12 Disciples of Jesus Christ',
        body: '<p>Touch the name for detail information</p>'+
            '<a href="#" class="btnRound btnGoback" id="chapter1goback" onclick="chapter1tabBtn();" style="display: none;">Back</a>'
    },
    {
        title: 'Why did it take two years and<br> nine months to complete?',
        body: ''
    },
    {
        title: 'Perfect ratio',
        body: '<p style="display: none;"><a href="#" class="btnRound btnGoback" onclick="chapter3return();">Back</a></p>' +
            '<a href="#" class="btnRound btnDetail" id="chapter3detail" onclick="chapter3detail();">Detail</a>'
    },
    {
        title: 'Discovery of hidden music',
        body: '<a style="display: none;" href="#" class="btnRound btnGoback" id="chapter4return" onclick="chapter4return();">Back</a>' +
            '<a href="#" class="btnRound btnPlay" id="chapter4play" onclick="chapter4play();">Play</a>'
    }
];

const startNoteAnimation = () => {
    const duration = 1000;
    const delay = 1000;
    const c4NotePrev = $('#c4NotePrev');
    const c4NoteNext = $('#c4NoteNext');
    c4NotePrev.css({'opacity':0});
    c4NoteNext.css({'opacity':0});
    function loop () {
        c4NotePrev
            .animate({opacity: 1}, {duration: duration, easing: 'linear'})
            .delay(delay)
            .animate({opacity: 0}, {duration: duration, easing: 'linear',
            complete: () => {
                c4NoteNext
                    .animate({opacity: 1}, {duration: duration, easing: 'linear'})
                    .delay(delay)
                    .animate({opacity: 0}, {duration: duration, easing: 'linear',
                    complete: loop});
            }});

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
    $("#chapter1tab").tabs({active: false});

    // Chapter 4
    noteImage.attr('src','');
    chapter3return();
    chapter4return();

};

const controlWatchpoint = (curNum, nextNum) => {
    dissolve(
        $(`#chapter-${curNum + 1}`),
        $(`#chapter-${nextNum + 1}`)
    );
    resetChapter();
    initChapter(nextNum);
    watchPointTitle.html(chapterObj[nextNum].title);
    // watchPointSubtext.html(chapterObj[nextNum].body);
    $('#watchNav a').removeClass('disable');
    $('#watchNav').removeClass();
    $('#watchNav').addClass(`c${nextNum+1}`);
    $('#watchPoint .sectionTitle h2').removeClass();
    $('#watchPoint .sectionTitle h2').addClass(`c${nextNum+1}`);

    (nextNum === 3) ? nextNav.addClass('disable') : nextNav.removeClass('disable');
    (nextNum === 0) ? prevNav.addClass('disable') : prevNav.removeClass('disable');
};

const chapter1tabBtn = () => {
    $('#chapter1goback').hide();
    $('#chapter1goback').siblings('p').show();
    $("#chapter1tab").tabs({active: false});
};
$("#chapter1tab li").click(()=> {
    $('#chapter1goback').siblings('p').hide();
    $('#chapter1goback').show();
});

const chapter3detail = () => {
    $('#chapter3detail').hide();
    $('#chapter3detail').siblings('p').show();
    dissolve(
        $('#comparison'), $('#nailDetail')
    );
};
const chapter3return = () => {
    $('#chapter3detail').show();
    $('#chapter3detail').siblings('p').hide();
    dissolve(
        $('#nailDetail'), $('#comparison')
    );
};

const chapter4play = () => {
    $('#chapter4play').hide();
    $('#chapter4return').show();
    dissolve(
        $('#chapter4Note'), $('#chapter4Video')
    );
};
const chapter4return = () => {
    $('#chapter4play').show();
    $('#chapter4return').hide();
    dissolve(
        $('#chapter4Video'), $('#chapter4Note')
    );
};

const resetAllChapter = () => {

};


nextNav.click((e) => {
    e.preventDefault();
    if (currentWatchpoint < 3) currentWatchpoint++;
    else return false;
    controlWatchpoint(currentWatchpoint - 1, currentWatchpoint)
});

prevNav.click((e) => {
    e.preventDefault();
    if (currentWatchpoint > 0) currentWatchpoint--;
    else return false;
    controlWatchpoint(currentWatchpoint + 1, currentWatchpoint)
});


emojiArray.forEach((val, index) => {
    emojiList.append(`<button type="button" class="emojiBtn">${val}</button>`);
});

startReview.click(function() {
    $('#reviewIntro').hide();
    reviewButtonWrap.show();
    showCommentRenderable();
});



window.addEventListener('touchstart', touchDown);
window.addEventListener('touchend', touchUp);
window.addEventListener('touchmove', touchMove);

let manager = new Hammer.Manager(document.body),
    Pan = new Hammer.Pan(),
    Rotate = new Hammer.Rotate(),
    Pinch = new Hammer.Pinch(),
    Press = new Hammer.Press({time: 1000, threshold: 15});

/* recognizeWith : http://hammerjs.github.io/recognize-with
*/
Rotate.recognizeWith([Pan]);
Pinch.recognizeWith([Rotate, Pan]);

manager.add(Press);
manager.add(Pan);
manager.add(Rotate);
manager.add(Pinch);

let touch = {
    current: {
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotation: 0,
    },
    OLD_ROTATE_Z: null,
    move: {
        x: 0,
        y: 0,
    },
    delta: {
        x: 0,
        y: 0,
    },
    press: false,
    helper: null,
    gestureF3: {
        enable: false,
        count: 0,
    },
    isBoundary: false,
};


manager.on('panmove', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;
    if (touch.isBoundary) return;

    if (currentTarget.size.width * 2 < editObject.position.x || -currentTarget.size.width * 2 > editObject.position.x) {
        editObject.position.x = editObject.position.x > 0 ? (currentTarget.size.width * 2) - 1 : -((currentTarget.size.width * 2) - 1);

        touch.current.x = editObject.position.x;
        touch.current.y = -editObject.position.y;
        touch.isBoundary = true;
        return;
    }
    if (currentTarget.size.height * 2 < editObject.position.y || -currentTarget.size.height * 2 > editObject.position.y) {
        editObject.position.y = editObject.position.y > 0 ? (currentTarget.size.height * 2) - 1 : -((currentTarget.size.height * 2) - 1);

        touch.current.x = editObject.position.x;
        touch.current.y = -editObject.position.y;
        touch.isBoundary = true;
        return;
    }

    if (touch.press) {
        const dZ = touch.current.z + (e.deltaY / 4);

        editObject.position.z = -dZ;
        touch.helper.position.z = editObject.position.z - 0;

    } else {
        const dX = touch.current.x + (e.deltaX * 2);
        const dY = touch.current.y + (e.deltaY * 2);

        editObject.position.x = dX;
        editObject.position.y = dY;
    }
    ;
});

manager.on('panend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.isBoundary) touch.isBoundary = false;
    else {
        if (touch.press) {
            touch.press = false;
            world.remove(touch.helper);

            touch.current.z = touch.current.z + e.deltaY / 4;
            manager.get('pinch').set({enable: true});
            manager.get('rotate').set({enable: true});

        } else {
            touch.current.x = touch.current.x + e.deltaX * 2;
            touch.current.y = touch.current.y + e.deltaY * 2;
        }
    }
});

manager.on('pinchmove', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.isBoundary) return;

    if (currentTarget.size.width * 2 < editObject.position.x || -currentTarget.size.width * 2 > editObject.position.x) {
        editObject.position.x = editObject.position.x > 0 ? (currentTarget.size.width * 2) - 1 : -((currentTarget.size.width * 2) - 1);

        touch.current.x = editObject.position.x;
        touch.current.y = -editObject.position.y;
        touch.isBoundary = true;
        return;
    }
    if (currentTarget.size.height * 2 < editObject.position.y || -currentTarget.size.height * 2 > editObject.position.y) {
        editObject.position.y = editObject.position.y > 0 ? (currentTarget.size.height * 2) - 1 : -((currentTarget.size.height * 2) - 1);

        touch.current.x = editObject.position.x;
        touch.current.y = -editObject.position.y;
        touch.isBoundary = true;
        return;
    }

    const scale = e.scale * touch.current.scale;
    // var scale = (e.scale-(e.scale/2)) * touch.current.scale;

    editObject.scale.set(scale, scale, scale);

    const dX = touch.current.x + (e.deltaX * 2);
    const dY = touch.current.y + (e.deltaY * 2);

    editObject.position.x = dX;
    editObject.position.y = dY;
});

manager.on('pinchend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;
    if (touch.isBoundary) touch.isBoundary = false;

    touch.current.scale = e.scale * touch.current.scale;
    // touch.current.scale = (e.scale-(e.scale/2)) * touch.current.scale;
});

manager.on('rotatemove', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.OLD_ROTATE_Z) editObject.rotateZ((touch.OLD_ROTATE_Z - -e.rotation) / 60);
    touch.OLD_ROTATE_Z = -e.rotation;
});

manager.on('rotateend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    touch.OLD_ROTATE_Z = null;
});

manager.on('pressup', function (e) {
    if (touch.gestureF3.enable) return;
    if (touch.press) {
        touch.press = false;
        world.remove(touch.helper);
    }
})

manager.on('press', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    touch.press = true;

    const helpElement = document.createElement('div');
    helpElement.innerHTML = '<img style="" src="assets/idc-zpos.png" srcset="assets/idc-zpos@2x.png 2x, assets/idc-zpos@3x.png 3x">';

    touch.helper = new DOMRenderable(helpElement);

    const scale = editObject.scale.x / .9;
    touch.helper.scale.set(scale, scale, scale);

    touch.helper.position.x = editObject.position.x;
    touch.helper.position.y = editObject.position.y - (scale * 35);
    touch.helper.position.z = editObject.position.z - 0;

    touch.helper.rotateX(Math.PI / 2);

    world.add(touch.helper);
    manager.get('pinch').set({enable: false});
    manager.get('rotate').set({enable: false});
});

// 3F
function touchMove(e) {
    if (!editObject) return;

    if (e.touches.length > 2) {
        if (!touch.gestureF3.enable) return;

        const speed = 0.01;

        const x = e.touches[1].pageX - touch.move.x,
            y = e.touches[1].pageY - touch.move.y;

        const mX = new Matrix4(),
            mY = new Matrix4();

        mX.makeRotationX(y * speed);
        mY.makeRotationY(x * speed);

        const m = new Matrix4(),
            mQ = new Quaternion();

        m.multiplyMatrices(mX, mY);
        mQ.setFromRotationMatrix(m);

        mQ.multiply(editObject.quaternion);

        editObject.quaternion.copy(mQ);

        touch.move.x = e.touches[1].pageX;
        touch.move.y = e.touches[1].pageY;
    }
}

function touchDown(e) {
    if (!editObject) return;

    if (e.touches.length > 2) {
        touch.gestureF3.enable = true;

        manager.get('pan').set({enable: false});
        manager.get('pinch').set({enable: false});
        manager.get('rotate').set({enable: false});

        touch.move.x = e.touches[1].pageX;
        touch.move.y = e.touches[1].pageY;
    }
}

function touchUp(e) {
    if (!editObject) return;

    if (touch.gestureF3.enable) touch.gestureF3.count++;

    if (touch.gestureF3.count === 3) {
        manager.get('pan').set({enable: true});
        manager.get('pinch').set({enable: true});
        manager.get('rotate').set({enable: true});
        touch.gestureF3.count = 0;
        touch.gestureF3.enable = false;
    }
}

axios.defaults.baseURL = 'https://browser.letsee.io:8337/parse';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'awe2019wallboard';
const dbUrl = 'classes/wallboard';

let editObject = null;
let helpRenderable = null;
let currentTarget = null;
const world = new Object3D();
const renderItems = [];
let currentZposition = 0;
const zpositionDelta = 0.1;
const newZposition = (val) => val * -zpositionDelta;


let CURRENT_URI = null;
const commentTemplate= {
    "id": null,
    "type": null,
    "content": null,
    "position": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "rotation": {
        "_x": 0,
        "_y": 0,
        "_z": 0,
        "_order": "XYZ"
    },
    "scale": {
        "x": 1,
        "y": 1,
        "z": 1
    }
};
let currentTemplate = {};
function setCurrentTemplate() {
    currentTemplate = {...commentTemplate};
    touch.current.x = 0;
    touch.current.y = 0;
    touch.current.z = 0;
    touch.current.scale = 1;
    touch.current.rotation = 0;
}


// Comment app
function getComments() {
    console.log('getComments');
    return new Promise((resolve, reject) => {
        axios.get(dbUrl, {
            params: {
                order: 'createdAt'
            }
        })
            .then(data => {
                printCommentItemsFromJson(data.data.results);
                editObject = null;
            })
            .catch(error => {
                reject(error);
            })
    })
}

function printCommentItemsFromJson(data) {
    data.forEach((item, index) => {
        const renderableItem = createRenderable(item.content, item.position, item.rotation, item.scale);
        renderableItem.position.z = newZposition(currentZposition);
        currentZposition++;
        renderItems.push(renderableItem)
    });
}

function extractRotation(rotation) {
    return {
        "_x": rotation._x,
        "_y": rotation._y,
        "_z": rotation._z,
        "_order": rotation._order || "XYZ"
    }

}

getComments();

const reviewText = $('#textReviewContent');
const reviewName = $('#textReviewAuthor');

function resetComment(status = false) {
    if (editObject) editObject = null;
    if (!status) world.remove(editObject);
    reviewText.val('');
    reviewName.val('');
    setCurrentTemplate();
}

function addComment(_type, _val, _author = null) {
    setCurrentTemplate();
    const ele = createDom(_type, _val, _author);
    ele.position.z = newZposition(currentZposition);
    currentTemplate.type = _type;
    world.add(ele);
}

$('.emojiBtn').each(function(index, ele) {
    $(this).click(() => {
        emojiInput.hide();
        addComment('emoji', emojiArray[index]);
        reviewControl.addClass('on');
        $('#sideNav').addClass('hide');
    })
})

function showCommentRenderable() {
    renderItems.forEach((obj) => {
        world.add(obj)
    })
}

function hideCommentRenderable() {
    renderItems.forEach((obj) => {
        world.remove(obj)
    })
}

function validation(_reviewText, _reviewName) {
    let flag = [false, false];
    const textLength = _reviewText.val().length;
    const nameLength = _reviewName.val().length;
    const textError = $('#contentVal');
    const authorError = $('#authorVal');

    if (!textLength) { // no text
        console.log('no text');
        checkValidation(_reviewText, textError, false, "Review is mandotory field.");
        flag[0] = false;

    } else if(textLength > 15) { // too long
        console.log('too long text');
        checkValidation(_reviewText, textError, false, "Too long review. Need lees than 15 character.");
        flag[0] = false;

    } else {
        checkValidation(_reviewText, textError, true);
        flag[0] = true;
    }

    if (!nameLength) {
        checkValidation(_reviewName, authorError, false, "Name is mandotory field.");
        flag[1] = false;
    } else if (nameLength > 5) {
        checkValidation(_reviewName, authorError, false, "Too long name. Need lees than 5 character.");
        flag[1] = false;
    } else {
        checkValidation(_reviewName, authorError, true);
        flag[1] = true;
    }

    return flag;
}

function checkValidation(ele, valText, status, text = null) {
    if (status) {
        ele.removeClass('validationFailed');
        valText.html('');
        valText.hide();
    } else {
        ele.addClass('validationFailed');
        valText.html(text);
        valText.show();
    }

}

// Add world to renderable
function initWorld(e) {
    let uri = e.target.uri;
    if (CURRENT_URI == null) {
        CURRENT_URI = uri;
        currentTarget = app.getEntity(CURRENT_URI);
        e.target.addRenderable(world);
    }
    if (uri !== CURRENT_URI) {
        app.getEntity(CURRENT_URI).removeRenderable(world);
        CURRENT_URI = uri;
        currentTarget = app.getEntity(CURRENT_URI);
        e.target.addRenderable(world);
    }
}

const createDomContent = (_type, _content, _author = null) => {
    return (_type === 'text') ?
        `<div class="wrap"><div class="comment"><div class="value">${_content}</div><div class="author">${_author}</div></div></div>` :
        `<div class="wrap"><div class="emoji"><div class="value">${_content}</div></div></div>`;
};

function createRenderable(_content, _position = null, _rotation = null, _scale = null) {
    const element = document.createElement('div');
    element.classList.add('renderable');
    element.innerHTML = _content;
    const renderableEle = new DOMRenderable(element);
    if (_position)
        renderableEle.position.copy(_position);
    else
        renderableEle.position.setScalar(0);

    if (_rotation)
        renderableEle.rotation.copy(extractRotation(_rotation));
    else
        renderableEle.position.setScalar(0);

    if (_scale)
        renderableEle.scale.copy(_scale);
    else
        renderableEle.position.setScalar(1);

    return renderableEle;
}

function createDom(type, value,  _author = null) {
    // const element = document.createElement('div');
    currentTemplate.content = createDomContent(type, value, _author);
    if (!editObject) editObject = createRenderable(currentTemplate.content);
    else console.warn("editObject is already exist!");
    editObject.element.classList.add("helper");
    return editObject;
}

function saveComment() {
    return new Promise((resolve, reject) => {
        if (editObject) {
            editObject.element.classList.remove('helper')
            currentTemplate.position = {...editObject.position};
            currentTemplate.rotation = {...extractRotation(editObject.rotation)};
            currentTemplate.scale = {...editObject.scale};
            postComment()
                .then(resolve)
                .catch(reject);
        } else {
            reject();
        };
    })

}
function postComment() {
    return new Promise((resolve, reject) => {
        if(currentTemplate) {
            axios.post(dbUrl, currentTemplate)
                .then((result) => {
                    renderItems.push(editObject);
                    currentZposition++;
                    resetComment();
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                    resetComment(true);
                })
        } else {
            reject(error);
            resetComment();
        }
    })
}

