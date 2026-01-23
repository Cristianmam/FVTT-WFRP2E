export class CharacterDataModel extends foundry.abstract.TypeDataModel
{
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            requiredString: new fields.StringField({required: true, blank: false}),
            positiveInteger: new fields.NumberField({required: true, nullable: false, integer: true, positive: true}),
            stringArray: new fields.ArrayField(new fields.StringField()),
            innerSchema: new fields.SchemaField({
                innerBoolean: new fields.BooleanField({initial: false}),
                numberSet: new fields.SetField(new fields.NumberField({nullable: false, min: 0, max: 1}))
            })
        }
    }
}