import {wfrp2e} from "./module/config.js";
import WFRP2EItemSheet from "./module/sheets/WFRP2EItemSheet.js";
import WFRP2EActorSheet from "./module/sheets/WFRP2EActorSheet.js";
//import HelperFunctions from "./modules.helper-functions.js";

async function preloadHandlebarsTemplates(){
    const templatePaths = [
        "systems/wfrp2e/templates/actors/parts/actor-background.html",
        "systems/wfrp2e/templates/actors/parts/actor-primarystatblock.html",
        "systems/wfrp2e/templates/actors/parts/actor-secondarystatblock.html",
        "systems/wfrp2e/templates/actors/parts/actor-skills.html",
        "systems/wfrp2e/templates/actors/parts/actor-skillrow.html",
        
        "systems/wfrp2e/templates/actors/parts/actor-inventory.html",
        "systems/wfrp2e/templates/actors/parts/actor-weapons.html",
        "systems/wfrp2e/templates/actors/parts/actor-weapon-row.html",
        "systems/wfrp2e/templates/actors/parts/actor-ranged-weapon-row.html",
        "systems/wfrp2e/templates/actors/parts/actor-inventory-itemrow.html",
                
        "systems/wfrp2e/templates/items/parts/item-header.html",
        "systems/wfrp2e/templates/items/parts/item-weaponprofile.html",
        "systems/wfrp2e/templates/items/parts/item-armorprofile.html"
    ];

    return loadTemplates(templatePaths);
}

Hooks.once('init', function() {
    console.log("wfrp2e | Initializing Warhammer Fantasy 2e");

    CONFIG.wfrp2e = wfrp2e;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("wfrp2e", WFRP2EItemSheet, {makeDefault: true});
    console.log("wfrp2e | Loaded item sheet");

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("wfrp2e", WFRP2EActorSheet, {makeDefault: true});
    console.log("wfrp2e | Loaded actor sheet");

    preloadHandlebarsTemplates();
    console.log("wfrp2e | Loaded handlebar templates");

    Handlebars.registerHelper("renderContainer", function(n,m){
        if(n == m || m == "-2")
            return true;
        else
            return false;
    });
    Handlebars.registerHelper("renderItem", function(n,m){
        if(n == m || m == "-1")
            return true;
        else
            return false;
    });
    Handlebars.registerHelper("containedHere", function(n,m){
        if(n == m)
            return true;
        else
            return false;
    });
    Handlebars.registerHelper("compareString", function(n,m){
        if(n == m)
            return true;
        else
            return false;
    });
    Handlebars.registerHelper("numEquals", function(n,m){
        if(n == m)
            return true;
        else
            return false;
    });
});