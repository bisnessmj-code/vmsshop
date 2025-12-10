if Config.Core == "ESX" then
    ESX = Config.CoreExport()

    ESX.RegisterServerCallback('vms_clothestore:payForClothes', function(source, cb, price, type)
        local xPlayer = ESX.GetPlayerFromId(source)
        local myMoney = type == "cash" and xPlayer.getMoney() or xPlayer.getAccount('bank').money
        local price = tonumber(price)
        if myMoney >= price then
            if type == "cash" then
                xPlayer.removeMoney(price)
            else
                xPlayer.removeAccountMoney('bank', price)
            end
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["you_paid"]:format(price), 5000, 'success')
            cb(true)
            return
        end
        TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["enought_money"], 5000, 'error')
        cb(false)
    end)

    ESX.RegisterServerCallback('vms_clothestore:checkPropertyDataStore', function(source, cb)
        local xPlayer = ESX.GetPlayerFromId(source)
        local foundStore = false
        if Config.SkinManager == "esx_skin" then
            TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
                foundStore = true
            end)
        else
            foundStore = true
        end
        if not foundStore then
            print(("^1[WARNING] ^7The ^3'%s' ^7value you specified in Config.DataStoreName is not configured correctly."):format(Config.DataStoreName))
        end
        cb(foundStore)
    end)

    ESX.RegisterServerCallback('vms_clothestore:getPlayerDressing', function(source, cb)
        local xPlayer = ESX.GetPlayerFromId(source)
        if Config.SkinManager == "esx_skin" then
            TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
                local count = store.count('dressing')
                local outfits = {}
                for i = 1, count, 1 do
                    local entry = store.get('dressing', i)
                    outfits[#outfits + 1] = {label = entry.label, skin = entry.skin}
                end
                cb(outfits)
            end)
        elseif Config.SkinManager == "fivem-appearance" then
            local outfits = {}
            local result = MySQL.query.await('SELECT * FROM outfits WHERE identifier = ?', {xPlayer.identifier})
	        if result then
	        	for i=1, #result, 1 do
	        		outfits[#outfits + 1] = {
	        			id = result[i].id,
	        			name = result[i].name,
	        			ped = json.decode(result[i].ped),
	        			components = json.decode(result[i].components),
	        			props = json.decode(result[i].props)
	        		}
	        	end
	        	cb(outfits)
            end
        elseif Config.SkinManager == "illenium-appearance" then
            local outfits = {}
            local result = MySQL.query.await('SELECT * FROM player_outfits WHERE citizenid = ?', {xPlayer.identifier})
	        if result then
	        	for i=1, #result, 1 do
	        		outfits[#outfits + 1] = {
	        			id = result[i].id,
	        			outfitname = result[i].outfitname,
	        			model = json.decode(result[i].model),
	        			components = json.decode(result[i].components),
	        			props = json.decode(result[i].props)
	        		}
	        	end
	        	cb(outfits)
            end
        end
    end)

    ESX.RegisterServerCallback('vms_clothestore:getPlayerOutfit', function(source, cb, num)
        local xPlayer = ESX.GetPlayerFromId(source)
        TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
            local outfit = store.get('dressing', num)
            cb(outfit.skin)
        end)
    end)

    RegisterServerEvent('vms_clothestore:saveOutfit')
    AddEventHandler('vms_clothestore:saveOutfit', function(label, skin)
    	local xPlayer = ESX.GetPlayerFromId(source)
    	TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
    		local dressing = store.get('dressing')
    		if dressing == nil then
    			dressing = {}
    		end
            dressing[#dressing + 1] = {label = label, skin  = skin}
    		store.set('dressing', dressing)
    		store.save()
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["saved_clothes"]:format(label), 5000, 'success')
        end)
    end)
    
    RegisterServerEvent('vms_clothestore:removeClothe')
    AddEventHandler('vms_clothestore:removeClothe', function(id)
	    local xPlayer = ESX.GetPlayerFromId(source)
        if Config.SkinManager == 'esx_skin' then
	        TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
	    	    local dressing = store.get('dressing') or {}
                for k, v in pairs(dressing) do
                    if v.label == id then
                        table.remove(dressing, k)
                    end
                end
	    	    store.set('dressing', dressing)
                TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["removed_clothes"], 5000, 'success')
            end)
        elseif Config.SkinManager == 'fivem-appearance' then
            MySQL.update('DELETE FROM outfits WHERE name = ? AND identifier = ?', {id, xPlayer.identifier})
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["removed_clothes"], 5000, 'success')
        elseif Config.SkinManager == "illenium-appearance" then
            MySQL.update('DELETE FROM player_outfits WHERE outfitname = ? AND citizenid = ?', {id, xPlayer.identifier})
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["removed_clothes"], 5000, 'success')
        end
    end)
elseif Config.Core == "QB-Core" then
    QBCore = Config.CoreExport()

    QBCore.Functions.CreateCallback('vms_clothestore:payForClothes', function(source, cb, price, type)
        local Player = QBCore.Functions.GetPlayer(source)
        local myMoney = type == "cash" and Player.Functions.GetMoney('cash') or Player.Functions.GetMoney('bank')
        local price = tonumber(price)
        if myMoney >= price then
            if type == "cash" then
                Player.Functions.RemoveMoney('cash', price, "Clothes")
            else
                Player.Functions.RemoveMoney('bank', price, "Clothes")
            end
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["you_paid"]:format(price), 5000, 'success')
            cb(true)
            return
        end
        TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["enought_money"], 5000, 'error')
        cb(false)
    end)
    
    QBCore.Functions.CreateCallback('vms_clothestore:getPlayerDressing', function(source, cb, price)
        if Config.SkinManager == "illenium-appearance" then
            local Player = QBCore.Functions.GetPlayer(source)
            local outfits = {}
            local result = MySQL.query.await('SELECT * FROM player_outfits WHERE citizenid = ?', {Player.PlayerData.citizenid})
	        if result then
	        	for i=1, #result, 1 do
	        		outfits[#outfits + 1] = {
	        			id = result[i].id,
	        			outfitname = result[i].outfitname,
	        			model = result[i].model,
	        			components = json.decode(result[i].components),
	        			props = json.decode(result[i].props)
	        		}
	        	end
	        	cb(outfits)
            end
        end
    end)

    QBCore.Functions.CreateCallback('vms_clothestore:getCurrentSkin', function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local result = MySQL.query.await('SELECT * FROM playerskins WHERE citizenid = ? AND active = ?', {Player.PlayerData.citizenid, 1})
        if result[1] then
            cb(result[1].skin)
        end
    end)

    RegisterServerEvent('vms_clothestore:removeClothe')
    AddEventHandler('vms_clothestore:removeClothe', function(id)
        local Player = QBCore.Functions.GetPlayer(source)
        if Config.SkinManager == "qb-clothing" then
            MySQL.update('DELETE FROM player_outfits WHERE outfitId = ? AND citizenid = ?', {id, Player.PlayerData.citizenid})
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["removed_clothes"], 5000, 'success')
        elseif Config.SkinManager == "illenium-appearance" then
            MySQL.update('DELETE FROM player_outfits WHERE id = ? AND citizenid = ?', {id, Player.PlayerData.citizenid})
            TriggerClientEvent('vms_clothestore:notification', source, Config.Translate["removed_clothes"], 5000, 'success')
        end
    end)
end

RegisterServerEvent('vms_clothestore:sendOutfit')
AddEventHandler('vms_clothestore:sendOutfit', function(playerId, outfitTable)
    local src = source
    TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["sent_outfit"]:format(outfitTable.label), 5000, 'success')
    TriggerClientEvent('vms_clothestore:receiveRequestOutfit', playerId, src, outfitTable)
end)

RegisterServerEvent('vms_clothestore:acceptOutfit')
AddEventHandler('vms_clothestore:acceptOutfit', function(requesterId, outfitName, outfitTable)
    local src = source
    local xPlayer = Config.Core == "ESX" and ESX.GetPlayerFromId(src) or QBCore.Functions.GetPlayer(src)
    if Config.Core == "ESX" then
        if Config.PriceForAcceptOutfit and Config.PriceForAcceptOutfit > 0 then
            local myMoney = xPlayer.getMoney()
            if myMoney >= Config.PriceForAcceptOutfit then
                xPlayer.removeMoney(Config.PriceForAcceptOutfit)
            else
                TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["enought_money"], 5000, 'error')
                return 
            end
        end
        if Config.SkinManager == "esx_skin" then
            TriggerEvent('esx_datastore:getDataStore', Config.DataStoreName, xPlayer.identifier, function(store)
                local dressing = store.get('dressing')
                if dressing == nil then
                    dressing = {}
                end
                dressing[#dressing + 1] = {label = outfitTable.label, skin  = outfitTable.skin}
                store.set('dressing', dressing)
                store.save()
                TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["received_outfit"]:format(outfitTable.label), 5000, 'success')
            end)
        elseif Config.SkinManager == "fivem-appearance" then
            MySQL.Async.insert('INSERT INTO outfits (identifier, name, ped, props, components) VALUES (@identifier, @name, @ped, @props, @components)', {
                ["@identifier"] = xPlayer.identifier,
                ["@name"] = outfitTable.label,
                ["@ped"] = outfitTable.ped,
                ["@props"] = json.encode(outfitTable.props),
                ["@components"] = json.encode(outfitTable.components),
            }, function(rowsChanged)
                if rowsChanged then
                    TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["received_outfit"]:format(outfitTable.label), 5000, 'success')
                end
            end)
        elseif Config.SkinManager == "illenium-appearance" then
            MySQL.Async.insert('INSERT INTO player_outfits (citizenid, outfitname, model, props, components) VALUES (@citizenid, @outfitname, @model, @props, @components)', {
                ["@citizenid"] = xPlayer.identifier,
                ["@outfitname"] = outfitTable.label,
                ["@model"] = outfitTable.model,
                ["@props"] = json.encode(outfitTable.props),
                ["@components"] = json.encode(outfitTable.components),
            }, function(rowsChanged)
                if rowsChanged then
                    TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["received_outfit"]:format(outfitTable.label), 5000, 'success')
                end
            end)
        end
    elseif Config.Core == "QB-Core" then
        if Config.PriceForAcceptOutfit and Config.PriceForAcceptOutfit > 0 then
            local myMoney = xPlayer.Functions.GetMoney('cash')
            if myMoney >= Config.PriceForAcceptOutfit then
                xPlayer.Functions.RemoveMoney('cash', Config.PriceForAcceptOutfit)
            else
                TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["enought_money"], 5000, 'error')
                return 
            end
        end
        if Config.SkinManager == "qb-clothing" then
            MySQL.Async.insert('INSERT INTO player_outfits (citizenid, outfitname, model, skin, outfitId) VALUES (@citizenid, @outfitname, @model, @skin, @outfitId)', {
                ["@citizenid"] = xPlayer.PlayerData.citizenid,
                ["@outfitname"] = outfitTable.label,
                ["@model"] = outfitTable.model,
                ["@skin"] = json.encode(outfitTable.skin),
                ["@outfitId"] = outfitTable.outfitId,
            }, function(rowsChanged)
                if rowsChanged then
                    TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["received_outfit"]:format(outfitTable.label), 5000, 'success')
                end
            end)
        elseif Config.SkinManager == "fivem-appearance" or Config.SkinManager == "illenium-appearance" then
            MySQL.Async.insert('INSERT INTO player_outfits (citizenid, outfitname, model, props, components) VALUES (@citizenid, @outfitname, @model, @props, @components)', {
                ["@citizenid"] = xPlayer.PlayerData.citizenid,
                ["@outfitname"] = outfitTable.label,
                ["@model"] = outfitTable.model,
                ["@props"] = json.encode(outfitTable.props),
                ["@components"] = json.encode(outfitTable.components),
            }, function(rowsChanged)
                if rowsChanged then
                    TriggerClientEvent('vms_clothestore:notification', src, Config.Translate["received_outfit"]:format(outfitTable.label), 5000, 'success')
                end
            end)
        end
    end
end)