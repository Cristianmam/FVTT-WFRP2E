export class CharacterDataModel extends foundry.abstract.TypeDataModel
{
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            // Personal Details
            personalDetails: new fields.SchemaField({
                race: new fields.StringField({initial: ""}),
                // Astrology
                starSign: new fields.StringField({initial: ""}),
                doom: new fields.StringField({initial: ""}),
                // Appearance
                gender: new fields.StringField({initial: ""}),
                build: new fields.StringField({initial: ""}),
                age: new fields.NumberField({required: true, nullable: false, integer: true, initial: 20}),
                height: new fields.StringField({initial: ""}),
                weight: new fields.StringField({initial: ""}),
                eyes: new fields.StringField({initial: ""}),
                skin: new fields.StringField({initial: ""}),
                hair: new fields.StringField({initial: ""}),
                distinguishingMarks: new fields.StringField({initial: ""})
            }),

            // Career Information - now handled by items, just store previous careers text
            previousCareersText: new fields.StringField({initial: ""}),

            // Main Characteristics (Starting values)
            characteristics: new fields.SchemaField({
                ws: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                bs: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                s: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                t: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                ag: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                int: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                wp: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                fel: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                })
            }),

            // Secondary Characteristics
            secondary: new fields.SchemaField({
                attacks: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 1}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 1})
                }),
                wounds: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    max: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                strengthBonus: new fields.SchemaField({
                    value: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                toughnessBonus: new fields.SchemaField({
                    value: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                movement: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 4}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 4})
                }),
                magic: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                insanityPoints: new fields.SchemaField({
                    current: new fields.NumberField({required: true, integer: true, initial: 0}),
                    total: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                fatePoints: new fields.SchemaField({
                    initial: new fields.NumberField({required: true, integer: true, initial: 0}),
                    current: new fields.NumberField({required: true, integer: true, initial: 0})
                })
            }),

            // Armour Points by Location
            armour: new fields.SchemaField({
                head: new fields.NumberField({required: true, integer: true, initial: 0}),
                body: new fields.NumberField({required: true, integer: true, initial: 0}),
                leftArm: new fields.NumberField({required: true, integer: true, initial: 0}),
                rightArm: new fields.NumberField({required: true, integer: true, initial: 0}),
                leftLeg: new fields.NumberField({required: true, integer: true, initial: 0}),
                rightLeg: new fields.NumberField({required: true, integer: true, initial: 0})
            }),

            // Experience and Advancement
            experience: new fields.SchemaField({
                total: new fields.NumberField({required: true, integer: true, initial: 0}),
                spent: new fields.NumberField({required: true, integer: true, initial: 0}),
                current: new fields.NumberField({required: true, integer: true, initial: 0})
            }),

            // Money
            money: new fields.SchemaField({
                gold: new fields.NumberField({required: true, integer: true, initial: 0}),
                silver: new fields.NumberField({required: true, integer: true, initial: 0}),
                brass: new fields.NumberField({required: true, integer: true, initial: 0})
            }),

            // Skills - stored as an array of skill objects
            skills: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    characteristic: new fields.StringField({required: true}),
                    trained: new fields.BooleanField({initial: false}),
                    advances: new fields.NumberField({required: true, integer: true, initial: 0}),
                    modifier: new fields.NumberField({required: true, integer: true, initial: 0})
                }),
                {initial: []}
            ),

            // Talents - stored as array
            talents: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    description: new fields.StringField({initial: ""}),
                    timesTaken: new fields.NumberField({required: true, integer: true, initial: 1})
                }),
                {initial: []}
            ),

            // Mutations - stored as array
            mutations: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    description: new fields.StringField({initial: ""})
                }),
                {initial: []}
            ),

            // Insanities - stored as array
            insanities: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    description: new fields.StringField({initial: ""})
                }),
                {initial: []}
            ),

            // Special Rules - stored as array
            specialRules: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    description: new fields.StringField({initial: ""})
                }),
                {initial: []}
            ),

            // Biography and notes
            biography: new fields.HTMLField({initial: ""}),
            history: new fields.HTMLField({initial: ""}),
            notes: new fields.HTMLField({initial: ""})
        }
    }

    // Prepare derived data - calculates current values from initial + advances
    prepareDerivedData() {
        // Safety check - ensure data exists before processing
        if (!this.characteristics || !this.secondary || !this.experience) {
            return;
        }

        // Calculate current characteristic values
        if (this.characteristics.ws) this.characteristics.ws.current = this.characteristics.ws.initial + this.characteristics.ws.advances;
        if (this.characteristics.bs) this.characteristics.bs.current = this.characteristics.bs.initial + this.characteristics.bs.advances;
        if (this.characteristics.s) this.characteristics.s.current = this.characteristics.s.initial + this.characteristics.s.advances;
        if (this.characteristics.t) this.characteristics.t.current = this.characteristics.t.initial + this.characteristics.t.advances;
        if (this.characteristics.ag) this.characteristics.ag.current = this.characteristics.ag.initial + this.characteristics.ag.advances;
        if (this.characteristics.int) this.characteristics.int.current = this.characteristics.int.initial + this.characteristics.int.advances;
        if (this.characteristics.wp) this.characteristics.wp.current = this.characteristics.wp.initial + this.characteristics.wp.advances;
        if (this.characteristics.fel) this.characteristics.fel.current = this.characteristics.fel.initial + this.characteristics.fel.advances;

        // Calculate current secondary characteristics
        if (this.secondary.attacks) {
            this.secondary.attacks.current = this.secondary.attacks.initial + this.secondary.attacks.advances;
        }
        if (this.secondary.movement) {
            this.secondary.movement.current = this.secondary.movement.initial + this.secondary.movement.advances;
        }
        if (this.secondary.magic) {
            this.secondary.magic.current = this.secondary.magic.initial + this.secondary.magic.advances;
        }
        
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