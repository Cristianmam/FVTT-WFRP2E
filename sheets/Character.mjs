export class WHCharacterSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["wfrp2e", "sheet", "actor"],
        template: "systems/wfrp2e/templates/actor/WHCaracterSheet.html",
        width: 600,
        height: 600,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
        });
    }

    /** @override */
    get template() {
        return `systems/wfrp2e/templates/actor/actor-${this.actor.type}-sheet.html`;
    }
}