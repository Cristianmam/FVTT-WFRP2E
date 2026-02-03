export class WHCharacterSheet extends ActorSheet {
    
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["fvtt-wfrp2e", "sheet", "actor", "character"],
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
        
        // Add the actor's data to context for easy access
        context.system = this.actor.system;
        
        // Get career items
        context.careers = this.actor.items.filter(i => i.type === "career");
        
        // Find current career for display in header
        const currentCareer = context.careers.find(c => c.system.isCurrent);
        context.currentCareer = currentCareer ? currentCareer.name : "None";
        
        // Add any enriched HTML
        context.enrichedBiography = await TextEditor.enrichHTML(this.actor.system.biography, {async: true});
        context.enrichedHistory = await TextEditor.enrichHTML(this.actor.system.history, {async: true});
        context.enrichedNotes = await TextEditor.enrichHTML(this.actor.system.notes, {async: true});
        
        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Roll handlers - these work even if sheet is not editable
        html.find('.rollable-characteristic').click(this._onRollCharacteristic.bind(this));
        html.find('.rollable-skill').click(this._onRollSkill.bind(this));

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
        
        // Add Talent
        html.find('.add-talent').click(this._onAddTalent.bind(this));
        
        // Delete Talent
        html.find('.talent-delete').click(this._onDeleteTalent.bind(this));
        
        // Add Mutation
        html.find('.add-mutation').click(this._onAddMutation.bind(this));
        
        // Delete Mutation
        html.find('.mutation-delete').click(this._onDeleteMutation.bind(this));

        // Add Insanity
        html.find('.add-insanity').click(this._onAddInsanity.bind(this));
        
        // Delete Insanity
        html.find('.insanity-delete').click(this._onDeleteInsanity.bind(this));

        // Add Special Rule
        html.find('.add-special-rule').click(this._onAddSpecialRule.bind(this));
        
        // Delete Special Rule
        html.find('.special-rule-delete').click(this._onDeleteSpecialRule.bind(this));
    }

    /**
     * Handle adding a new skill
     * @param {Event} event   The originating click event
     * @private
     */
    async _onAddSkill(event) {
        event.preventDefault();
        
        const skills = this.actor.system.skills;
        const newSkill = {
            name: "",
            characteristic: "",
            trained: false,
            advances: 0,
            modifier: 0
        };
        
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
        
        const index = event.currentTarget.dataset.index;
        const skills = this.actor.system.skills;
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