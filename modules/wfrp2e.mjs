import {WHCharacter} from "../documents/Character.mjs";
import {WHCharacterSheet} from "../sheets/Character.mjs";
import {CharacterDataModel} from "../data/Character.mjs";
import {CareerDataModel} from "../data/Career.mjs";
import {WHCareerSheet} from "../sheets/Career.mjs";

Hooks.once("init", function () {
    console.log("wfrp2e | Initializing system");
    
    // Register data models
    CONFIG.Actor.dataModels.character = CharacterDataModel;
    CONFIG.Item.dataModels.career = CareerDataModel;
    
    // Register custom Actor document class
    CONFIG.Actor.documentClass = WHCharacter;
    
    // Register the character sheet
    Actors.registerSheet('fvtt-wfrp2e', WHCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "wfrp2e Character Sheet"
    });
    
    // Register the career item sheet
    Items.registerSheet('fvtt-wfrp2e', WHCareerSheet, {
        types: ["career"],
        makeDefault: true,
        label: "wfrp2e Career"
    });

    console.log("wfrp2e | System initialized");
    console.log("wfrp2e | Actor class:", CONFIG.Actor.documentClass.name);
    console.log("wfrp2e | Data Models:", CONFIG.Actor.dataModels, CONFIG.Item.dataModels);
});