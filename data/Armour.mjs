export class ArmourDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({initial: ""})
            //cost: new fields.NumberField({initial: 0, min:0}),
            //encumberance: new fields.NumberField({initial: 0, min:0}),
            //head: new fields.BooleanField({initial: false}),
            //legLeft: new fields.BooleanField({initial: false}),
            //legRight: new fields.BooleanField({initial: false}),
            //armLeft: new fields.BooleanField({initial: false}),
            //armRight: new fields.BooleanField({initial: false}),
            //body: new fields.BooleanField({initial: false}),
            //armourPoints: new fields.NumberField({initial: 0, min:0}),
            //availability: new fields.StringField({initial: ""}),
        };
    }
}