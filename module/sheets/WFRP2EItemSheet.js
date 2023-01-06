import {wfrp2e} from "../config.js"

export default class WFRP2EItemSheet extends ItemSheet {

    constructor(...args){
        super(...args)

        var sheetType = this.object.type
        this.options.classes.push(sheetType)
        this.options.width = this.position.width = 530
        this.options.height = this.position.height = 340
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            classes: ["wfrp2e","sheet","item"] ,
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "default"}]
        })   
    }

    get template() {
        return `systems/wfrp2e/templates/sheets/${this.item.type}-sheet.html`;     
    }

    getData() {
        const baseData = super.getData();

        let sheetData ={
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            data: baseData.item.system,
            config: CONFIG.wfrp2e
        };

        switch (sheetData.item.type){
            case 'skill':
                this._skillInit(sheetData);
                break;
            
            case 'weapon':
                this._weaponInit(sheetData);
                break;
        }
        

        return sheetData;
    }

    effectContextMenu = [
        {
            name: game.i18n.localize("wfrp2e.characters.ui.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item",[element.data("item-id")]);
            }
        }
    ]


    _skillInit(sD){
        sD.attribute = game.i18n.localize(wfrp2e.attributes[sD.data.attribute]);
        sD.attributeAbr = game.i18n.localize(wfrp2e.attributesabbreviated[sD.data.attribute]);
    }

    _weaponInit(sD){
        if(sD.data.isRanged){
            if(sD.data.reload.units == "" || sD.data.reload.units == null){
                sD.data.reload.unitsAbr = game.i18n.localize(wfrp2e.actionsAbr.none);
            }else{
                sD.data.reload.unitsAbr = game.i18n.localize(wfrp2e.actionsAbr[sD.data.reload.units]);
            }     
        } 
    }
}