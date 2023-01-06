import {wfrp2e} from "../config.js"

export default class WFRP2EActorSheet extends ActorSheet {

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            height: 900,
            width: 800,
            classes: ["wfrp2e","sheet","actor"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "corestats"}]
        })   
    }

    get template() {
        return `systems/wfrp2e/templates/actors/sheets/${this.actor.type}-sheet.html`;     
    }

    getData() {
        const baseData = super.getData();

        let sheetData ={
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            data: baseData.actor.system,
            config: CONFIG.wfrp2e
        };

        this._statsInit(sheetData);

        this._itemsInit(sheetData);
     
        console.log("wfrp2e | Data ready for " + this.actor.name);

        return sheetData;
    }

    skillContextMenu = [
        {
            name: game.i18n.localize("wfrp2e.characters.ui.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("wfrp2e.characters.ui.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item",[element.data("item-id")]);
            }
        }
    ]

    itemContextMenu = [
        {
            name: game.i18n.localize("wfrp2e.characters.ui.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("wfrp2e.characters.ui.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item",[element.data("item-id")]);
            }
        }
    ]

    containerContextMenu = [
        {
            name: game.i18n.localize("wfrp2e.characters.ui.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("container-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("wfrp2e.characters.ui.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this._deleteContainer(element.data("container-id"));
            }
        }
    ]

    weaponContextMenu = [
        {
            name: game.i18n.localize("wfrp2e.characters.ui.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("wfrp2e.characters.ui.inventoryUnEquip"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this._onWeaponRemoveFromWeapons(element.data("weapon"));
            }
        }
    ]
    

    activateListeners(html){
        //Bindgins
        //General
        html.find(".item-create").click(this._onItemCreate.bind(this));
        //Inventory
        html.find(".select-item-container").change(this._onContainerChanged.bind(this));
        html.find(".inventory-item-quantity").change(this._onItemQuantityChange.bind(this));
        html.find(".inventory-container-carried").change(this._onContainerChangedCarried.bind(this));
        html.find(".inventory-consumable-button").click(this._onUseConsumable.bind(this));
        html.find(".inventory-equip-weapon").click(this._onWeaponEquip.bind(this));
        html.find(".inventory-unequip-weapon").click(this._onWeaponRemove.bind(this));
        //Weapons
        html.find(".weapon-attack").click(this._onWeaponAttack.bind(this));
        html.find(".weapon-damage").click(this._onWeaponDamage.bind(this));
        html.find(".weapon-parry").click(this._onWeaponParry.bind(this));

        //Context Menus
        //Skills
        new ContextMenu(html, ".skill-card", this.skillContextMenu);
        //Inventory
        new ContextMenu(html, ".inventory-item-card", this.itemContextMenu);
        new ContextMenu(html, ".inventory-container-card", this.containerContextMenu);
        new ContextMenu(html, ".weapon-card", this.weaponContextMenu);

        super.activateListeners(html);
    }

    _statsInit(sD){
        //Primary stats
        let primaryStats = ["ws","bs","str","tou","agi","int","wil","fel"];

        for(let stat of primaryStats){
            sD.data.profile.main[stat].base = (!sD.data.profile.main[stat].base ? 0 : sD.data.profile.main[stat].base);
            sD.data.profile.main[stat].talent = (!sD.data.profile.main[stat].talent ? 0 : sD.data.profile.main[stat].talent);
            sD.data.profile.main[stat].mod = (!sD.data.profile.main[stat].mod ? 0 : sD.data.profile.main[stat].mod);
            sD.data.profile.main[stat].advance = (!sD.data.profile.main[stat].advance ? 0 : sD.data.profile.main[stat].advance);

            sD.data.profile.main[stat].value = parseInt(sD.data.profile.main[stat].base) + 
                                                        parseInt(sD.data.profile.main[stat].talent) + 
                                                        parseInt(sD.data.profile.main[stat].mod) +
                                                        (parseInt(sD.data.profile.main[stat].advance) * 5);
        }

        //Secondary Stats
        let secondaryStats = ["atk","wou","mov","mag","fp"]

        for(let stat of secondaryStats){
            sD.data.profile.secondary[stat].base = (!sD.data.profile.secondary[stat].base ? 0 : sD.data.profile.secondary[stat].base);
            sD.data.profile.secondary[stat].talent = (!sD.data.profile.secondary[stat].talent ? 0 : sD.data.profile.secondary[stat].talent);
            sD.data.profile.secondary[stat].mod = (!sD.data.profile.secondary[stat].mod ? 0 : sD.data.profile.secondary[stat].mod);
            sD.data.profile.secondary[stat].advance = (!sD.data.profile.secondary[stat].advance ? 0 : sD.data.profile.secondary[stat].advance);

            sD.data.profile.secondary[stat].value = parseInt(sD.data.profile.secondary[stat].base) + 
                                                            parseInt(sD.data.profile.secondary[stat].talent) + 
                                                            parseInt(sD.data.profile.secondary[stat].mod) +
                                                            (parseInt(sD.data.profile.secondary[stat].advance) * 1);
        }

        sD.data.profile.secondary.ip.base = (!sD.data.profile.secondary.ip.base ? 0 : sD.data.profile.secondary.ip.base);
        sD.data.profile.secondary.ip.talent = (!sD.data.profile.secondary.ip.talent ? 0 : sD.data.profile.secondary.ip.talent);
        sD.data.profile.secondary.ip.mod = (!sD.data.profile.secondary.ip.mod ? 0 : sD.data.profile.secondary.ip.mod);
        sD.data.profile.secondary.ip.value = parseInt(sD.data.profile.secondary.ip.base) + 
                                                    parseInt(sD.data.profile.secondary.ip.talent) + 
                                                    parseInt(sD.data.profile.secondary.ip.mod);


        sD.data.profile.secondary.sb.talent = (!sD.data.profile.secondary.sb.talent ? 0 : sD.data.profile.secondary.sb.talent);
        sD.data.profile.secondary.tb.talent = (!sD.data.profile.secondary.tb.talent ? 0 : sD.data.profile.secondary.tb.talent);

        sD.data.profile.secondary.sb.base = Math.floor(parseInt(sD.data.profile.main.str.value)/10);
        sD.data.profile.secondary.tb.base = Math.floor(parseInt(sD.data.profile.main.tou.value)/10);

        sD.data.profile.secondary.sb.value = parseInt(sD.data.profile.secondary.sb.base) + 
                                                    parseInt(sD.data.profile.secondary.sb.talent);
        sD.data.profile.secondary.tb.value = parseInt(sD.data.profile.secondary.tb.base) + 
                                                    parseInt(sD.data.profile.secondary.tb.talent);
 
        //Handle skills' presentation
        sD.data.skills = sD.actor.items.filter(function (item) {return item.type == "skill"});
        sD.data.skills.sort(function(a,b){return (a.name.localeCompare(b.name))});

        sD.data.basicSkills = [];
        sD.data.advancedSkills = [];
        sD.data.knowledgeSkills = [];
        sD.data.languageSkills = [];
        sD.data.tradeSkills = [];
        sD.data.otherSkills = [];


        for(let skill of sD.data.skills){
            if(!skill.system.attribute || (
                skill.system.attribute != "ws" &&
                skill.system.attribute != "bs" &&
                skill.system.attribute != "str" &&
                skill.system.attribute != "tou" &&
                skill.system.attribute != "agi" &&
                skill.system.attribute != "int" &&
                skill.system.attribute != "wil" &&
                skill.system.attribute != "fel")){

                skill.system.attribute = "none";
                skill.system.type = "other"
            }

            skill.attribute = game.i18n.localize(wfrp2e.attributes[skill.system.attribute]);
            skill.attributeAbr = game.i18n.localize(wfrp2e.attributesabbreviated[skill.system.attribute]);
 
            if (skill.system.attribute === 'none'){
                skill.system.value = 0;
            }else{
                skill.system.value = parseInt(sD.data.profile.main[skill.system.attribute].value);
                
                if(!skill.system.trained)
                {
                    skill.system.trained = 0;
                }

                skill.system.trainedText = game.i18n.localize(wfrp2e.trainingLevels[skill.system.trained]);
                switch (parseInt(skill.system.trained)){
                    case 0:
                        if(skill.system.type === 'basic'){
                            skill.system.value = Math.floor(skill.system.value/2)
                        }
                        else{
                            skill.system.value = 0;
                        }
                        break;
                    case 2:
                        skill.system.value += 10;
                        break;
                    case 3:
                        skill.system.value += 20;
                        break;
                }

            }
            //Tally up mods here
            skill.system.mod = (!skill.system.mod ? 0 : skill.system.mod);

            skill.system.total = (parseInt(skill.system.value) == 0 ? 0 : parseInt(skill.system.value) + parseInt(skill.system.mod));

            switch (skill.system.type){
                case 'basic':
                    sD.data.basicSkills.push(skill);
                    break;
                case 'advanced':
                    sD.data.advancedSkills.push(skill);
                    break;
                case 'knowledge':
                    sD.data.knowledgeSkills.push(skill);
                    break;
                case 'language':
                    sD.data.languageSkills.push(skill);
                    break;
                case 'trade':
                    sD.data.tradeSkills.push(skill);
                    break;
                case 'other':
                    sD.data.otherSkills.push(skill);
                    break;
                default:
                    sD.data.otherSkills.push(skill);
                    break;
            }
        }
    }

    _itemsInit(sD){
        //Preparing Inventory
        sD.data.baseCarryWeight = sD.data.profile.main.str.value * 10;
        sD.data.maxcarry = (sD.data.baseCarryWeight * sD.data.multmax) + sD.data.modmax;
        

        //Item Handleling
        //Physical items
        sD.data.weapons = sD.actor.items.filter(function (item) {return item.type == "weapon"});
        sD.data.weapons.sort(function(a,b){return (a.name.localeCompare(b.name))});
        sD.data.armors = sD.actor.items.filter(function (item) {return item.type == "armor"});
        sD.data.armors.sort(function(a,b){return (a.name.localeCompare(b.name))});
        sD.data.items = sD.actor.items.filter(function (item) {return item.type == "item"});
        sD.data.items.sort(function(a,b){return (a.name.localeCompare(b.name))});
        sD.data.consumables = sD.actor.items.filter(function (item) {return item.type == "consumable"});
        sD.data.consumables.sort(function(a,b){return (a.name.localeCompare(b.name))});
        sD.data.containers = sD.actor.items.filter(function (item) {return item.type == "container"});
        sD.data.containers.sort(function(a,b){return (a.index < b.index ? -1 : 1)});
        sD.data.tools = sD.actor.items.filter(function (item) {return item.type == "tool"});
        sD.data.tools.sort(function(a,b){return (a.name.localeCompare(b.name))});

        sD.data.allPhysicalItems = sD.data.weapons.concat(sD.data.armors,sD.data.items,sD.data.consumables,sD.data.tools);
        sD.data.allPhysicalItems.sort(function(a,b){return (a.name.localeCompare(b.name))});

        //Container stuff
        sD.data.containerList = [];
        sD.data.containerList[0]=[];

        if(sD.data.containers.length >= 1){
            for (let i = 0;i < sD.data.containers.length; i++){
                let container = sD.data.containers[i];
                container.system.capacity.current = 0;
                if(container.system.index != i + 1){
                    container.system.index = i + 1;
                    this._updateItemData(container);
                }
                sD.data.containerList[container.system.index] = [];
                if(container.id == sD.data.filters.container || sD.data.filters.container == -2){
                    container.system.toberendered = true;
                }else{
                    container.system.toberendered = false;
                }
            }
        }     

        sD.data.currentInv = 0;

        //Setup Consumables
        for(let consumable of sD.data.consumables){
            let update = false;
            if (consumable.system.uses.max == 0){
                consumable.system.uses.max = 1;
                update = true;
            }
            if (consumable.system.uses.value == 0 && consumable.system.quantity == 1){
                consumable.system.uses.value = 0;
                consumable.system.quantity = 0;
                update = true;
            }

            if (update){
                this._updateItemData(consumable);
            }
        }

        //Link items to container
        for(let item of sD.data.allPhysicalItems){
            if(!item.system.heldIn){
                item.system.heldIn = -1;
                this._updateItemData(item);
            }

            if ((item.type == "weapon" || item.type == "armor") && item.system.heldIn != -1){
                if(item.system.equiped){
                    item.system.heldIn = -1;
                    this._updateItemData(item);
                }
            }

            if(item.type == sD.data.filters.itemtype || sD.data.filters.itemtype == -1){
                item.system.toberendered = true;
            }else{
                item.system.toberendered = false;
            }

            if(item.system.heldIn == -1){
                sD.data.containerList[0].push(item);
                sD.data.currentInv += item.system.weight * item.system.quantity;
            }else{
                let containerHolding = sD.data.containers.filter(container => container.id == item.system.heldIn);
                containerHolding[0].system.capacity.current += item.system.weight * item.system.quantity; 
                let containerIndex = containerHolding[0].system.index;
                sD.data.containerList[containerIndex].push(item);
            }
        }

        for (let container of sD.data.containers){
            container.system.capacity.total = container.system.capacity.current * container.system.capacity.weightmult;
            if(container.system.carried){
                sD.data.currentInv += container.system.capacity.total;
            }
        }

        if(sD.data.weighcoins){
            sD.data.currentInv += (bp + ss + gc + misc)/50;
        }

        let curInv = sD.data.currentInv;
        let maxInv = sD.data.maxcarry;
        if(curInv > maxInv){
            sD.data.overMax = true;
            let mod= Math.trunc((curInv - maxInv) / 50);
            sD.data.effectOnMov = mod + 1;
            sD.data.profile.secondary.mov.value -= sD.data.effectOnMov;
        }else{
            sD.data.overMax = false;
        }
        
        //Weapon values
        for(let weapon of sD.data.weapons)
        {
            let toHitStat = weapon.system.attribute.toHit
            if (toHitStat == "none" || toHitStat == ""){
                weapon.system.attribute.toHitValue = 0;
            }else{
                weapon.system.attribute.toHitValue = sD.data.profile.main[toHitStat].value;
            }

            let damageStat = weapon.system.attribute.damage;
            if(damageStat == "none" || damageStat == ""){
                weapon.system.attribute.damageValue = 0;
            }else{
                weapon.system.attribute.damageValue = Math.floor(parseInt(sD.data.profile.main[damageStat].value)/10);
            }
        }

        //Talents

        //Special rules

        //Spells
    }

    _advancementInit(sD){

    }

    _updateItemData(item){
        let update  = [{_id: item.id, system: item.system}];
        return this.actor.updateEmbeddedDocuments("Item",update);
    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: game.i18n.localize("wfrp2e.characters.ui.newItem"),
            type: element.dataset.type,
        };


        return this.actor.createEmbeddedDocuments("Item",[itemData]);
    }

    _onWeaponEquip(event){
        event.preventDefault();
        let element = event.currentTarget;

        let ph = this.actor.items.filter(function(item) {return item.id == element.dataset.weapon})
        let weapon = ph[0];

        weapon.system.equiped = true;
        weapon.system.heldIn = -1;

        return this._updateItemData(weapon);
    }

    _onWeaponRemove(event){
        event.preventDefault();
        let element = event.currentTarget;

        let ph = this.actor.items.filter(function(item) {return item.id == element.dataset.weapon})
        let weapon = ph[0];

        weapon.system.equiped = false;

        return this._updateItemData(weapon);
    }

    _onWeaponRemoveFromWeapons(id){
        console.log("id of weapon beeing removed " );
        /*let ph = this.actor.items.filter(function(item) {return item.id == id})
        let weapon = ph[0];

        console.log("trying to remove weapon " + weapon.name);
        weapon.system.equiped = false;

        return this._updateItemData(weapon);*/
    }

    _onUseConsumable(event){
        event.preventDefault();
        let element = event.currentTarget;

        let ph = this.actor.items.filter(function(item) {return item.id == element.dataset.item})
        let item = ph[0];

        if(item.system.uses.value == 0){
            return;
        }
        
        if(item.system.uses.value == 1){
            item.system.quantity --;
            item.system.uses.value --;
            if(item.system.quantity != 0){
                item.system.uses.value = item.system.uses.max;
            }
        }else{
            item.system.uses.value --;
        }
        
        //Add a text blurb to the chat maybe?

        return this._updateItemData(item);
    }

    _onContainerChangedCarried(event){
        event.preventDefault();
        let element = event.currentTarget;

        let ph = this.actor.items.filter(function(item) {return item.id == element.dataset.containerid})
        let container = ph[0];

        container.system.carried = element.value;
        return this._updateItemData(container);
    }

    _onItemQuantityChange(event){
        event.preventDefault();
        let element = event.currentTarget;

        let ph = this.actor.items.filter(function(item) {return item.id == element.dataset.item})
        let item = ph[0];

        if (item.system.quantity == 0){
            if (item.type == "tool"){
                if(item.system.deteriorates)
                {
                    item.system.uses.value = item.system.uses.max;
                }
            }else{
                if(item.type == "consumable"){
                    item.system.uses.value = item.system.uses.max;
                }
            }
        }

        item.system.quantity = element.value;

        this._updateItemData(item);
    }

    _onContainerChanged(event){
        event.preventDefault();
        let element = event.currentTarget;

        let item = this.actor.items.filter(function (item) {return item.id == element.dataset.item});

        item[0].system.heldIn = element.value;

        let update  = [{_id: element.dataset.item, system: item[0].system}];

        return this.actor.updateEmbeddedDocuments("Item",update);
    }

    _deleteContainer(id){
        //Add a confirmation dialog

        for (let item of this.actor.items){
            if (item.system.heldIn == id){
                item.system.heldIn = -1;
                let update = [{_id: item.id, system: item.system}];
                this.actor.updateEmbeddedDocuments("Item",update);
            }
        }

        return this.actor.deleteEmbeddedDocuments("Item",[id]);
    }

    _onWeaponAttack(event){
        event.preventDefault();
        let element = event.currentTarget;

        let weapon = this.actor.items.filter(function (item) {return item.id == element.dataset.weapon});
        
        console.log("You would have attacked with " + weapon[0].name);
    }

    _onWeaponDamage(event){
        event.preventDefault();
        let element = event.currentTarget;

        let weapon = this.actor.items.filter(function (item) {return item.id == element.dataset.weapon});
        
        console.log("You would have rolled damage for " + weapon[0].name);
    }

    _onWeaponParry(event){
        event.preventDefault();
        let element = event.currentTarget;

        let weapon = this.actor.items.filter(function (item) {return item.id == element.dataset.weapon});
        
        console.log("You would have parried with " + weapon[0].name);
    }

    _onWeaponReload(event){
        event.preventDefault();
        let element = event.currentTarget;

        let weapon = this.actor.items.filter(function (item) {return item.id == element.dataset.weapon});
        
        console.log("You would have reloaded a " + weapon[0].name);
    }
}