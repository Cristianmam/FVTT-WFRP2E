import {WHCharacter} from "../documents/Character.mjs";

import {WHCharacterSheet} from "../sheets/Character.mjs";

//Check associated file for details on the schema
import {CharacterDataModel} from "../data/Character.mjs";

Hooks.once("init",function ()
{
    //You hook up the schema with their doctypes here, declare docks on system.json
    Object.assign(CONFIG.Actor.dataModels,
    {
        //These badboys throw errors because of place holder fields tagged as required in the schema. The schema should be adapted to what we need
        character:CharacterDataModel
    });
    //We can hookup custom classes to our documents like so
    Object.assign(CONFIG.Actor.documentClass,
    {
        character:WHCharacter
    });
    //We can register sheets for our items/actors like so
    Actors.registerSheet('character',WHCharacterSheet,
    {
        types:["character"],
        makeDefault: true,
        label:"Character Sheet"
    });
});
