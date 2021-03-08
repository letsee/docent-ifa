
const reviewText = $('#textReviewContent');
const reviewName = $('#textReviewAuthor');

let currentTarget = null,
    helpRenderable = null,
    editObject = null;

let currentTemplate = {};
// const renderItems = [];
const zpositionDelta = 0.1;
let currentZposition = 0;
const newZposition = (val) => val * -zpositionDelta;
/*const commentTemplate= {
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
};*/
emojiArray.forEach((val, index) => {
    emojiList.append(`<button type="button" class="emojiBtn">${val}</button>`);
});

/*================================ HAMMER ====================================*/

window.addEventListener('touchstart', touchDown);
window.addEventListener('touchend', touchUp);
window.addEventListener('touchmove', touchMove);

let manager = new Hammer(document.body);
manager.get("pinch").set({ enable: true });
manager.get("pan").set({ enable: true, direction: Hammer.DIRECTION_ALL });
manager.get("rotate").set({ enable: true });
manager.get("press").set({ enable: true, time: 1000, threshold: 15 });
manager.get("tap").set({ enable: true });
let lastDeltaX = 0, lastDeltaY = 0;

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

    /*const { deltaX, deltaY } = e;
    const posX = deltaX - lastDeltaX;
    const posY = deltaY - lastDeltaY;

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
    }*/
    if (touch.press) {
        const dZ = touch.current.z + e.deltaY / 4;

        editObject.position.z = -dZ;
        touch.helper.position.z = editObject.position.z - 0;
    } else {
        const dX = touch.current.x + e.deltaX * 2;
        const dY = touch.current.y + e.deltaY * 2;

        editObject.position.x = dX;
        editObject.position.y = -dY;
    }
});

manager.on('panend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.isBoundary) touch.isBoundary = false;
    else {
        if (touch.press) {
            touch.press = false;
            // world.remove(touch.helper);

            touch.current.z = touch.current.z + e.deltaY / 4;
            manager.get("pinch").set({ enable: true });
            // manager.get("rotate").set({ enable: true });
            manager.get("rotate").set({ enable: false });
        } else {
            touch.current.x = touch.current.x + e.deltaX * 2;
            touch.current.y = touch.current.y + e.deltaY * 2;
        }
    }
})

manager.on('pinchmove', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.isBoundary) return;

    /*if (currentTarget.size.width * 2 < editObject.position.x || -currentTarget.size.width * 2 > editObject.position.x) {
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
    }*/

    const scale = e.scale * touch.current.scale;
    // var scale = (e.scale-(e.scale/2)) * touch.current.scale;

    editObject.scale.set(scale, scale, scale);

    const dX = touch.current.x + e.deltaX * 2;
    const dY = touch.current.y + e.deltaY * 2;

    editObject.position.x = dX;
    editObject.position.y = dY;
})

manager.on('pinchend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;
    if (touch.isBoundary) touch.isBoundary = false;

    touch.current.scale = e.scale * touch.current.scale;
    // touch.current.scale = (e.scale-(e.scale/2)) * touch.current.scale;
})

manager.on('rotatemove', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    if (touch.OLD_ROTATE_Z) {
        // editObject.rotateZ((touch.OLD_ROTATE_Z - -e.rotation) / 60);
        editObject.rotateZ(-(touch.OLD_ROTATE_Z - -e.rotation) / 30);
    }
    touch.OLD_ROTATE_Z = -e.rotation;

})

manager.on('rotateend', function (e) {
    if (touch.gestureF3.enable) return;
    if (!editObject) return;

    touch.OLD_ROTATE_Z = null;
})

manager.on('pressup', function (e) {
    if (touch.gestureF3.enable) return;
    if (touch.press) {
        touch.press = false;
        // world.remove(touch.helper);
    }
})

/*manager.on('press', function (e) {
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

    // world.add(touch.helper);
    manager.get('pinch').set({enable: false});
    manager.get('rotate').set({enable: false});
});*/

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

        manager.get("pan").set({ enable: false });
        manager.get("pinch").set({ enable: false });
        manager.get("rotate").set({ enable: false });

        touch.move.x = e.touches[1].pageX;
        touch.move.y = e.touches[1].pageY;
    }
}

function touchUp(e) {
    if (!editObject) return;

    if (touch.gestureF3.enable) touch.gestureF3.count++;

    if (touch.gestureF3.count === 3) {
        manager.get("pan").set({ enable: true });
        manager.get("pinch").set({ enable: true });
        // manager.get("rotate").set({ enable: true });
        manager.get("rotate").set({ enable: false });
        touch.gestureF3.count = 0;
        touch.gestureF3.enable = false;
    }
}

/*================================ AXIOS ====================================*/

/*axios.defaults.baseURL = 'https://browser.letsee.io:8337/parse';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'awe2019wallboard';
const dbUrl = 'classes/wallboard';*/

/**
 * Handle when user clicks on each emoji.
 */
$('.emojiBtn').each(function(index, ele) {
    $(this).click(() => {
        emojiInput.hide();
        addComment('emoji', emojiArray[index]);

        reviewControl.addClass('on');
        // $('#sideNav').addClass('hide');
    })
})

/**
 * Reset comments (?)
 * @param status
 */
function resetComment(status = false) {
    if (editObject) editObject = null;
    // if (!status) world.remove(editObject);
    reviewText.val('');
    reviewName.val('');
    // setCurrentTemplate();
}

/**
 * Add comments.
 * @param _type
 * @param _val
 * @param _author
 */
function addComment(_type, _val, _author = null) {
    // setCurrentTemplate();
    const ele = createDom(_type, _val, _author);
    touch.current.x = 0;
    touch.current.y = 0;
    // ele.position.z = newZposition(currentZposition);
    // currentTemplate.type = _type;
    // world.add(ele);

    currentItem = ele;
    // currentItem.position.set(100, 20, 0);
}

/*function setCurrentTemplate() {
    currentTemplate = {...commentTemplate};
    // touch.current.x = 0;
    // touch.current.y = 0;
    // touch.current.z = 0;
    // touch.current.scale = 1;
    // touch.current.rotation = 0;
}*/

/**
 *
 * @param rotation
 * @returns {{_order: (*|string), _x: *, _y: *, _z: *}}
 */
function extractRotation(rotation) {
    return {
        "_x": rotation._x,
        "_y": rotation._y,
        "_z": rotation._z,
        "_order": rotation._order || "XYZ"
    }
}

/**
 * Create DOM content wrapper for comments (text & emojis).
 *
 * @param _type
 * @param _content
 * @param _author
 * @returns {string}
 */
const createDomContent = (_type, _content, _author = null) => {
    return (_type === 'text') ?
        `<div class="wrap"><div class="comment"><div class="value">${_content}</div><div class="author">${_author}</div></div></div>` :
        `<div class="wrap"><div class="emoji"><div class="value" style="font-size: 50px">${_content}</div></div></div>`;
};

/**
 * Create xrElement for contents (text or emojis).
 *
 * @param _content
 * @param _position
 * @param _rotation
 * @param _scale
 * @returns {*}
 */
function createRenderable(_content, _position = null, _rotation = null, _scale = null) {

    const entity = letsee.getEntityByUri('https://s-developer.letsee.io/api-tm/target-manager/target-uid/604597834e5b9fac00210031');
    let xrelement = letsee.createXRElement(_content, entity);
    // letsee.bindXRElement(xrelement, entity);

    return xrelement;
}

/**
 * Create DOM renderable object and add renderable and helper class to content.
 * @param type
 * @param value
 * @param _author
 * @returns {null}
 */
function createDom(type, value,  _author = null) {
    console.warn(`createDom`);

    // const element = document.createElement('div');
    currentTemplate.content = createDomContent(type, value, _author);

    if (!editObject) {
        editObject = createRenderable(currentTemplate.content);
        editObject.element.classList.add('renderable', 'helper');
    }
    else console.warn("editObject is already exist!");

    return editObject;
}

/**
 * Show all XRElements.
 */
function showCommentRenderable() {

    if (document.getElementsByClassName('renderable') && document.getElementsByClassName('renderable').length > 0) {
        const _renderables = document.getElementsByClassName('renderable');
        for (let i=0; i< _renderables.length; i++) {
            _renderables.item(i).style.visibility = 'visible';
        }
    }
}

/**
 * Hide all XRElements.
 */
function hideCommentRenderable() {

    if (document.getElementsByClassName('renderable') && document.getElementsByClassName('renderable').length > 0) {

        const _renderables = document.getElementsByClassName('renderable');
        for (let i=0; i< _renderables.length; i++) {
            _renderables.item(i).style.visibility = 'hidden';
        }
    }
}

/**
 * Save comment object into XRElements and axios
 * @returns {Promise<unknown>}
 */
function saveComment() {
    return new Promise((resolve, reject) => {
        if (editObject) {
            editObject.element.classList.remove('helper');
            currentTemplate.position = {...editObject.position};
            currentTemplate.rotation = {...extractRotation(editObject.rotation)};
            currentTemplate.scale = {...editObject.scale};

            // TODO: At this moment, we don't use this because of axios
            // postComment().then(resolve).catch(reject);

            // Reset currentItem to prevent edit
            currentItem = null;

            // Update GUI
            reviewControl.removeClass('on');
            reviewButtonWrap.show();
            $('#sideNav').removeClass('hide');

            resetComment();
        } else {
            reject();
        }
    })

}

/**
 * Post the comment on the board.
 *
 * @returns {Promise<unknown>}
 */
/*function postComment() {
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
}*/

/**
 * Get all of comments
 * @returns {Promise<unknown>}
 */
/*function getComments() {
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
}*/

/**
 *
 * @param data
 */
/*function printCommentItemsFromJson(data) {
    data.forEach((item, index) => {
        const renderableItem = createRenderable(item.content, item.position, item.rotation, item.scale);
        renderableItem.position.z = newZposition(currentZposition);
        currentZposition++;
        renderItems.push(renderableItem)
    });
}*/






























