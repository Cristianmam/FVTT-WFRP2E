import {WHCharacter} from "../documents/Character.mjs";

import {WHCharacterSheet} from "../sheets/Character.mjs";

import {CharacterDataModel} from "../data/Character.mjs";

Hooks.once("init",function ()
{
    Object.assign(CONFIG.Actor.dataModels,
    {
        character:CharacterDataModel
    });

    console.log("Trying to register sheet");
    Actors.registerSheet('character',WHCharacterSheet,
    {
        types:["character"],
        makeDefault: true,
        label:"Character Sheet"
    });
});

//CONFIG.Actor.character.documentClass = WHCharacter;