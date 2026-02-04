export class WeaponDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({initial: ""})
            //cost: new fields.NumberField({initial: 0, min:0}),
            //encumberance: new fields.NumberField({initial: 0, min:0}),
            //group: new fields.StringField({initial: ""}),
            //damage: new fields.NumberField({initial: 0, min:0}),
            //range: new fields.NumberField({initial: 0, min:0}),
            //reload: new fields.StringField({initial: ""}),
            //qualities: new fields.StringField({initial: ""}),
            //availability: new fields.StringField({initial: ""})
        };
    }
}