import {DEFAULT_SKILLS} from "../modules/default-skills.mjs";

export class WHCharacterSheet extends ActorSheet {
    
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["wfrp2e", "sheet", "actor", "character"],
            width: 700,
            height: 800,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}]
        });
    }

    /** @override */
    get template() {
        return "systems/fvtt-wfrp2e/templates/actor/character-sheet.html";
    }

    /** @override */
    async getData(options) {
        const context = await super.getData(options);
        
        context.system = this.actor.system; // Add the actor's data to context for easy access

        // Calculates target values for skills
        if (context.system.skills) {
            context.system.skills.forEach(skill => {
                const charKey = skill.characteristic?.toLowerCase();
                const charValue = this.actor.system.characteristics[charKey]?.current || 0;
        // Calculates skill total
                const skillTotal = skill.trained
                ? charValue + skill.advances + skill.modifier
                : Math.floor((charValue + skill.advances) / 2) + skill.modifier;
                skill.target = skillTotal;
            });
            }
        
        // Get items by type
        context.careers = this.actor.items.filter(i => i.type === "career");
        context.talents = this.actor.items.filter(i => i.type === "talent");
        context.mutations = this.actor.items.filter(i => i.type === "mutation");
        context.insanities = this.actor.items.filter(i => i.type === "insanity");
        
        // Debugging logs; adding these made items show up correctly to actor sheet
        console.log("Talents:", context.talents);
        console.log("Mutations:", context.mutations);
        console.log("Insanities:", context.insanities);
        
        // Find current career for display in header
        if (context.careers) {
            if (context.careers.length > 0) {
                const currentCareer = context.careers.find(c => c.system.isCurrent);
                context.currentCareer = currentCareer ? currentCareer.name : "None";
            }
        } else {
            context.currentCareer = "None";
        }
        
        this.SetCareerAdvancements();

        /*const currentCareer = context.careers.find(c => c.system.isCurrent);
        context.currentCareer = currentCareer ? currentCareer.name : "None";
        const actorData = context.actor?.system || context.system;

        if (actorData?.characteristics) {
            const chars = actorData.characteristics;
            if (currentCareer) {
                if (chars.ws?.hasOwnProperty('career')) chars.ws.career = careerData.careerWS || 0;
                if (chars.bs?.hasOwnProperty('career')) chars.bs.career = careerData.careerBS || 0;
                if (chars.s?.hasOwnProperty('career')) chars.s.career = careerData.careerS || 0;
                if (chars.t?.hasOwnProperty('career')) chars.t.career = careerData.careerT || 0;
                if (chars.ag?.hasOwnProperty('career')) chars.ag.career = careerData.careerAg || 0;
                if (chars.int?.hasOwnProperty('career')) chars.int.career = careerData.careerInt || 0;
                if (chars.wp?.hasOwnProperty('career')) chars.wp.career = careerData.careerWP || 0;
                if (chars.fel?.hasOwnProperty('career')) chars.fel.career = careerData.careerFel || 0;
            } else {
                if (chars.ws?.hasOwnProperty('career')) chars.ws.career = 0;
                if (chars.bs?.hasOwnProperty('career')) chars.bs.career = 0;
                if (chars.s?.hasOwnProperty('career')) chars.s.career = 0;
                if (chars.t?.hasOwnProperty('career')) chars.t.career = 0;
                if (chars.ag?.hasOwnProperty('career')) chars.ag.career = 0;
                if (chars.int?.hasOwnProperty('career')) chars.int.career = 0;
                if (chars.wp?.hasOwnProperty('career')) chars.wp.career = 0;
                if (chars.fel?.hasOwnProperty('career')) chars.fel.career = 0;
            }
        }
        if (actorData?.secondary) {
            const secondary = actorData.secondary;
            if (currentCareer) {
                const careerData = currentCareer.system;
                if (secondary.attacks?.hasOwnProperty('career')) secondary.attacks.career = careerData.careerAttacks || 0;
                if (secondary.wounds?.hasOwnProperty('career')) secondary.wounds.career = careerData.careerWounds || 0;
                if (secondary.movement?.hasOwnProperty('career')) secondary.movement.career = careerData.careerMovement || 0;
                if (secondary.magic?.hasOwnProperty('career')) secondary.magic.career = careerData.careerMagic || 0;
            } else {
                if (secondary.attacks?.hasOwnProperty('career')) secondary.attacks.career = 0;
                if (secondary.wounds?.hasOwnProperty('career')) secondary.wounds.career = 0;
                if (secondary.movement?.hasOwnProperty('career')) secondary.movement.career = 0;
                if (secondary.magic?.hasOwnProperty('career')) secondary.magic.career = 0;
            }
        }*/

        // Add enriched HTML
        context.enrichedBiography = await TextEditor.enrichHTML(this.actor.system.biography, {async: true});
        context.enrichedHistory = await TextEditor.enrichHTML(this.actor.system.history, {async: true});
        context.enrichedNotes = await TextEditor.enrichHTML(this.actor.system.notes, {async: true});
        
        return context;
    }

    SetCareerAdvancements() {
        if (!context.careers) {
            this.SetDefaultAdvancements();
            return;
        }
        const currentCareer = context.careers.find(c => c.system.isCurrent);
        context.currentCareer = currentCareer ? currentCareer.name : "None";
        const actorData = context.actor?.system || context.system;

        if (actorData?.characteristics) {
            const chars = actorData.characteristics;
            if (currentCareer) {
                if (chars.ws?.hasOwnProperty('career')) chars.ws.career = careerData.careerWS || 0;
                if (chars.bs?.hasOwnProperty('career')) chars.bs.career = careerData.careerBS || 0;
                if (chars.s?.hasOwnProperty('career')) chars.s.career = careerData.careerS || 0;
                if (chars.t?.hasOwnProperty('career')) chars.t.career = careerData.careerT || 0;
                if (chars.ag?.hasOwnProperty('career')) chars.ag.career = careerData.careerAg || 0;
                if (chars.int?.hasOwnProperty('career')) chars.int.career = careerData.careerInt || 0;
                if (chars.wp?.hasOwnProperty('career')) chars.wp.career = careerData.careerWP || 0;
                if (chars.fel?.hasOwnProperty('career')) chars.fel.career = careerData.careerFel || 0;
            } else {
                if (chars.ws?.hasOwnProperty('career')) chars.ws.career = 0;
                if (chars.bs?.hasOwnProperty('career')) chars.bs.career = 0;
                if (chars.s?.hasOwnProperty('career')) chars.s.career = 0;
                if (chars.t?.hasOwnProperty('career')) chars.t.career = 0;
                if (chars.ag?.hasOwnProperty('career')) chars.ag.career = 0;
                if (chars.int?.hasOwnProperty('career')) chars.int.career = 0;
                if (chars.wp?.hasOwnProperty('career')) chars.wp.career = 0;
                if (chars.fel?.hasOwnProperty('career')) chars.fel.career = 0;
            }
        }
        if (actorData?.secondary) {
            const secondary = actorData.secondary;
            if (currentCareer) {
                const careerData = currentCareer.system;
                if (secondary.attacks?.hasOwnProperty('career')) secondary.attacks.career = careerData.careerAttacks || 0;
                if (secondary.wounds?.hasOwnProperty('career')) secondary.wounds.career = careerData.careerWounds || 0;
                if (secondary.movement?.hasOwnProperty('career')) secondary.movement.career = careerData.careerMovement || 0;
                if (secondary.magic?.hasOwnProperty('career')) secondary.magic.career = careerData.careerMagic || 0;
            } else {
                if (secondary.attacks?.hasOwnProperty('career')) secondary.attacks.career = 0;
                if (secondary.wounds?.hasOwnProperty('career')) secondary.wounds.career = 0;
                if (secondary.movement?.hasOwnProperty('career')) secondary.movement.career = 0;
                if (secondary.magic?.hasOwnProperty('career')) secondary.magic.career = 0;
            }
        }
    }

    SetDefaultAdvancements() {
        console.log("Characteristc: Trying to set defauls");
        const chars = this.actor.system.characteristics;
        chars.ws.career = 0;
        chars.bs.career = 0;
        chars.s.career = 0;
        chars.t.career = 0;
        chars.ag.career = 0;
        chars.int.career = 0;
        chars.wp.career = 0;
        chars.fel.career = 0;
        const secondaryCharacteristics = this.actor.system.secondary;
        secondaryCharacteristics.attacks.career = 0;
        secondaryCharacteristics.wounds.career = 0;
        secondaryCharacteristics.movement.career = 0;
        secondaryCharacteristics.magic.career = 0;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Roll handlers - these work even if sheet is not editable
        html.find('.rollable-characteristic').click(this._onRollCharacteristic.bind(this));
        html.find('.skill-roll').click(this._onRollSkill.bind(this));

        // Item controls
        html.find('.item-edit').click(this._onItemEdit.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
        
        // Career toggles
        html.find('.career-current-toggle').change(this._onCareerCurrentToggle.bind(this));
        html.find('.career-entered-toggle').change(this._onCareerEnteredToggle.bind(this));

        // Add Skill
        html.find('.add-skill').click(this._onAddSkill.bind(this));
        
        // Delete Skill
        html.find('.skill-delete').click(this._onDeleteSkill.bind(this));
        
        // Add Special Rule
        html.find('.add-special-rule').click(this._onAddSpecialRule.bind(this));
        
        // Delete Special Rule
        html.find('.special-rule-delete').click(this._onDeleteSpecialRule.bind(this));

        // Careen item updates to main tab
        this.actor.items.forEach(item => {
            if (item.type === "career") {
                Hooks.on('updateItem', (item, changes) => {
                    if (changes.system?.isCurrent !== undefined) {
                        this.render(false);
                    }
                });
            };
        });
    }

    /**
     * Handle adding a new skill
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddSkill(event) {
        event.preventDefault();
        
        // Generate console logs for debugging
        console.log("Button clicked:", event.currentTarget);
        console.log("Dataset:", event.currentTarget.dataset);
        console.log("Category from dataset:", event.currentTarget.dataset.category);

        const category = event.currentTarget.dataset.category || "basic";
        console.log("Final category:", category); // More console logging
        const skills = this.actor.system.skills;
        const newSkill = {
            name: "",
            characteristic: "",
            category: category,
            trained: false,
            advances: 0,
            modifier: 0
        };
        
        console.log("New skill being created:", newSkill); // Even MORE console logging

        await this.actor.update({
            "system.skills": [...skills, newSkill]
        });
    }

    /**
     * Handle deleting a skill
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteSkill(event) {
        event.preventDefault();
        
        const index = parseInt(event.currentTarget.dataset.index);
        const skills = [...this.actor.system.skills];
        
        // Remove the skill at the specified index
        skills.splice(index, 1);
        
        await this.actor.update({
            "system.skills": skills
        });
    }

    /**
     * Handle adding a new talent
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddTalent(event) {
        event.preventDefault();
        
        const talents = this.actor.system.talents;
        const newTalent = {
            name: "",
            description: "",
            timesTaken: 1
        };
        
        await this.actor.update({
            "system.talents": [...talents, newTalent]
        });
    }

    /**
     * Handle deleting a talent
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteTalent(event) {
        event.preventDefault();
        
        const index = event.currentTarget.dataset.index;
        const talents = this.actor.system.talents;
        talents.splice(index, 1);
        
        await this.actor.update({
            "system.talents": talents
        });
    }

    /**
     * Handle rolling a characteristic
     * @param {Event} event   The originating click event
     * @private
     */
    async _onRollCharacteristic(event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        await this.actor.rollCharacteristic(characteristic);
    }

    /**
     * Handle rolling a skill
     * @param {Event} event   The originating click event
     * @private
     */
    async _onRollSkill(event) {
        event.preventDefault();
        const skillIndex = parseInt(event.currentTarget.dataset.skillIndex);
        await this.actor.rollSkill(skillIndex);
    }

    /**
     * Handle editing an item
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemEdit(event) {
        event.preventDefault();
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            item.sheet.render(true);
        }
    }

    /**
     * Handle deleting an item
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemDelete(event) {
        event.preventDefault();
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            await item.delete();
        }
    }

    /**
     * Handle toggling career as current
     * @param {Event} event   The originating change event
     * @private
     */
    async _onCareerCurrentToggle(event) {
        event.preventDefault();
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);
        const isChecked = event.currentTarget.checked;
        
        if (!item) return;
        
        // If checking this career as current, uncheck all other careers
        if (isChecked) {
            const otherCareers = this.actor.items.filter(i => i.type === "career" && i.id !== itemId);
            for (let career of otherCareers) {
                if (career.system.isCurrent) {
                    await career.update({"system.isCurrent": false});
                }
            }
        }
        
        // Toggle this career
        await item.update({"system.isCurrent": isChecked});
    }

    /**
     * Handle toggling career as entered
     * @param {Event} event   The originating change event
     * @private
     */
    async _onCareerEnteredToggle(event) {
        event.preventDefault();
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);
        const isChecked = event.currentTarget.checked;
        
        if (!item) return;
        
        await item.update({"system.careerEntered": isChecked});
    }

    /**
     * Handle adding a new mutation
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddMutation(event) {
        event.preventDefault();
        
        const mutations = this.actor.system.mutations;
        const newMutation = {
            name: "",
            description: ""
        };
        
        await this.actor.update({
            "system.mutations": [...mutations, newMutation]
        });
    }

    /**
     * Handle deleting a mutation
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteMutation(event) {
        event.preventDefault();
        
        const index = event.currentTarget.dataset.index;
        const mutations = this.actor.system.mutations;
        mutations.splice(index, 1);
        
        await this.actor.update({
            "system.mutations": mutations
        });
    }

    /**
     * Handle adding a new insanity
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddInsanity(event) {
        event.preventDefault();
        
        const insanities = this.actor.system.insanities;
        const newInsanity = {
            name: "",
            description: ""
        };
        
        await this.actor.update({
            "system.insanities": [...insanities, newInsanity]
        });
    }

    /**
     * Handle deleting an insanity
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteInsanity(event) {
        event.preventDefault();
        
        const index = event.currentTarget.dataset.index;
        const insanities = this.actor.system.insanities;
        insanities.splice(index, 1);
        
        await this.actor.update({
            "system.insanities": insanities
        });
    }

    /**
     * Handle adding a new special rule
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddSpecialRule(event) {
        event.preventDefault();
        
        const specialRules = this.actor.system.specialRules;
        const newRule = {
            name: "",
            description: ""
        };
        
        await this.actor.update({
            "system.specialRules": [...specialRules, newRule]
        });
    }

    /**
     * Handle deleting a special rule
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteSpecialRule(event) {
        event.preventDefault();
        
        const index = event.currentTarget.dataset.index;
        const specialRules = this.actor.system.specialRules;
        specialRules.splice(index, 1);
        
        await this.actor.update({
            "system.specialRules": specialRules
        });
    }
}