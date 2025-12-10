Config = {}

-- We also recommend vms_charcreator, it fits perfectly with the style!

--====================================================--
-- For more information, read the documentation
-- https://docs.vames-store.com/assets/vms_clothestore
--====================================================--



-- ███████╗██████╗  █████╗ ███╗   ███╗███████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
-- ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
-- █████╗  ██████╔╝███████║██╔████╔██║█████╗  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
-- ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
-- ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
-- ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
local frameworkAutoFind = function()
    if GetResourceState('es_extended') ~= 'missing' then
        return "ESX"
    elseif GetResourceState('qb-core') ~= 'missing' then
        return "QB-Core"
    end
end

Config.Core = frameworkAutoFind()
Config.CoreExport = function()
    if Config.Core == "ESX" then
        return exports['es_extended']:getSharedObject() -- ESX
    elseif Config.Core == "QB-Core" then
        return exports['qb-core']:GetCoreObject() -- QB-CORE
    end
end

Config.Notification = function(message, time, type)
    if type == "success" then
        if GetResourceState('vms_notify') ~= 'missing' then
            exports["vms_notify"]:Notification("CLOTHES STORE", message, time, "#27FF09", "fa-solid fa-shirt")
        else
            TriggerEvent('esx:showNotification', message)
            TriggerEvent('QBCore:Notify', message, 'success', time)
        end
    elseif type == "error" then
        if GetResourceState('vms_notify') ~= 'missing' then
            exports["vms_notify"]:Notification("CLOTHES STORE", message, time, "#FF0909", "fa-solid fa-shirt")
        else
            TriggerEvent('esx:showNotification', message)
            TriggerEvent('QBCore:Notify', message, 'error', time)
        end
    end
end

Config.Hud = {
    Enable = function()
        if GetResourceState('vms_hud') ~= 'missing' then
            exports['vms_hud']:Display(true)
        end
    end,
    Disable = function()
        if GetResourceState('vms_hud') ~= 'missing' then
            exports['vms_hud']:Display(false)
        end
    end
}

Config.Interact = {
    Enabled = false,
    Open = function()
        -- exports["interact"]:Open("E", Config.Translate['press_to_open']) -- Here you can use your TextUI or use my free one - https://github.com/vames-dev/interact
        -- exports['okokTextUI']:Open('[E] '..Config.Translate['press_to_open'], 'darkgreen', 'right')
        -- exports['qb-core']:DrawText(Config.Translate['press_to_open'], 'right')
    end,
    Close = function()
        -- exports["interact"]:Close() -- Here you can use your TextUI or use my free one - https://github.com/vames-dev/interact
        -- exports['okokTextUI']:Close()
        -- exports['qb-core']:HideText()
    end
}

---@class UseTarget<boolean> Do you want to use target system
Config.UseTarget = false
Config.TargetResource = 'ox_target'
Config.Target = function(data, cb)
    if Config.TargetResource == 'ox_target' then
        return exports[Config.TargetResource]:addBoxZone({
            coords = vec(data.coords.x, data.coords.y, data.coords.z),
            size = vec(data.targetSize.x, data.targetSize.y, data.targetSize.z),
            debug = false,
            useZ = true,
            rotation = data.targetRotation,
            options = {
                {
                    distance = 2.0,
                    name = 'clothestore',
                    icon = "fa-solid fa-shirt",
                    label = Config.Translate["target.clothestore"],
                    onSelect = function()
                        cb()
                    end
                }
            }
        })
    else
        print('You need to prepare Config.Target for the target system')
    end
end

Config.UseCustomQuestionMenu = true -- if you want to use for example vms_notify Question Menu, set it true, if you want to use default menu from Config.Menu set it false
Config.CustomQuestionMenu = function(requesterId, outfitName, outfitTable)
    if GetResourceState('vms_notifyv2') == 'started' then
        local question = exports['vms_notifyv2']:Question({
            title = Config.Translate["share_outfit_title"],
            description = Config.PriceForAcceptOutfit and Config.PriceForAcceptOutfit >= 1 and (Config.Translate['share_outfit_description']):format(outfitName, Config.PriceForAcceptOutfit) or (Config.Translate['share_outfit_description_free']):format(outfitName),
            color = "#8cfa64",
            icon = "fa-solid fa-shirt",
        }, {
            {
                displayKey = "Y",
                description = "Accept",
                control = 246
            },
            {
                displayKey = "N",
                description = "Reject",
                control = 306
            }
        })
        Citizen.Await(question)
        if question == "246" then
            TriggerServerEvent("vms_clothestore:acceptOutfit", requesterId, outfitName, outfitTable)
        end
    else
        local question = exports['vms_notify']:Question(
            Config.Translate["share_outfit_title"], 
            Config.PriceForAcceptOutfit and Config.PriceForAcceptOutfit >= 1 and (Config.Translate['share_outfit_description']):format(outfitName, Config.PriceForAcceptOutfit) or (Config.Translate['share_outfit_description_free']):format(outfitName),
            '#8cfa64', 
            'fa-solid fa-shirt'
        )
        Citizen.Await(question)
        if question == 'y' then -- vms_notify question export return 'y' when player accept and 'n' when player reject
            TriggerServerEvent("vms_clothestore:acceptOutfit", requesterId, outfitName, outfitTable)
        end
    end
    
end

Config.GetClosestPlayersFunction = function()
    local playerInArea = Config.Core == "ESX" and ESX.Game.GetPlayersInArea(GetEntityCoords(PlayerPedId()), 10.0) or QBCore.Functions.GetPlayersFromCoords(GetEntityCoords(PlayerPedId()), 10.0)
    return playerInArea
end



-- ███████╗██╗  ██╗██╗███╗   ██╗███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗ 
-- ██╔════╝██║ ██╔╝██║████╗  ██║████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
-- ███████╗█████╔╝ ██║██╔██╗ ██║██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
-- ╚════██║██╔═██╗ ██║██║╚██╗██║██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
-- ███████║██║  ██╗██║██║ ╚████║██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
-- ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
local skinmanagerAutoFind = function()
    local skinmanagersList = {
        'fivem-appearance', 
        'illenium-appearance', 
        'esx_skin', 
        'qb-clothing', 
    }
    
    for _, skinmanagerName in ipairs(skinmanagersList) do
        if GetResourceState(skinmanagerName) == 'started' then
            return skinmanagerName
        end
    end

    return nil
end
---@class SkinManager string: "esx_skin", "fivem-appearance", "illenium-appearance", "qb-clothing"
Config.SkinManager = skinmanagerAutoFind()



-- ███╗   ███╗ █████╗ ██╗███╗   ██╗    ███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗
-- ████╗ ████║██╔══██╗██║████╗  ██║    ██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝
-- ██╔████╔██║███████║██║██╔██╗ ██║    ███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗
-- ██║╚██╔╝██║██╔══██║██║██║╚██╗██║    ╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║
-- ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║    ███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║
-- ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
---@class KeyOpen<number> https://docs.fivem.net/docs/game-references/controls/
Config.KeyOpen = 38 -- [E]

---@class UseQSInventory<boolean> if you use qs-inventory and clothing options
Config.UseQSInventory = true
Config.QSInventoryName = 'qs-inventory'

---@class ChangeClothes<boolean> Menu for choosing whether to buy new clothes or change into your clothes
Config.ChangeClothes = true

---@class DataStoreName<string> Name of the data store where clothes will be saved on ESX
Config.DataStoreName = "property"

---@class ShareOutfit<boolean> Gives the ability to share a saved outfit with another player
Config.ShareOutfit = true

---@class PriceForAcceptOutfit<number> The price at which a player can accept an outfit
Config.PriceForAcceptOutfit = 0

---@class ManageClothes<boolean>
Config.ManageClothes = true

---@class SaveClothesMenu<boolean>
Config.SaveClothesMenu = true

local menuAutoFind = function()
    local menusList = {
        'esx_context',
        'esx_menu_default',
        'qb-menu',
        'ox_lib',
    }
    
    for _, menuName in ipairs(menusList) do
        if GetResourceState(menuName) == 'started' then
            return menuName
        end
    end

    return nil
end
Config.Menu = menuAutoFind()
Config.ESXMenuDefault_Align = 'right' -- works only for esx_menu_default
Config.ESXContext_Align = 'right' -- works only for ESX_Context


Config.SoundsEffects = true -- if you want to sound effects by clicks set true
Config.BlurBehindPlayer = true -- to see it you need to have PostFX upper Very High or Ultra

Config.EnableHandsUpButtonUI = true -- Is there to be a button to raise hands on the UI
Config.HandsUpKey = 'x' -- Key JS (key.code) - https://www.toptal.com/developers/keycode
Config.HandsUpAnimation = {'missminuteman_1ig_2', 'handsup_enter', 50}

Config.ClothingPedAnimation = {"missclothing", "idle_storeclerk"} -- animation of the player during character creation

Config.DefaultCamDistance = 0.95 -- camera distance from player location (during character creation)
Config.CameraHeight = {
    ['masks'] = {z_height = 0.65, fov = 25.0},
    ['hats'] = {z_height = 0.65, fov = 25.0},
    ['torsos'] = {z_height = 0.175, fov = 68.0},
    ['bproofs'] = {z_height = 0.175, fov = 68.0},
    ['pants'] = {z_height = -0.425, fov = 75.0},
    ['shoes'] = {z_height = -0.75, fov = 75.0},
    ['chains'] = {z_height = 0.35, fov = 35.0},
    ['glasses'] = {z_height = 0.65, fov = 25.0},
    ['watches'] = {z_height = -0.025, fov = 45.0},
    ['ears'] = {z_height = 0.65, fov = 30.0},
    ['bags'] = {z_height = 0.15, fov = 75.0},
}

Config.CameraSettings = {
    startingFov = 25.0,
    maxCameraFov = 120.0,
    minCameraFov = 10.0,
    maxCameraHeight = 2.5,
    minCameraHeight = -0.85
}

Config.Translate = {
    ['share_outfit_to_player'] = {name = 'Partager la tenue - %s', icon = ''},
    ['share_outfit_to_player_id'] = 'Joueur [%s]',
    ['share_outfit_title'] = 'Partage de tenue',
    ['share_outfit_description_free'] = 'Voulez-vous accepter la tenue - %s',
    ['share_outfit_description'] = 'Voulez-vous acheter la tenue - %s pour %s$',
    ['received_outfit'] = 'Vous avez reçu la tenue - %s',
    ['sent_outfit'] = 'Vous avez envoyé la tenue - %s',
    ['no_players_around'] = 'Aucun joueur à proximité',

    ['title_share_free'] = {name = 'Voulez-vous accepter la tenue %s ?', icon = 'fas fa-shirt'},
    ['title_share'] = {name = 'Voulez-vous acheter la tenue %s pour %s$ ?', icon = 'fas fa-shirt'},
    ['share_accept'] = {name = 'Oui', icon = 'fas fa-check'},
    ['share_reject'] = {name = 'Non', icon = 'fas fa-xmark'},

    ['blip.clothesstore'] = 'Magasin de vêtements',
    ['blip.maskstore'] = 'Magasin de masques',
    
    ['target.clothestore'] = 'Magasin de vêtements',
    ['press_to_open'] = 'Appuyez sur ~INPUT_CONTEXT~ pour ouvrir',

    ['you_paid'] = 'Vous avez payé %s$ pour la tenue',
    ['saved_clothes'] = 'Vous avez enregistré la tenue sous le nom %s',
    ['removed_clothes'] = 'La tenue a été supprimée de votre garde-robe.',
    ['enought_money'] = 'Vous n’avez pas assez d’argent',

    ['name_is_too_short'] = 'Le nom de la tenue est trop court',

    ['select_option'] = {name = 'Sélectionner une option', icon = 'fas fa-check-double'},
    ['manage_header'] = {name = 'Gérer les tenues', icon = 'fas fa-tshirt'}, 
    ['share_header'] = {name = 'Partager une tenue', icon = 'fas fa-share'}, 
    ['wardrobe_header'] = {name = 'Garde-robe', icon = 'fas fa-tshirt'},

    ['open_wardrobe'] = {name = 'Ouvrir la garde-robe', icon = 'fas fa-shirt'},
    ['open_manage'] = {name = 'Gérer les tenues', icon = 'fas fa-shirt'},
    ['open_share'] = {name = 'Partager une tenue', icon = 'fas fa-share'},
    ['open_store'] = {name = 'Ouvrir le magasin', icon = 'fas fa-bag-shopping'},
    
    ['menu:header'] = {name = 'Voulez-vous sauvegarder cette tenue ?', icon = 'fas fa-check-double'},
    ['menu:yes'] = {name = 'Oui', icon = 'fas fa-check-circle'},
    ['menu:no'] = {name = 'Non', icon = 'fas fa-window-close'},
    
    ['title_remove'] = {name = 'Voulez-vous supprimer %s ?', icon = 'fas fa-shirt'},
    ['remove_yes'] = {name = 'Oui', icon = 'fas fa-check'},
    ['remove_no'] = {name = 'Non', icon = 'fas fa-xmark'},

    ['esx_menu_default:header'] = 'Nommez votre tenue',
    ['esx_context:title'] = {name = 'Entrez le nom de la tenue', icon = 'fas fa-shirt'},
    ['esx_context:placeholder_title'] = 'Nom de la tenue',
    ['esx_context:placeholder'] = 'Nom de la tenue dans la garde-robe…',
    ['esx_context:confirm'] = {name = 'Confirmer', icon = 'fas fa-check-circle'},

    ['qb-input:header'] = 'Nommez votre tenue',
    ['qb-input:submitText'] = 'Sauvegarder la tenue',
    ['qb-input:text'] = 'Nom de la tenue',
}


Config.Stores = {
    [1] = {
        coords = vector3(-2673.79, -753.70, 5.10),
        targetRotation = 85.0,
        targetSize = vec(2.15, 2.15, 2.15),
        blip = {
            sprite = 73,
            display = 4,
            scale = 0.95,
            color = 55,
            name = Config.Translate['blip.maskstore'],
        },
        marker = {
            id = 23,
            size = vec(1.85, 1.85, 0.95),
            color = {255, 205, 0, 125},
            rotate = false,
            bobUpAndDown = false
        },
        categories = {
            ['masks'] = true,
            ['hats'] = true,
            ['torsos'] = true,
            ['bproofs'] = true,
            ['pants'] = true,
            ['shoes'] = true,
            ['chains'] = true,
            ['glasses'] = true,
            ['watches'] = true,
            ['ears'] = true,
            ['bags'] = true,
        },
        -- @blockedClothes:
        --  For the clothing blockage to work correctly in the table, there must be at least two values. Only one value, for example {10}, cannot exist.
        --  To block only one value, you need to set the second value as a number that does not exist, for example {10, 100000}.
        blockedClothes = {
            ['male'] = {
                -- ['mask_1'] = {46, 100000},
            },
            ['female'] = {
                -- ['mask_1'] = {46, 100000},
            },
        }
    }
}