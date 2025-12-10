-- @DefaultPrice: Default price of products when not available in PricesForComponent and PricesForIds.
Config.DefaultPrice = 0

-- @PricesForComponent: Product price of the category.
Config.PricesForComponent = {
    ['helmet_1'] = 0,
    ['helmet_2'] = 0,
    ['mask_1'] = 0,
    ['mask_2'] = 0,
    ['tshirt_1'] = 0,
    ['tshirt_2'] = 0,
    ['torso_1'] = 0,
    ['torso_2'] = 0,
    ['arms'] = 0,
    ['arms_2'] = 0,
    ['decals_1'] = 0,
    ['decals_2'] = 0,
    ['bproof_1'] = 0,
    ['bproof_2'] = 0,
    ['pants_1'] = 0,
    ['pants_2'] = 0,
    ['shoes_1'] = 0,
    ['shoes_2'] = 0,
    ['chain_1'] = 0,
    ['chain_2'] = 0,
    ['glasses_1'] = 0,
    ['glasses_2'] = 0,
    ['watches_1'] = 0,
    ['watches_2'] = 0,
    ['bracelets_1'] = 0,
    ['bracelets_2'] = 0,
    ['ears_1'] = 0,
    ['ears_2'] = 0,
    ['bags_1'] = 0,
    ['bags_2'] = 0,
}

-- @PricesForIds: Product price for a specific ID from the clothing category.
Config.PricesForIds = {
    male = {
        ['helmet_1'] = {
            ['-1'] = 0,
            ['25'] = 0,
        },
        ['mask_1'] = {
            ['0'] = 0,
    
        },
        ['tshirt_1'] = {
            ['15'] = 0,
    
        },
        ['torso_1'] = {
            ['15'] = 0,
            ['12'] = 0,
            ['32'] = 0,
        },
        ['arms'] = {
            ['15'] = 0,
    
        },
        ['decals_1'] = {
            ['0'] = 0,
    
        },
        ['bproof_1'] = {
            ['0'] = 0,
    
        },
        ['pants_1'] = {
            ['14'] = 0,
    
        },
        ['shoes_1'] = {
            ['34'] = 0,
    
        },
        ['chain_1'] = {
            ['0'] = 0,
    
        },
        ['glasses_1'] = {
            ['0'] = 0,
    
        },
        ['watches_1'] = {
            ['0'] = 0,
    
        },
        ['bracelets_1'] = {
            ['0'] = 0,
    
        },
        ['ears_1'] = {
            ['0'] = 0,
    
        },
        ['bags_1'] = {
            ['0'] = 0,
    
        },
    },
    female = {
        ['helmet_1'] = {
            ['-1'] = 0,
            ['25'] = 0,
        },
        ['mask_1'] = {
            ['0'] = 0,
    
        },
        ['tshirt_1'] = {
            ['2'] = 0,
            ['3'] = 0,
            ['6'] = 0,
            ['7'] = 0,
            ['8'] = 0,
            ['9'] = 0,
            ['10'] = 0,
            ['14'] = 0,
    
        },
        ['torso_1'] = {
            ['82'] = 0,
            ['12'] = 0,
            ['32'] = 0,
        },
        ['arms'] = {
            ['15'] = 0,
    
        },
        ['decals_1'] = {
            ['0'] = 0,
    
        },
        ['bproof_1'] = {
            ['0'] = 0,
    
        },
        ['pants_1'] = {
            ['15'] = 0,
    
        },
        ['shoes_1'] = {
            ['35'] = 0,
    
        },
        ['chain_1'] = {
            ['0'] = 0,
    
        },
        ['glasses_1'] = {
            ['0'] = 0,
    
        },
        ['watches_1'] = {
            ['0'] = 0,
    
        },
        ['bracelets_1'] = {
            ['0'] = 0,
    
        },
        ['ears_1'] = {
            ['0'] = 0,
    
        },
        ['bags_1'] = {
            ['0'] = 0,
    
        },
    }
}


-- @PricesForComponentSpecificStores: Product price of the category for specific stores.
Config.PricesForComponentSpecificStores = {
    [1] = { -- For store ID: 1 (Config.Stores)
        male = {
            ['mask_1'] = 0,
            ['mask_2'] = 0,
        },
        female = {
            ['mask_1'] = 0,
            ['mask_2'] = 0,
        }
    },
    -- [2] = { -- For store ID: 2 (Config.Stores)
    --     ['torso_1'] = 200
    -- },
}

-- @PricesForIdsSpecificStores: Product price for a specific ID from the clothing category for specific stores.
Config.PricesForIdsSpecificStores = {
    [1] = { -- For store ID: 1 (Config.Stores)
        male = {
            ['mask_1'] = {
                ['3'] = 0,
                ['5'] = 0,
            },
        },
        female = {
            ['mask_1'] = {
                ['3'] = 0,
                ['5'] = 0,
            },
        }
    },
    -- [2] = { -- For store ID: 2 (Config.Stores)
    --     male = {
    --         ['torso_1'] = {
    --             ['80'] = 50,
    --             ['167'] = 300,
    --             ['293'] = 500,
    --         },
    --     },
    --     female = {
    --         ['pants_1'] = {
    --             ['55'] = 30,
    --             ['116'] = 450,
    --         },
    --     }
    -- },
}