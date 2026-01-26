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
}