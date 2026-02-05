import { showRollDialog } from "../modules/roll-dialog.mjs";  

export class WHCharacter extends Actor {
    
    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData();
        // The DataModel's prepareDerivedData handles everything
    }

    /**
     * Roll a characteristic test (d100 roll-under)
     * @param {string} characteristic - The characteristic key (ws, bs, s, t, ag, int, wp, fel)
     * @returns {Promise<Roll>}
     */
    async rollCharacteristic(characteristic) {
        const charData = this.system.characteristics[characteristic];
        if (!charData) {
            ui.notifications.warn(`Characteristic ${characteristic} not found`);
            return null;
        }

        const baseTarget = charData.current;
        const title = `${characteristic.toUpperCase()} Test`;

        // Show the roll dialog
        await showRollDialog(title, baseTarget, async (finalTarget, modifier, rollMode) => {
            const roll = await new Roll("1d100").evaluate();
            
            // Determine success
            const isSuccess = roll.total <= finalTarget;
            const margin = Math.abs(finalTarget - roll.total);
            
            // Degrees of success/failure (every 10 points)
            const degrees = Math.floor(margin / 10);
            
            // Build the chat message
            let flavor = `<h3>${title}</h3>`;
            flavor += `<p><strong>Target:</strong> ${charData.current}`;
            if (modifier !== 0) {
                flavor += ` ${modifier >= 0 ? '+' : ''}${modifier} = ${finalTarget}`;
            }
            flavor += `</p>`;
            
            if (isSuccess) {
                flavor += `<p class="success"><strong>Success!</strong>`;
                if (degrees > 0) flavor += ` (${degrees} Degree${degrees > 1 ? 's' : ''})`;
                flavor += `</p>`;
            } else {
                flavor += `<p class="failure"><strong>Failure!</strong>`;
                if (degrees > 0) flavor += ` (${degrees} Degree${degrees > 1 ? 's' : ''})`;
                flavor += `</p>`;
            }

            // Send to chat with specified roll mode
            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: this}),
                flavor: flavor,
                rollMode: rollMode
            });

            return roll;
        });
    }

    /**
     * Roll a skill test (d100 roll-under)
     * @param {number} skillIndex - Index of the skill in the skills array
     * @returns {Promise<Roll>}
     */
    async rollSkill(skillIndex) {
        const skill = this.system.skills[skillIndex];
        if (!skill) {
            ui.notifications.warn(`Skill not found`);
            return null;
        }

        // Get the characteristic value
        const charKey = skill.characteristic.toLowerCase();
        const charValue = this.system.characteristics[charKey]?.current || 0;
        
        // Calculate skill total
        // If trained: characteristic + advances + modifier
        // If untrained: half of (characteristic + advances) + modifier
        const baseSkillTotal = skill.trained 
            ? charValue + skill.advances + skill.modifier
            : Math.floor((charValue + skill.advances) / 2) + skill.modifier;
        
        const title = `${skill.name || 'Skill'} Test`;

        // Show the roll dialog
        await showRollDialog(title, baseSkillTotal, async (finalTarget, modifier, rollMode) => {
            const roll = await new Roll("1d100").evaluate();
            
            // Determine success
            const isSuccess = roll.total <= finalTarget;
            const margin = Math.abs(finalTarget - roll.total);
            
            // Degrees of success/failure
            const degrees = Math.floor(margin / 10);
            
            // Build chat message
            let flavor = `<h3>${skill.name}</h3>`;
            flavor += `<p><strong>Base:</strong> ${skill.characteristic.toUpperCase()} ${charValue}`;
            if (skill.trained) {
                flavor += ` + ${skill.advances} advances`;
            } else {
                flavor += ` + ${skill.advances} advances ÷2 [untrained]`;
            }
            if (skill.modifier !== 0) {
                flavor += ` ${skill.modifier >= 0 ? '+' : ''}${skill.modifier}`;
            }
            flavor += ` = ${baseSkillTotal}`;
            if (modifier !== 0) {
                flavor += ` ${modifier >= 0 ? '+' : ''}${modifier} = ${finalTarget}`;
            }
            flavor += `</p>`;
            
            if (isSuccess) {
                flavor += `<p class="success"><strong>Success!</strong>`;
                if (degrees > 0) flavor += ` (${degrees} Degree${degrees > 1 ? 's' : ''})`;
                flavor += `</p>`;
            } else {
                flavor += `<p class="failure"><strong>Failure!</strong>`;
                if (degrees > 0) flavor += ` (${degrees} Degree${degrees > 1 ? 's' : ''})`;
                flavor += `</p>`;
            }

            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: this}),
                flavor: flavor,
                rollMode: rollMode
            });

            return roll;
        });
    }
    // Prepare derived data - calculates current values from initial and advances
    prepareDerivedData() {
        super.prepareDerivedData();
        const systemData = this.system;
        console.log("prepareDerivedData running for:", this.name);
        /* Safety check that data exists before processing
        if (!this.characteristics || !this.secondary || !this.experience) {
            return;
        }*/

        // Calculate current characteristic values (New Method)
        if (systemData.characteristics) {
            for (let [key, char] of Object.entries(systemData.characteristics)) {
                if (char && typeof char === "object") {
                    char.current = (char.initial || 0) + (char.talents || 0) + (char.advances || 0) + (char.misc || 0);
                    console.log(`${key}.current = ${char.current}`);
                }
            }
        }

        /* Calculate current characteristic values (Old Method)
        if (this.characteristics.ws) {
            this.characteristics.ws.current = 
                this.characteristics.ws.initial + this.characteristics.ws.talents + this.characteristics.ws.advances + this.characteristics.ws.misc;
        }
        if (this.characteristics.bs) {
            this.characteristics.bs.current = 
                this.characteristics.bs.initial + this.characteristics.bs.talents + this.characteristics.bs.advances + this.characteristics.bs.misc;
        }
        if (this.characteristics.s) {
            this.characteristics.s.current = 
                this.characteristics.s.initial + this.characteristics.s.talents + this.characteristics.s.advances + this.characteristics.s.misc;
        }
        if (this.characteristics.t) {
            this.characteristics.t.current = 
                this.characteristics.t.initial + this.characteristics.t.talents + this.characteristics.t.advances + this.characteristics.t.misc;
        }
        if (this.characteristics.ag) {
            this.characteristics.ag.current = 
                this.characteristics.ag.initial + this.characteristics.ag.talents + this.characteristics.ag.advances + this.characteristics.ag.misc;
        }
        if (this.characteristics.int) {
                this.characteristics.int.current = this.characteristics.int.initial + this.characteristics.int.talents + this.characteristics.int.advances + this.characteristics.int.misc;
        }
        if (this.characteristics.wp) {
                this.characteristics.wp.current = this.characteristics.wp.initial + this.characteristics.wp.talents + this.characteristics.wp.advances + this.characteristics.wp.misc;
        }
        if (this.characteristics.fel) {
                this.characteristics.fel.current = this.characteristics.fel.initial + this.characteristics.fel.talents + this.characteristics.fel.advances + this.characteristics.fel.misc;
        }
        // Calculate current secondary characteristics
        if (this.secondary.attacks) {
                this.secondary.attacks.current = this.secondary.attacks.initial + this.secondary.attacks.advances;
        }
        if (this.secondary.movement) {
                this.secondary.movement.current = this.secondary.movement.initial + this.secondary.movement.advances;
        }
        if (this.secondary.magic) {
                this.secondary.magic.current = this.secondary.magic.initial + this.secondary.magic.advances;
        }*/
        
        // Calculate Strength and Toughness Bonus
        if (this.characteristics.s && this.secondary.strengthBonus) {
                this.secondary.strengthBonus.value = Math.floor(this.characteristics.s.current / 10);
        }
        if (this.characteristics.t && this.secondary.toughnessBonus) {
                this.secondary.toughnessBonus.value = Math.floor(this.characteristics.t.current / 10);
        }

        // Calculate max wounds
        if (this.secondary.wounds) {
                this.secondary.wounds.max = this.secondary.wounds.initial + this.secondary.wounds.advances;
        }
        
        // Calculate available experience
        if (this.experience) {
                this.experience.current = this.experience.total - this.experience.spent;
        }
    }

}