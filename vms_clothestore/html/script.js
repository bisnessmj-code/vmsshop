let price = 0
let defaultPrice = 0
let componentsPrices = {}
let idsPrices = {}
let componentsPricesStore = {}
let idsPricesStore = {}
var disabledValues = {}
var currentValue = {}
var direction = ""
var handsUpKey = null
var excludedTextures = {}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

window.addEventListener('message', function(event) {
    var item = event.data;
    if (item.action == "openClothestore") {
        $('.receipt').hide();
        $('.panel').show();
        $('.categories').empty();
        $("body").fadeIn(100);

        $('#headerName').text(translate.create_character);
        $('#headerCategory').text(translate.select_category);

        $(".accept-skin").show()

        $('#rotate-text').text(translate.rotate);
        $('#height-text').text(translate.height);
        $('#distance-text').text(translate.distance);

        $('#buy').text(translate.buy);
        $('#cancel').text(translate.cancel);
        
        excludedTextures = {};

        price = 0;

        defaultPrice = item.defaultPrice;
        
        componentsPrices = item.componentsPrices;
        idsPrices = item.idsPrices;
        
        componentsPricesStore = item.componentsPricesStore;
        idsPricesStore = item.idsPricesStore;

        handsUpKey = item.handsUpKey;
        disabledValues = item.disabledValues;

        
        if (!item.enableHandsUpButton) {
            $('.hands-up').hide()
        }

        if (item.categories) {
            if (item.categories['hats']) {
                $('.categories').append(`
                    <div class="hats categoryBtn" data-type="hats">
                        <img class="itemIcon" width="55" height="55" src="icons/hats.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['masks']) {
                $('.categories').append(`
                    <div class="masks categoryBtn" data-type="masks">
                        <img class="itemIcon" width="55" height="55" src="icons/masks.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['torsos']) {
                $('.categories').append(`
                    <div class="torsos categoryBtn" data-type="torsos">
                        <img class="itemIcon" width="55" height="55" src="icons/torsos.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['bproofs']) {
                $('.categories').append(`
                    <div class="bproofs categoryBtn" data-type="bproofs">
                        <img class="itemIcon" width="55" height="55" src="icons/bproofs.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['pants']) {
                $('.categories').append(`
                    <div class="pants categoryBtn" data-type="pants">
                        <img class="itemIcon" width="55" height="55" src="icons/pants.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['shoes']) {
                $('.categories').append(`
                    <div class="shoes categoryBtn" data-type="shoes">
                        <img class="itemIcon" width="55" height="55" src="icons/shoes.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['chains']) {
                $('.categories').append(`
                    <div class="chains categoryBtn" data-type="chains">
                        <img class="itemIcon" width="55" height="55" src="icons/chains.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['glasses']) {
                $('.categories').append(`
                    <div class="glasses categoryBtn" data-type="glasses">
                        <img class="itemIcon" width="55" height="55" src="icons/glasses.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['watches']) {
                $('.categories').append(`
                    <div class="watches categoryBtn" data-type="watches">
                        <img class="itemIcon" width="55" height="55" src="icons/watches.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['ears']) {
                $('.categories').append(`
                    <div class="ears categoryBtn" data-type="ears">
                        <img class="itemIcon" width="55" height="55" src="icons/ears.svg" draggable="false">
                    </div>
                `)
            }
            if (item.categories['bags']) {
                $('.categories').append(`
                    <div class="bags categoryBtn" data-type="bags">
                        <img class="itemIcon" width="55" height="55" src="icons/bags.svg" draggable="false">
                    </div>
                `)
            }
        }

        for (const [key, value] of Object.entries(item.data)) {
            currentValue[key] = {min: value.min, value: value.value, newValue: value.value, max: value.max, excluded: []}
        }

        for (const [k, v] of Object.entries(currentValue)) {
            if (disabledValues[k]) {
                if ((k).includes('2')) {
                    excludedTextures[k] = {}
                    for (const [_k, _v] of Object.entries(disabledValues[k])) {
                        if (!excludedTextures[k][_k]) {
                            excludedTextures[k][_k] = []
                        }
                        excludedTextures[k][_k].push(_v)
                    }
                } else {
                    for (const [_k, _v] of Object.entries(disabledValues[k])) {
                        v.excluded.push(_v)
                    }
                }
            }
        }
    }
    if (item.action == 'updateSecondValue') {
        document.getElementById(`${item.secondItem}-range`).max = item.secondValue
        document.getElementById(`${item.secondItem}-range`).value = 0

        if (excludedTextures[(item.secondItem).toString()] && excludedTextures[(item.secondItem).toString()][item.mainValue]) {
            document.getElementById(`${item.secondItem}-range`).setAttribute('data-excluded', excludedTextures[(item.secondItem).toString()][item.mainValue]);
        } else {
            let element = document.getElementById(`${item.secondItem}-range`);
            if (element.hasAttribute('data-excluded')) {
                element.removeAttribute('data-excluded');
            }
        }
        
        $(`#${item.secondItem}-value`).val(0)
        $(`#${item.secondItem}-max`).html(item.secondValue)
    }
    if (item.action == "openReceipt") {
        let receipt = item.receipt
        $('.receipt > .receipt-texts .list').empty()
        $('.panel').fadeOut(250);
        $('.receipt > .receipt-texts > .header-label').text(translate.receipt_header)

        $('.receipt > .receipt-texts .item').text(translate.receipt_item)
        $('.receipt > .receipt-texts .amount').text(translate.receipt_amount)

        $('.receipt > .receipt-texts .total > div:first-child').text(translate.receipt_total)
        $('.receipt > .receipt-texts .total > div:nth-child(2)').html(`<span>${item.receiptTotal}${translate.currency}</span>`)
        $('.receipt > .receipt-texts .pay_cash').text(translate.receipt_pay_cash)
        $('.receipt > .receipt-texts .pay_bank').text(translate.receipt_pay_bank)
        $('.receipt > .receipt-texts .cancel').text(translate.receipt_cancel)
        price = item.receiptTotal
        for (const [k, v] of Object.entries(receipt)) {
            $('.receipt > .receipt-texts .list').append(`
                <div class="product">
                    <div>${k.includes("_1") && `${translate[`title_${k.replace("_1", "")}`]}` || k.includes("_2") && `${translate[`title_${k.replace("_2", "")}`]}` || `${translate[`title_${k}`]}`} - ${translate[`sub_${k}`]}</div>
                
                    <div>
                        <span>${v}${translate.currency}</span>
                    </div>
                </div>
            `);
        }

        $('.receipt').fadeIn(150);
    }
    if (item.action == 'close') {
        $("body").css("display", "none")
        $('.panel').empty()
    }
});

$(document).on('click', '.accept-skin', function(e) {
    $.post('https://vms_clothestore/openBill', JSON.stringify({currentValue: currentValue}));
})

$(document).on('click', '.receipt .buttons .pay_cash', function(e) {
    $.post('https://vms_clothestore/buyClothes', JSON.stringify({price: price, type: "cash"}));
})

$(document).on('click', '.receipt .buttons .pay_bank', function(e) {
    $.post('https://vms_clothestore/buyClothes', JSON.stringify({price: price, type: "bank"}));
})

$(document).on('click', '.receipt .buttons .cancel', function(e) {
    $('.panel').fadeIn(150);
    $('.receipt').fadeOut(150);
})

$(document).on('click', '.cancel-skin', function(e) {
    $.post('https://vms_clothestore/cancelClothes');
})

$(document).on('click', '.hands-up', function(e) {
    $.post('https://vms_clothestore/hands_up');
})

$(document).on('click', '.categoryBtn', function(e) {
    $('.panel').empty()
    $('#headerCategory').html(translate.category[$(this).data("type")])
    changeCamera($(this).data("type"))
    switch ($(this).data("type")) {
        case "hats":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_helmet}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option helmet_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_helmet_1}<span>${getPrice('helmet_1', currentValue['helmet_1'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="helmet_1-value" value="${currentValue['helmet_1'].newValue}">/<span id="helmet_1-max">${currentValue['helmet_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('helmet_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['helmet_1'].min}" max="${currentValue['helmet_1'].max}" value="${currentValue['helmet_1'].newValue}" data-excluded="${currentValue['helmet_1'].excluded}" class="input-value-radius" id="helmet_1-range" oninput="changeRange('helmet_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('helmet_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option helmet_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_helmet_2}<span>${getPrice('helmet_2', currentValue['helmet_2'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="helmet_2-value" value="${currentValue['helmet_2'].newValue}">/<span id="helmet_2-max">${currentValue['helmet_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('helmet_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['helmet_2'].min}" max="${currentValue['helmet_2'].max}" value="${currentValue['helmet_2'].newValue}" class="input-value-radius" id="helmet_2-range" oninput="changeRange('helmet_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('helmet_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "masks":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_mask}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option mask_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_mask_1}<span>${getPrice('mask_1', currentValue['mask_1'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="mask_1-value" value="${currentValue['mask_1'].newValue}">/<span id="mask_1-max">${currentValue['mask_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('mask_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['mask_1'].min}" max="${currentValue['mask_1'].max}" value="${currentValue['mask_1'].newValue}" data-excluded="${currentValue['mask_1'].excluded}" class="input-value-radius" id="mask_1-range" oninput="changeRange('mask_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('mask_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option mask_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_mask_2}<span>${getPrice('mask_2', currentValue['mask_2'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="mask_2-value" value="${currentValue['mask_2'].newValue}">/<span id="mask_2-max">${currentValue['mask_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('mask_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['mask_2'].min}" max="${currentValue['mask_2'].max}" value="${currentValue['mask_2'].newValue}" class="input-value-radius" id="mask_2-range" oninput="changeRange('mask_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('mask_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "torsos":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_tshirt}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option tshirt_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_tshirt_1}<span>${getPrice('tshirt_1', currentValue['tshirt_1'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="tshirt_1-value" value="${currentValue['tshirt_1'].newValue}">/<span id="tshirt_1-max">${currentValue['tshirt_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('tshirt_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['tshirt_1'].min}" max="${currentValue['tshirt_1'].max}" value="${currentValue['tshirt_1'].newValue}" data-excluded="${currentValue['tshirt_1'].excluded}" class="input-value-radius" id="tshirt_1-range" oninput="changeRange('tshirt_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('tshirt_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option tshirt_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_tshirt_2}<span>${getPrice('tshirt_2', currentValue['tshirt_2'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="tshirt_2-value" value="${currentValue['tshirt_2'].newValue}">/<span id="tshirt_2-max">${currentValue['tshirt_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('tshirt_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['tshirt_2'].min}" max="${currentValue['tshirt_2'].max}" value="${currentValue['tshirt_2'].newValue}" class="input-value-radius" id="tshirt_2-range" oninput="changeRange('tshirt_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('tshirt_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-block">
                    <p class="item-title">${translate.title_torso}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option torso_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_torso_1}<span>${getPrice('torso_1', currentValue['torso_1'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="torso_1-value" value="${currentValue['torso_1'].newValue}">/<span id="torso_1-max">${currentValue['torso_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('torso_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['torso_1'].min}" max="${currentValue['torso_1'].max}" value="${currentValue['torso_1'].newValue}" data-excluded="${currentValue['torso_1'].excluded}" class="input-value-radius" id="torso_1-range" oninput="changeRange('torso_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('torso_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option torso_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_torso_2}<span>${getPrice('torso_2', currentValue['torso_2'].newValue)}</span></p>
                                    <p class="item-value">
                                        <input type="number" class="item-value-input" id="torso_2-value" value="${currentValue['torso_2'].newValue}">/<span id="torso_2-max">${currentValue['torso_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('torso_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['torso_2'].min}" max="${currentValue['torso_2'].max}" value="${currentValue['torso_2'].newValue}" class="input-value-radius" id="torso_2-range" oninput="changeRange('torso_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('torso_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-block">
                    <p class="item-title">${translate.title_arms}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option arms">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_arms}<span>${getPrice('arms', currentValue['arms'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="arms-value" value="${currentValue['arms'].newValue}">/<span id="arms-max">${currentValue['arms'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('arms', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['arms'].min}" max="${currentValue['arms'].max}" value="${currentValue['arms'].newValue}" data-excluded="${currentValue['arms'].excluded}" class="input-value-radius" id="arms-range" oninput="changeRange('arms')">
                                    ${config.useArrows && `<button onclick="changeArrow('arms', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option arms_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_arms_2}<span>${getPrice('arms_2', currentValue['arms_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="arms_2-value" value="${currentValue['arms_2'].newValue}">/<span id="arms_2-max">${currentValue['arms_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('arms_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['arms_2'].min}" max="${currentValue['arms_2'].max}" value="${currentValue['arms_2'].newValue}" class="input-value-radius" id="arms_2-range" oninput="changeRange('arms_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('arms_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-block">
                    <p class="item-title">${translate.title_decals}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option decals_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_decals_1}<span>${getPrice('decals_1', currentValue['decals_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="decals_1-value" value="${currentValue['decals_1'].newValue}">/<span id="decals_1-max">${currentValue['decals_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('decals_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['decals_1'].min}" max="${currentValue['decals_1'].max}" value="${currentValue['decals_1'].newValue}" data-excluded="${currentValue['decals_1'].excluded}" class="input-value-radius" id="decals_1-range" oninput="changeRange('decals_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('decals_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option decals_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_decals_2}<span>${getPrice('decals_2', currentValue['decals_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="decals_2-value" value="${currentValue['decals_2'].newValue}">/<span id="decals_2-max">${currentValue['decals_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('decals_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['decals_2'].min}" max="${currentValue['decals_2'].max}" value="${currentValue['decals_2'].newValue}" class="input-value-radius" id="decals_2-range" oninput="changeRange('decals_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('decals_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "bproofs":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_bproof}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option bproof_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bproof_1}<span>${getPrice('bproof_1', currentValue['bproof_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bproof_1-value" value="${currentValue['bproof_1'].newValue}">/<span id="bproof_1-max">${currentValue['bproof_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bproof_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bproof_1'].min}" max="${currentValue['bproof_1'].max}" value="${currentValue['bproof_1'].newValue}" data-excluded="${currentValue['bproof_1'].excluded}" class="input-value-radius" id="bproof_1-range" oninput="changeRange('bproof_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('bproof_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option bproof_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bproof_2}<span>${getPrice('bproof_2', currentValue['bproof_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bproof_2-value" value="${currentValue['bproof_2'].newValue}">/<span id="bproof_2-max">${currentValue['bproof_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bproof_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bproof_2'].min}" max="${currentValue['bproof_2'].max}" value="${currentValue['bproof_2'].newValue}" class="input-value-radius" id="bproof_2-range" oninput="changeRange('bproof_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('bproof_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "pants":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_pants}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option pants_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_pants_1}<span>${getPrice('pants_1', currentValue['pants_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="pants_1-value" value="${currentValue['pants_1'].newValue}">/<span id="pants_1-max">${currentValue['pants_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('pants_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['pants_1'].min}" max="${currentValue['pants_1'].max}" value="${currentValue['pants_1'].newValue}" data-excluded="${currentValue['pants_1'].excluded}" class="input-value-radius" id="pants_1-range" oninput="changeRange('pants_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('pants_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option pants_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_pants_2}<span>${getPrice('pants_2', currentValue['pants_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="pants_2-value" value="${currentValue['pants_2'].newValue}">/<span id="pants_2-max">${currentValue['pants_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('pants_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['pants_2'].min}" max="${currentValue['pants_2'].max}" value="${currentValue['pants_2'].newValue}" class="input-value-radius" id="pants_2-range" oninput="changeRange('pants_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('pants_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "shoes":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_shoes}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option shoes_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_shoes_1}<span>${getPrice('shoes_1', currentValue['shoes_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="shoes_1-value" value="${currentValue['shoes_1'].newValue}">/<span id="shoes_1-max">${currentValue['shoes_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('shoes_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['shoes_1'].min}" max="${currentValue['shoes_1'].max}" value="${currentValue['shoes_1'].newValue}" data-excluded="${currentValue['shoes_1'].excluded}" class="input-value-radius" id="shoes_1-range" oninput="changeRange('shoes_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('shoes_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option shoes_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_shoes_2}<span>${getPrice('shoes_2', currentValue['shoes_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="shoes_2-value" value="${currentValue['shoes_2'].newValue}">/<span id="shoes_2-max">${currentValue['shoes_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('shoes_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['shoes_2'].min}" max="${currentValue['shoes_2'].max}" value="${currentValue['shoes_2'].newValue}" class="input-value-radius" id="shoes_2-range" oninput="changeRange('shoes_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('shoes_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break;
        case "chains":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_chain}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option chain_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_chain_1}<span>${getPrice('chain_1', currentValue['chain_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="chain_1-value" value="${currentValue['chain_1'].newValue}">/<span id="chain_1-max">${currentValue['chain_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('chain_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['chain_1'].min}" max="${currentValue['chain_1'].max}" value="${currentValue['chain_1'].newValue}" data-excluded="${currentValue['chain_1'].excluded}" class="input-value-radius" id="chain_1-range" oninput="changeRange('chain_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('chain_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option chain_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_chain_2}<span>${getPrice('chain_2', currentValue['chain_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="chain_2-value" value="${currentValue['chain_2'].newValue}">/<span id="chain_2-max">${currentValue['chain_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('chain_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['chain_2'].min}" max="${currentValue['chain_2'].max}" value="${currentValue['chain_2'].newValue}" class="input-value-radius" id="chain_2-range" oninput="changeRange('chain_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('chain_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break
        case "glasses":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_glasses}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option glasses_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_glasses_1}<span>${getPrice('glasses_1', currentValue['glasses_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="glasses_1-value" value="${currentValue['glasses_1'].newValue}">/<span id="glasses_1-max">${currentValue['glasses_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('glasses_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['glasses_1'].min}" max="${currentValue['glasses_1'].max}" value="${currentValue['glasses_1'].newValue}" data-excluded="${currentValue['glasses_1'].excluded}" class="input-value-radius" id="glasses_1-range" oninput="changeRange('glasses_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('glasses_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option glasses_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_glasses_2}<span>${getPrice('glasses_2', currentValue['glasses_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="glasses_2-value" value="${currentValue['glasses_2'].newValue}">/<span id="glasses_2-max">${currentValue['glasses_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('glasses_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['glasses_2'].min}" max="${currentValue['glasses_2'].max}" value="${currentValue['glasses_2'].newValue}" class="input-value-radius" id="glasses_2-range" oninput="changeRange('glasses_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('glasses_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break
        case "watches":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_watches}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option watches_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_watches_1}<span>${getPrice('watches_1', currentValue['watches_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="watches_1-value" value="${currentValue['watches_1'].newValue}">/<span id="watches_1-max">${currentValue['watches_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('watches_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['watches_1'].min}" max="${currentValue['watches_1'].max}" value="${currentValue['watches_1'].newValue}" data-excluded="${currentValue['watches_1'].excluded}" class="input-value-radius" id="watches_1-range" oninput="changeRange('watches_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('watches_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option watches_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_watches_2}<span>${getPrice('watches_2', currentValue['watches_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="watches_2-value" value="${currentValue['watches_2'].newValue}">/<span id="watches_2-max">${currentValue['watches_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('watches_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['watches_2'].min}" max="${currentValue['watches_2'].max}" value="${currentValue['watches_2'].newValue}" class="input-value-radius" id="watches_2-range" oninput="changeRange('watches_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('watches_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-block">
                    <p class="item-title">${translate.title_bracelets}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option bracelets_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bracelets_1}<span>${getPrice('bracelets_1', currentValue['bracelets_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bracelets_1-value" value="${currentValue['bracelets_1'].newValue}">/<span id="bracelets_1-max">${currentValue['bracelets_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bracelets_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bracelets_1'].min}" max="${currentValue['bracelets_1'].max}" value="${currentValue['bracelets_1'].newValue}" data-excluded="${currentValue['bracelets_1'].excluded}" class="input-value-radius" id="bracelets_1-range" oninput="changeRange('bracelets_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('bracelets_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option bracelets_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bracelets_2}<span>${getPrice('bracelets_2', currentValue['bracelets_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bracelets_2-value" value="${currentValue['bracelets_2'].newValue}">/<span id="bracelets_2-max">${currentValue['bracelets_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bracelets_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bracelets_2'].min}" max="${currentValue['bracelets_2'].max}" value="${currentValue['bracelets_2'].newValue}" class="input-value-radius" id="bracelets_2-range" oninput="changeRange('bracelets_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('bracelets_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break
        case "ears":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_ears}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option ears_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_ears_1}<span>${getPrice('ears_1', currentValue['ears_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="ears_1-value" value="${currentValue['ears_1'].newValue}">/<span id="ears_1-max">${currentValue['ears_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('ears_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['ears_1'].min}" max="${currentValue['ears_1'].max}" value="${currentValue['ears_1'].newValue}" data-excluded="${currentValue['ears_1'].excluded}" class="input-value-radius" id="ears_1-range" oninput="changeRange('ears_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('ears_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option ears_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_ears_2}<span>${getPrice('ears_2', currentValue['ears_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="ears_2-value" value="${currentValue['ears_2'].newValue}">/<span id="ears_2-max">${currentValue['ears_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('ears_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['ears_2'].min}" max="${currentValue['ears_2'].max}" value="${currentValue['ears_2'].newValue}" class="input-value-radius" id="ears_2-range" oninput="changeRange('ears_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('ears_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break
        case "bags":
            $('.panel').html(`
                <div class="item-block">
                    <p class="item-title">${translate.title_bags}</p>
                    <div class="item-bar">
                        <div class="second-item-bar">
                            <div class="item-option bags_1">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bags_1}<span>${getPrice('bags_1', currentValue['bags_1'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bags_1-value" value="${currentValue['bags_1'].newValue}">/<span id="bags_1-max">${currentValue['bags_1'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bags_1', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bags_1'].min}" max="${currentValue['bags_1'].max}" value="${currentValue['bags_1'].newValue}" data-excluded="${currentValue['bags_1'].excluded}" class="input-value-radius" id="bags_1-range" oninput="changeRange('bags_1')">
                                    ${config.useArrows && `<button onclick="changeArrow('bags_1', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                            <div class="item-option bags_2">
                                <div class="item-values">
                                    <p class="item-subname">${translate.sub_bags_2}<span>${getPrice('bags_2', currentValue['bags_2'].newValue)}</span></p>
                                    <p class="item-value">
                                    <input type="number" class="item-value-input" id="bags_2-value" value="${currentValue['bags_2'].newValue}">/<span id="bags_2-max">${currentValue['bags_2'].max}</span>
                                    </p>
                                </div>
                                <div class="item-suboptions">
                                    ${config.useArrows && `<button onclick="changeArrow('bags_2', 'left')" class="item-arrow-left"><i class="fa-solid fa-caret-left"></i></button>` || ''}
                                    <input type="range" min="${currentValue['bags_2'].min}" max="${currentValue['bags_2'].max}" value="${currentValue['bags_2'].newValue}" class="input-value-radius" id="bags_2-range" oninput="changeRange('bags_2')">
                                    ${config.useArrows && `<button onclick="changeArrow('bags_2', 'right')" class="item-arrow-right"><i class="fa-solid fa-caret-right"></i></button>` || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            break
    }
});

function changeCamera(type) {
    $.post('https://vms_clothestore/change_camera', JSON.stringify({type: type}));
}

function changeRange(item) {
    let inputValue = parseInt($(`#${item}-range`).val())
    let result = inputValue
    if ($(`#${item}-range`).attr('data-excluded')) {
        var excludedValues = $(`#${item}-range`).attr('data-excluded').split(',').map(Number)
        if (excludedValues.includes(inputValue)) {
            result = findClosestValue(inputValue, excludedValues);
            $(`#${item}-range`).val(result);
        }
    }
    if (result != currentValue[item].newValue) {
        currentValue[item].newValue = result
        $.post('https://vms_clothestore/change', JSON.stringify({
            type: item,
            new: Number(result)
        }));
        $(`.${item} .item-subname > span`).html(`${getPrice(item, currentValue[item].newValue)}`);
        $(`#${item}-value`).val(currentValue[item].newValue)
    }
}

function changeArrow(item, curDirection) {
    direction = curDirection;
    let inputValue = 0
    if (curDirection == 'left') {
        inputValue = Number(($(`#${item}-range`).val())) - 1
    } else {
        inputValue = Number($(`#${item}-range`).val()) + 1
    }
    
    let result = inputValue
    
    let min = $(`#${item}-range`).attr('min');
    let max = $(`#${item}-range`).attr('max');
    
    if (result < min) return;
    if (result > max) return;
    
    $(`#${item}-range`).val(result);
    if ($(`#${item}-range`).attr('data-excluded')) {
        var excludedValues = $(`#${item}-range`).attr('data-excluded').split(',').map(Number);
        if (excludedValues.includes(inputValue)) {
            result = findClosestValue(inputValue, excludedValues);
            $(`#${item}-range`).val(result);
        }
    }
    if (result != currentValue[item].newValue) {
        currentValue[item].newValue = result;
        $.post('https://vms_clothestore/change', JSON.stringify({
            type: item,
            new: Number(result)
        }));
        $(`.${item} .item-subname > span`).html(`${getPrice(item, currentValue[item].newValue)}`);
        $(`#${item}-value`).val(currentValue[item].newValue);
    }
}

function getPrice(item, id) {
    if (id != currentValue[item].value) {
        if (idsPricesStore && idsPricesStore[item] && idsPricesStore[item][String(id)] != undefined) {
            return ` - ${idsPricesStore[item][String(currentValue[item].newValue)]}${translate.currency}`;
        } else if (componentsPricesStore && componentsPricesStore[item] != undefined) {
            return ` - ${componentsPricesStore[item]}${translate.currency}`;
        } else if (idsPrices[item] && idsPrices[item][String(id)] != undefined) {
            return ` - ${idsPrices[item][String(currentValue[item].newValue)]}${translate.currency}`;
        } else if (componentsPrices[item] != undefined) {
            return ` - ${componentsPrices[item]}${translate.currency}`;
        } else {
            return ` - ${defaultPrice}${translate.currency}`;
        }
    } else {
        return ``;
    }
}

function findClosestValue(value, excludedValues) {
    var closestValue = value;
    while (excludedValues.includes(closestValue)) {
        if (direction == "left") {
            closestValue--;
        } else {
            closestValue++;
        }
    }
    return closestValue;
}

$(document).on("keydown", function (event) {
    if (event.keyCode == 37) {
        direction = "left"
    } else if (event.keyCode == 39) {
        direction = "right"
    } else if (event.key == handsUpKey) {
        $.post('https://vms_clothestore/hands_up')
    } else if (event.keyCode == 27) {
        $.post('https://vms_clothestore/cancelClothes');
    }
});

$(document).on('keydown', '.item-value-input', function(e) {
    if (event.keyCode === 13) {
        let inputValue = $(this).val();
        let elementId = $(this).attr('id');
        let regexResult = elementId.match(/^(.*?)-/);
        let item = regexResult[1];
        if (item) {
            let result = Number(inputValue);
            if ($(`#${item}-range`).attr('data-excluded')) {
                var excludedValues = $(`#${item}-range`).attr('data-excluded').split(',').map(Number)
                if (excludedValues.includes(inputValue)) {
                    $(this).val($(`#${item}-range`).val(result));
                    return;
                }
            }
            
            let min = $(`#${item}-range`).attr('min');
            if (result < min) {
                $(this).val($(`#${item}-range`).val());
                return
            };

            let max = $(`#${item}-range`).attr('max');
            if (result > max) {
                $(this).val($(`#${item}-range`).val());
                return
            };
            
            currentValue[item].newValue = result;
            $(`.${item} .item-subname > span`).html(`${getPrice(item, currentValue[item].newValue)}`);
            $(`#${item}-range`).val(result);
            $.post('https://vms_clothestore/change', JSON.stringify({
                type: item,
                new: Number(result)
            }));
        }
    }
});

var holdingRightButton = false

var oldx = 0;
var oldy = 0;

document.addEventListener('mousedown', function(event) {
    if (event.button == 2) {
        holdingRightButton = true;
    }
});

document.addEventListener('mouseup', function(event) {
    if (holdingRightButton && event.button == 2) {
        holdingRightButton = false;
    }
});

document.addEventListener('mousemove', function (e) {
    if (holdingRightButton) {
    	if (e.pageX > oldx && e.pageY == oldy) {
            $.post('https://vms_clothestore/upate_camera', JSON.stringify({direction: "right", value: e.pageX - oldx}));
        } 
        if (e.pageX == oldx && e.pageY > oldy) {
            $.post('https://vms_clothestore/upate_camera', JSON.stringify({direction: "bottom", value: e.pageY - oldy}));
        } 
        if (e.pageX == oldx && e.pageY < oldy) {
            $.post('https://vms_clothestore/upate_camera', JSON.stringify({direction: "top", value: oldy - e.pageY}));
        } 
        if (e.pageX < oldx && e.pageY == oldy) {
            $.post('https://vms_clothestore/upate_camera', JSON.stringify({direction: "left", value: oldx - e.pageX}));
        }
        oldx = e.pageX;
        oldy = e.pageY;
    }
});

document.addEventListener("wheel", (e) => {
    if ($('.panel').is(':hover')) return;
    if ($('.settings').is(':hover')) return;
    if ($('.categories').is(':hover')) return;
    if ($('.receipt').is(':hover')) return;
    var zoom = e.deltaY > 1 && 'minus' || 'plus'
    $.post('https://vms_clothestore/update_camera_zoom', JSON.stringify({type: zoom}));
})