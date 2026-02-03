export class CareerDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            // Whether this is the current career
            isCurrent: new fields.BooleanField({initial: false}),
            
            // Career entered checkbox
            careerEntered: new fields.BooleanField({initial: false}),
            
            // Description/notes
            description: new fields.StringField({initial: ""})
        };
    }
}